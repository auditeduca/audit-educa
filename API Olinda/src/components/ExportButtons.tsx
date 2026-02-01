import { useState } from 'react';
import { Download, FileText, Sheet, BarChart3, Loader2 } from 'lucide-react';
import { CurrencyQuote } from '@/hooks/useCurrencyQuotes';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  formatQuotesForExport,
  generatePowerBIData,
} from '@/lib/export';

interface ExportButtonsProps {
  quotes: CurrencyQuote[];
  currencyCode: string;
  currencyName: string;
  disabled?: boolean;
}

export default function ExportButtons({
  quotes,
  currencyCode,
  currencyName,
  disabled = false,
}: ExportButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const data = formatQuotesForExport(quotes, currencyCode);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `cotacao-${currencyCode}-${timestamp}`;

  const handleExportCSV = async () => {
    try {
      setLoading('csv');
      setError(null);
      exportToCSV(data, `${filename}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar CSV');
    } finally {
      setLoading(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading('excel');
      setError(null);
      await exportToExcel(data, `${filename}.xlsx`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar Excel');
    } finally {
      setLoading(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading('pdf');
      setError(null);
      await exportToPDF(data, currencyCode, `${filename}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar PDF');
    } finally {
      setLoading(null);
    }
  };

  const handleExportPowerBI = () => {
    try {
      setLoading('pbi');
      setError(null);
      const pbiData = generatePowerBIData(data, currencyCode);

      // Copiar dados para clipboard
      const json = JSON.stringify(pbiData, null, 2);
      navigator.clipboard.writeText(json).then(() => {
        alert(
          'Dados copiados para clipboard! Cole em um arquivo JSON para usar no Power BI.'
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar dados Power BI');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExportCSV}
          disabled={disabled || loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
        >
          {loading === 'csv' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          CSV
        </button>

        <button
          onClick={handleExportExcel}
          disabled={disabled || loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
        >
          {loading === 'excel' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sheet className="w-4 h-4" />
          )}
          Excel
        </button>

        <button
          onClick={handleExportPDF}
          disabled={disabled || loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
        >
          {loading === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          PDF
        </button>

        <button
          onClick={handleExportPowerBI}
          disabled={disabled || loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
        >
          {loading === 'pbi' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <BarChart3 className="w-4 h-4" />
          )}
          Power BI
        </button>
      </div>

      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
