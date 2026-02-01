import { CurrencyQuote } from '@/hooks/useCurrencyQuotes';
import { CURRENCIES } from './currencies';

export interface ExportData {
  date: string;
  currencyCode: string;
  currencyName: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
}

// Converter dados de cotação para formato de exportação
export function formatQuotesForExport(quotes: CurrencyQuote[], currencyCode: string): ExportData[] {
  const currency = CURRENCIES[currencyCode];
  return quotes.map((quote) => ({
    date: new Date(quote.dataHoraCotacao).toLocaleDateString('pt-BR'),
    currencyCode: currencyCode,
    currencyName: currency?.name || currencyCode,
    buyPrice: quote.cotacaoCompra,
    sellPrice: quote.cotacaoVenda,
    spread: quote.cotacaoVenda - quote.cotacaoCompra,
  }));
}

// Exportar para CSV
export function exportToCSV(data: ExportData[], filename: string = 'cotacoes.csv') {
  const headers = ['Data', 'Código', 'Moeda', 'Compra (R$)', 'Venda (R$)', 'Spread (R$)'];
  const rows = data.map((item) => [
    item.date,
    item.currencyCode,
    item.currencyName,
    item.buyPrice.toFixed(4),
    item.sellPrice.toFixed(4),
    item.spread.toFixed(4),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
}

// Exportar para Excel (XLSX)
export async function exportToExcel(data: ExportData[], filename: string = 'cotacoes.xlsx') {
  try {
    // Dinâmicamente importar xlsx para reduzir bundle size
    const XLSX = await import('xlsx');

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Data: item.date,
        Código: item.currencyCode,
        Moeda: item.currencyName,
        'Compra (R$)': item.buyPrice.toFixed(4),
        'Venda (R$)': item.sellPrice.toFixed(4),
        'Spread (R$)': item.spread.toFixed(4),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotações');

    // Ajustar largura das colunas
    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Erro ao exportar para Excel. Verifique se a biblioteca está disponível.');
  }
}

// Exportar para PDF
export async function exportToPDF(
  data: ExportData[],
  currencyCode: string,
  filename: string = 'cotacoes.pdf'
) {
  try {
    const jsPDF = (await import('jspdf')).default;
    const { autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    const currency = CURRENCIES[currencyCode];

    // Adicionar título
    doc.setFontSize(16);
    doc.text(`Cotação de ${currency?.name || currencyCode}`, 14, 15);

    // Adicionar data de geração
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 25);
    doc.text('Fonte: Banco Central do Brasil - API Olinda (PTAX)', 14, 32);

    // Adicionar tabela
    autoTable(doc, {
      head: [['Data', 'Compra (R$)', 'Venda (R$)', 'Spread (R$)']],
      body: data.map((item) => [
        item.date,
        item.buyPrice.toFixed(4),
        item.sellPrice.toFixed(4),
        item.spread.toFixed(4),
      ]),
      startY: 40,
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(filename);
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    throw new Error('Erro ao exportar para PDF. Verifique se as bibliotecas estão disponíveis.');
  }
}

// Função auxiliar para download
function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Gerar URL para Power BI
export function generatePowerBIUrl(currencyCode: string): string {
  const baseUrl = 'https://app.powerbi.com/';
  const params = new URLSearchParams({
    'groupId': 'me',
    'dashboardId': 'cotacoes-moedas',
  });

  return `${baseUrl}?${params.toString()}`;
}

// Gerar dados para integração com Power BI (formato JSON)
export function generatePowerBIData(
  data: ExportData[],
  currencyCode: string
): Record<string, unknown> {
  const currency = CURRENCIES[currencyCode];
  return {
    metadata: {
      source: 'Banco Central do Brasil - API Olinda (PTAX)',
      currency: currencyCode,
      currencyName: currency?.name,
      generatedAt: new Date().toISOString(),
      recordCount: data.length,
    },
    data: data.map((item) => ({
      date: item.date,
      buyPrice: item.buyPrice,
      sellPrice: item.sellPrice,
      spread: item.spread,
      average: (item.buyPrice + item.sellPrice) / 2,
    })),
    statistics: {
      maxPrice: Math.max(...data.map((d) => d.sellPrice)),
      minPrice: Math.min(...data.map((d) => d.sellPrice)),
      avgPrice:
        data.reduce((sum, d) => sum + d.sellPrice, 0) / data.length,
      totalRecords: data.length,
    },
  };
}
