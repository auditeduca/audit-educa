export const auditReport = {
  name: '🔍 Relatório de Auditoria Financeira',
  description: 'Relatório profissional de auditoria',
  category: 'Relatórios',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">RELATÓRIO DE AUDITORIA FINANCEIRA</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Exercício: {{fiscalYear}}</p>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INTRODUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">Este relatório apresenta os resultados da auditoria financeira realizada na <strong>{{companyName}}</strong> referente ao exercício de {{fiscalYear}}.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. ESCOPO DA AUDITORIA</h2>
        <p style="margin: 0 0 20px 0;">{{auditScope}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. PROCEDIMENTOS EXECUTADOS</h2>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Análise de demonstrações financeiras;</li>
            <li>Verificação de controles internos;</li>
            <li>Teste de transações e saldos;</li>
            <li>Avaliação de conformidade regulatória.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ACHADOS E OBSERVAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{findings}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. CONCLUSÕES</h2>
        <p style="margin: 0 0 20px 0;">{{conclusions}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. RECOMENDAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{auditorName}}</p>
                    <p style="margin: 5px 0;">Auditor Responsável</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">Representante da Empresa</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['fiscalYear', 'companyName', 'auditScope', 'findings', 'conclusions', 'recommendations', 'location', 'date', 'auditorName', 'clientName']
};