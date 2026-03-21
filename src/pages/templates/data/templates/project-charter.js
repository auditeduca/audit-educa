export const projectCharter = {
  name: '🎯 Termo de Abertura de Projeto',
  description: 'Documento de abertura formal de projeto',
  category: 'Projetos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">TERMO DE ABERTURA DE PROJETO</h1>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INFORMAÇÕES DO PROJETO</h2>
        <p style="margin: 0 0 10px 0;"><strong>Nome do Projeto:</strong> {{projectName}}</p>
        <p style="margin: 0 0 10px 0;"><strong>Gerente de Projeto:</strong> {{projectManager}}</p>
        <p style="margin: 0 0 10px 0;"><strong>Patrocinador:</strong> {{sponsor}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Data de Início:</strong> {{startDate}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. JUSTIFICATIVA</h2>
        <p style="margin: 0 0 20px 0;">{{justification}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. OBJETIVOS</h2>
        <p style="margin: 0 0 20px 0;">{{objectives}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ESCOPO</h2>
        <p style="margin: 0 0 20px 0;">{{scope}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RESTRIÇÕES E PREMISSAS</h2>
        <p style="margin: 0 0 10px 0;"><strong>Restrições:</strong></p>
        <p style="margin: 0 0 10px 0;">{{constraints}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Premissas:</strong></p>
        <p style="margin: 0 0 20px 0;">{{assumptions}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. ORÇAMENTO ESTIMADO</h2>
        <p style="margin: 0 0 20px 0;">R$ {{budget}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">7. CRONOGRAMA</h2>
        <p style="margin: 0 0 20px 0;">{{schedule}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{projectManager}}</p>
                    <p style="margin: 5px 0;">Gerente de Projeto</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{sponsor}}</p>
                    <p style="margin: 5px 0;">Patrocinador</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['projectName', 'projectManager', 'sponsor', 'startDate', 'justification', 'objectives', 'scope', 'constraints', 'assumptions', 'budget', 'schedule', 'location', 'date']
};