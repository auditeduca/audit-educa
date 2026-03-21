// Template de Outros Investimentos e Derivativos
export default {
  id: 'outros-investimentos',
  titulo: 'Outros investimentos, incluindo derivativos',
  norma: 'CPC 48 / IFRS 9 / CPC 38',
  descricao: 'Composição de títulos públicos, derivativos e outros investimentos, segregados por circulante e não circulante.',
  campos: [
    // Anos
    { id: 'ano1', label: 'Ano atual', type: 'number', placeholder: '2024' },
    { id: 'ano2', label: 'Ano anterior', type: 'number', placeholder: '2023' },
    
    // Circulante
    { id: 'titulos_publicos_vjr_1', label: 'Títulos públicos – obrigatoriamente a VJR (ano atual)', type: 'number' },
    { id: 'titulos_publicos_vjr_2', label: 'Títulos públicos – obrigatoriamente a VJR (ano anterior)', type: 'number' },
    { id: 'cambio_hedge_1', label: 'Contratos de câmbio utilizados para hedge (ano atual)', type: 'number' },
    { id: 'cambio_hedge_2', label: 'Contratos de câmbio utilizados para hedge (ano anterior)', type: 'number' },
    { id: 'cambio_outros_1', label: 'Outros contratos de câmbio (ano atual)', type: 'number' },
    { id: 'cambio_outros_2', label: 'Outros contratos de câmbio (ano anterior)', type: 'number' },
    
    // Não circulante
    { id: 'divida_custo_amort_1', label: 'Títulos de dívida corporativos a custo amortizado (ano atual)', type: 'number' },
    { id: 'divida_custo_amort_2', label: 'Títulos de dívida corporativos a custo amortizado (ano anterior)', type: 'number' },
    { id: 'divida_vjora_1', label: 'Títulos de dívida corporativos pelo VJORA (ano atual)', type: 'number' },
    { id: 'divida_vjora_2', label: 'Títulos de dívida corporativos pelo VJORA (ano anterior)', type: 'number' },
    { id: 'acoes_vjora_1', label: 'Ações mensuradas pelo VJORA (ano atual)', type: 'number' },
    { id: 'acoes_vjora_2', label: 'Ações mensuradas pelo VJORA (ano anterior)', type: 'number' },
    { id: 'acoes_vjr_1', label: 'Ações obrigatoriamente a VJR (ano atual)', type: 'number' },
    { id: 'acoes_vjr_2', label: 'Ações obrigatoriamente a VJR (ano anterior)', type: 'number' },
    { id: 'swap_hedge_1', label: 'Swap de taxa de juros utilizados para hedge (ano atual)', type: 'number' },
    { id: 'swap_hedge_2', label: 'Swap de taxa de juros utilizados para hedge (ano anterior)', type: 'number' },
  ],
  gerarTexto: (dados) => {
    const formatNumber = (val) => (val ? Number(val).toLocaleString('pt-BR') : '0');
    
    // Totais calculados
    const totalCirculante1 = (dados.titulos_publicos_vjr_1||0) + (dados.cambio_hedge_1||0) + (dados.cambio_outros_1||0);
    const totalCirculante2 = (dados.titulos_publicos_vjr_2||0) + (dados.cambio_hedge_2||0) + (dados.cambio_outros_2||0);
    const totalNaoCirculante1 = (dados.divida_custo_amort_1||0) + (dados.divida_vjora_1||0) + (dados.acoes_vjora_1||0) + (dados.acoes_vjr_1||0) + (dados.swap_hedge_1||0);
    const totalNaoCirculante2 = (dados.divida_custo_amort_2||0) + (dados.divida_vjora_2||0) + (dados.acoes_vjora_2||0) + (dados.acoes_vjr_2||0) + (dados.swap_hedge_2||0);

    return `
## 13. Outros investimentos, incluindo derivativos

Veja política contábil nas notas explicativas 10(P) e (S)(i).

| Em milhares de Reais | Consolidado |    |
|---|---|---|
|    | ${dados.ano1 || '2024'}    | ${dados.ano2 || '2023'} |
| Circulante    |    |    |
| Títulos públicos – obrigatoriamente a VJR | ${formatNumber(dados.titulos_publicos_vjr_1)}    | ${formatNumber(dados.titulos_publicos_vjr_2)}  |
| Contratos de câmbio utilizados para hedge | ${formatNumber(dados.cambio_hedge_1)}    | ${formatNumber(dados.cambio_hedge_2)}  |
| Outros contratos de câmbio | ${formatNumber(dados.cambio_outros_1)}    | ${formatNumber(dados.cambio_outros_2)}   |
|    | ${formatNumber(totalCirculante1)}    | ${formatNumber(totalCirculante2)} |

| Não circulante    |    |    |
| Títulos de dívida corporativos a custo amortizado | ${formatNumber(dados.divida_custo_amort_1)} | ${formatNumber(dados.divida_custo_amort_2)} |
| Títulos de dívida corporativos pelo VJORA | ${formatNumber(dados.divida_vjora_1)}    | ${formatNumber(dados.divida_vjora_2)}  |
| Ações mensuradas pelo VJORA | ${formatNumber(dados.acoes_vjora_1)}    | ${formatNumber(dados.acoes_vjora_2)}  |
| Ações obrigatoriamente a VJR | ${formatNumber(dados.acoes_vjr_1)}    | ${formatNumber(dados.acoes_vjr_2)}  |
| Swap de taxa de juros utilizados para hedge | ${formatNumber(dados.swap_hedge_1)}    | ${formatNumber(dados.swap_hedge_2)}  |
|    | ${formatNumber(totalNaoCirculante1)}    | ${formatNumber(totalNaoCirculante2)} |
    `;
  }
};