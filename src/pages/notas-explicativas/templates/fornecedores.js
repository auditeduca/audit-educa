// Template de Fornecedores (CPC 48)
export default {
  id: 'fornecedores',
  titulo: 'Fornecedores',
  norma: 'CPC 48 / IFRS 9',
  descricao: 'Saldos a pagar a fornecedores, prazos médios e concentração.',
  campos: [
    { id: 'ano', label: 'Ano', type: 'number', placeholder: '2024' },
    { id: 'saldo_total', label: 'Saldo total de fornecedores', type: 'number' },
    { id: 'curto_prazo', label: 'Parcela de curto prazo', type: 'number' },
    { id: 'longo_prazo', label: 'Parcela de longo prazo', type: 'number' },
    { id: 'prazo_medio', label: 'Prazo médio de pagamento (dias)', type: 'number' },
    { id: 'principais_fornecedores', label: 'Principais fornecedores', type: 'textarea', placeholder: 'Ex: Fornecedor A (30%), Fornecedor B (20%)' },
  ],
  gerarTexto: (dados) => {
    const formatNumber = (val) => (val ? Number(val).toLocaleString('pt-BR') : '0');
    return `
## 14. Fornecedores

Os saldos a pagar a fornecedores referem-se a obrigações com fornecedores de bens e serviços no curso normal dos negócios, sendo classificados no passivo circulante, exceto aqueles com vencimento superior a 12 meses da data do balanço.

Em ${dados.ano || '2024'}, o saldo total é de ${formatNumber(dados.saldo_total)}, assim distribuído:
- Circulante: ${formatNumber(dados.curto_prazo)}
- Não circulante: ${formatNumber(dados.longo_prazo)}

O prazo médio de pagamento é de ${dados.prazo_medio || '0'} dias.

Concentração de fornecedores:  
${dados.principais_fornecedores || 'Não há concentração significativa.'}
    `;
  }
};