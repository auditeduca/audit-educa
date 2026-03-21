export const technicalOpinion = {
  name: '📋 Parecer Técnico',
  description: 'Parecer técnico profissional',
  category: 'Documentos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">PARECER TÉCNICO</h1>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>SOLICITANTE:</strong> {{requester}}</p>
        <p style="margin: 0 0 20px 0;"><strong>ASSUNTO:</strong> {{subject}}</p>
        <p style="margin: 0 0 20px 0;"><strong>DATA:</strong> {{date}}</p>
        <p style="margin: 0 0 20px 0;"><strong>PARECER Nº:</strong> {{opinionNumber}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INTRODUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">{{introduction}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. ANÁLISE TÉCNICA</h2>
        <p style="margin: 0 0 20px 0;">{{technicalAnalysis}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. CONSIDERAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{considerations}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. CONCLUSÃO</h2>
        <p style="margin: 0 0 20px 0;">{{conclusion}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RECOMENDAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div>
                <p style="margin: 0 0 50px 0;">_____________________________</p>
                <p style="margin: 0; font-weight: bold;">{{expertName}}</p>
                <p style="margin: 5px 0;">{{expertTitle}}</p>
                <p style="margin: 5px 0;">{{expertCredentials}}</p>
            </div>
        </div>
    </div>`,
  variables: ['requester', 'subject', 'date', 'opinionNumber', 'introduction', 'technicalAnalysis', 'considerations', 'conclusion', 'recommendations', 'location', 'expertName', 'expertTitle', 'expertCredentials']
};