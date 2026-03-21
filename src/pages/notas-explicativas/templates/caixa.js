// Template de Caixa e Equivalentes de Caixa (CPC 03)
export default {
  id: 'caixa-equivalentes',
  titulo: 'Caixa e Equivalentes de Caixa',
  norma: 'CPC 03 (R2)',
  descricao: 'Composição dos saldos de caixa, depósitos bancários e aplicações financeiras de curto prazo.',
  campos: [
    { id: 'ano1', label: 'Ano atual', type: 'number', placeholder: '2024' },
    { id: 'ano2', label: 'Ano anterior', type: 'number', placeholder: '2023' },
    { id: 'consolidado1_cc', label: 'Consolidado - Conta corrente (ano atual)', type: 'number' },
    { id: 'consolidado2_cc', label: 'Consolidado - Conta corrente (ano anterior)', type: 'number' },
    { id: 'controladora1_cc', label: 'Controladora - Conta corrente (ano atual)', type: 'number' },
    { id: 'controladora2_cc', label: 'Controladora - Conta corrente (ano anterior)', type: 'number' },
    { id: 'consolidado1_dv', label: 'Consolidado - Depósitos à vista (ano atual)', type: 'number' },
    { id: 'consolidado2_dv', label: 'Consolidado - Depósitos à vista (ano anterior)', type: 'number' },
    { id: 'controladora1_dv', label: 'Controladora - Depósitos à vista (ano atual)', type: 'number' },
    { id: 'controladora2_dv', label: 'Controladora - Depósitos à vista (ano anterior)', type: 'number' },
    { id: 'consolidado1_cx', label: 'Consolidado - Caixa (ano atual)', type: 'number' },
    { id: 'consolidado2_cx', label: 'Consolidado - Caixa (ano anterior)', type: 'number' },
    { id: 'controladora1_cx', label: 'Controladora - Caixa (ano atual)', type: 'number' },
    { id: 'controladora2_cx', label: 'Controladora - Caixa (ano anterior)', type: 'number' },
    { id: 'consolidado1_dep3m', label: 'Consolidado - Depósito 3 meses (ano atual)', type: 'number' },
    { id: 'consolidado2_dep3m', label: 'Consolidado - Depósito 3 meses (ano anterior)', type: 'number' },
    { id: 'consolidado1_saque', label: 'Consolidado - Saque a descoberto (ano atual)', type: 'number' },
    { id: 'consolidado2_saque', label: 'Consolidado - Saque a descoberto (ano anterior)', type: 'number' },
    { id: 'controladora1_saque', label: 'Controladora - Saque a descoberto (ano atual)', type: 'number' },
    { id: 'controladora2_saque', label: 'Controladora - Saque a descoberto (ano anterior)', type: 'number' },
    { id: 'restricao_valor', label: 'Valor sujeito a restrição', type: 'number', placeholder: '300' },
    { id: 'restricao_ano', label: 'Ano da restrição', type: 'number', placeholder: '2024' },
    { id: 'restricao_descricao', label: 'Descrição da restrição', type: 'textarea', placeholder: 'Descreva a natureza da restrição...' },
  ],
  gerarTexto: (dados) => {
    const formatNumber = (val) => (val ? Number(val).toLocaleString('pt-BR') : '0');
    return `
## 12. Caixa e equivalentes de caixa

Veja política contábil na nota explicativa 10(P)(i)-(ii) e (S)(i).

| Em milhares de Reais | Consolidado | Controladora |
|---|---|---|
|    | ${dados.ano1 || '2024'} | ${dados.ano2 || '2023'} | ${dados.ano1 || '2024'} | ${dados.ano2 || '2023'} |
| Conta corrente | ${formatNumber(dados.consolidado1_cc)} | ${formatNumber(dados.consolidado2_cc)} | ${formatNumber(dados.controladora1_cc)} | ${formatNumber(dados.controladora2_cc)} |
| Depósitos à vista | ${formatNumber(dados.consolidado1_dv)} | ${formatNumber(dados.consolidado2_dv)} | ${formatNumber(dados.controladora1_dv)} | ${formatNumber(dados.controladora2_dv)} |
| Caixa | ${formatNumber(dados.consolidado1_cx)} | ${formatNumber(dados.consolidado2_cx)} | ${formatNumber(dados.controladora1_cx)} | ${formatNumber(dados.controladora2_cx)} |
| Depósito de três meses (Caixa e Equivalente) | ${formatNumber(dados.consolidado1_dep3m)} | ${formatNumber(dados.consolidado2_dep3m)} | - | - |
| **Caixa e equivalentes de caixa no balanço patrimonial** | ${formatNumber((dados.consolidado1_cc||0)+(dados.consolidado1_dv||0)+(dados.consolidado1_cx||0)+(dados.consolidado1_dep3m||0))} | ${formatNumber((dados.consolidado2_cc||0)+(dados.consolidado2_dv||0)+(dados.consolidado2_cx||0)+(dados.consolidado2_dep3m||0))} | ${formatNumber((dados.controladora1_cc||0)+(dados.controladora1_dv||0)+(dados.controladora1_cx||0))} | ${formatNumber((dados.controladora2_cc||0)+(dados.controladora2_dv||0)+(dados.controladora2_cx||0))} |
| Saque a descoberto utilizado para fins de gestão de caixa | (${formatNumber(dados.consolidado1_saque)}) | (${formatNumber(dados.consolidado2_saque)}) | ${formatNumber(dados.controladora1_saque || 0)} | ${formatNumber(dados.controladora2_saque || 0)} |

**Caixa e equivalentes de caixa na demonstração dos fluxos de caixa**  
${formatNumber(((dados.consolidado1_cc||0)+(dados.consolidado1_dv||0)+(dados.consolidado1_cx||0)+(dados.consolidado1_dep3m||0)) - (dados.consolidado1_saque||0))} | ${formatNumber(((dados.consolidado2_cc||0)+(dados.consolidado2_dv||0)+(dados.consolidado2_cx||0)+(dados.consolidado2_dep3m||0)) - (dados.consolidado2_saque||0))} | ${formatNumber(((dados.controladora1_cc||0)+(dados.controladora1_dv||0)+(dados.controladora1_cx||0)) - (dados.controladora1_saque||0))} | ${formatNumber(((dados.controladora2_cc||0)+(dados.controladora2_dv||0)+(dados.controladora2_cx||0)) - (dados.controladora2_saque||0))}  

Um montante de ${formatNumber(dados.restricao_valor)} mil (${dados.restricao_ano}: zero) incluído em depósitos à vista está sujeito a restrições impostas por determinados clientes. ${dados.restricao_descricao || ''}
    `;
  }
};