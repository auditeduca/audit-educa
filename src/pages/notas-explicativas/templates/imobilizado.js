// Template de Imobilizado (CPC 27)
export default {
  id: 'imobilizado',
  titulo: 'Imobilizado',
  norma: 'CPC 27 / IAS 16',
  descricao: 'Composição do ativo imobilizado, taxas de depreciação e movimentações do período.',
  campos: [
    { id: 'ano', label: 'Ano', type: 'number', placeholder: '2024' },
    { id: 'custo_aquisicao', label: 'Custo de Aquisição', type: 'number' },
    { id: 'depreciacao_acumulada', label: 'Depreciação Acumulada', type: 'number' },
    { id: 'taxa_media', label: 'Taxa média anual de depreciação (%)', type: 'number', placeholder: '10' },
    { id: 'adicoes', label: 'Adições no período', type: 'number' },
    { id: 'baixas', label: 'Baixas no período', type: 'number' },
  ],
  gerarTexto: (dados) => {
    const formatNumber = (val) => (val ? Number(val).toLocaleString('pt-BR') : '0');
    const valorLiquido = (dados.custo_aquisicao || 0) - (dados.depreciacao_acumulada || 0);
    return `
## 13. Imobilizado

a) Composição e movimentação

O imobilizado está demonstrado ao custo de aquisição, deduzido da depreciação acumulada, calculada pelo método linear com base nas taxas anuais que levam em consideração a vida útil estimada dos bens.

| Descrição | Custo | Depreciação Acumulada | Líquido |
|-----------|-------|----------------------|---------|
| Saldo em ${dados.ano || '2024'} | ${formatNumber(dados.custo_aquisicao)} | (${formatNumber(dados.depreciacao_acumulada)}) | ${formatNumber(valorLiquido)} |

b) Taxas de depreciação

A taxa média anual de depreciação utilizada foi de ${dados.taxa_media || '10'}% ao ano, aplicada sobre o custo dos bens.

c) Movimentação do período

- Adições: ${formatNumber(dados.adicoes)}
- Baixas: ${formatNumber(dados.baixas)}
- Despesa de depreciação reconhecida no resultado: ${formatNumber(dados.depreciacao_acumulada)} (já considerada na depreciação acumulada).
    `;
  }
};