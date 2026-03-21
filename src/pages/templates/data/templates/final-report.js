export const finalReport = {
  name: '📑 Relatório Final de Consultoria',
  description: 'Relatório completo de consultoria',
  category: 'Relatórios',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">RELATÓRIO FINAL DE CONSULTORIA</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Projeto: {{projectName}}</p>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. RESUMO EXECUTIVO</h2>
        <p style="margin: 0 0 20px 0;">{{executiveSummary}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. OBJETIVOS DO PROJETO</h2>
        <p style="margin: 0 0 20px 0;">{{projectObjectives}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. METODOLOGIA APLICADA</h2>
        <p style="margin: 0 0 20px 0;">{{methodology}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ATIVIDADES REALIZADAS</h2>
        <p style="margin: 0 0 20px 0;">{{activitiesPerformed}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RESULTADOS OBTIDOS</h2>
        <p style="margin: 0 0 20px 0;">{{results}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. RECOMENDAÇÕES E PRÓXIMOS PASSOS</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">7. CONCLUSÕES</h2>
        <p style="margin: 0 0 20px 0;">{{conclusions}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{consultantName}}</p>
                    <p style="margin: 5px 0;">Consultor Responsável</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">Representante do Cliente</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['projectName', 'executiveSummary', 'projectObjectives', 'methodology', 'activitiesPerformed', 'results', 'recommendations', 'conclusions', 'location', 'date', 'consultantName', 'clientName']
};