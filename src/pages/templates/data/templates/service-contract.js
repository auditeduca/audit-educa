export const serviceContract = {
  name: '📝 Contrato de Prestação de Serviço',
  description: 'Contrato profissional para serviços',
  category: 'Contratos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">CONTRATO DE PRESTAÇÃO DE SERVIÇO</h1>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>CONTRATANTE:</strong> {{clientName}}</p>
        <p style="margin: 0 0 20px 0;"><strong>CONTRATADA:</strong> {{companyName}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. DO OBJETO</h2>
        <p style="margin: 0 0 20px 0;">A CONTRATADA se compromete a prestar os seguintes serviços:</p>
        <p style="margin: 0 0 20px 0;">{{serviceDescription}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. DO VALOR E CONDIÇÕES DE PAGAMENTO</h2>
        <p style="margin: 0 0 20px 0;"><strong>Valor Total:</strong> R$ {{totalValue}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Forma de Pagamento:</strong> {{paymentMethod}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Prazo de Pagamento:</strong> {{paymentTerms}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. DO PRAZO DE EXECUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">Os serviços serão executados no período de {{startDate}} a {{endDate}}.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. DAS OBRIGAÇÕES DA CONTRATADA</h2>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Executar os serviços com profissionalismo e qualidade;</li>
            <li>Cumprir os prazos estabelecidos;</li>
            <li>Manter sigilo sobre informações confidenciais;</li>
            <li>Responsabilizar-se por danos causados por negligência.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. DA RESCISÃO</h2>
        <p style="margin: 0 0 20px 0;">Este contrato poderá ser rescindido a qualquer momento mediante notificação prévia de {{terminationNotice}} dias.</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">CONTRATANTE</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{companyName}}</p>
                    <p style="margin: 5px 0;">CONTRATADA</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['clientName', 'companyName', 'serviceDescription', 'totalValue', 'paymentMethod', 'paymentTerms', 'startDate', 'endDate', 'terminationNotice', 'location', 'date']
};