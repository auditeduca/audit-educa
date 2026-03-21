export const nda = {
  name: '🔒 NDA - Acordo de Confidencialidade',
  description: 'Acordo de Não Divulgação profissional',
  category: 'Contratos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">ACORDO DE NÃO DIVULGAÇÃO</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Confidentiality Agreement</p>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>ENTRE:</strong></p>
        <p style="margin: 0 0 20px 0;">{{disclosingParty}}, pessoa {{personType}} domiciliada em {{address}}, doravante denominada <strong>"DIVULGADORA"</strong></p>
        
        <p style="margin: 0 0 20px 0;"><strong>E:</strong></p>
        <p style="margin: 0 0 20px 0;">{{receivingParty}}, pessoa {{receiverType}} domiciliada em {{receiverAddress}}, doravante denominada <strong>"RECEPTORA"</strong></p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. OBJETO</h2>
        <p style="margin: 0 0 20px 0;">O presente Acordo tem por objetivo estabelecer as condições e obrigações das partes quanto ao tratamento de informações confidenciais a serem compartilhadas entre elas.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. INFORMAÇÕES CONFIDENCIAIS</h2>
        <p style="margin: 0 0 20px 0;">Consideram-se informações confidenciais todos os dados, documentos, projetos e informações que a DIVULGADORA compartilhar com a RECEPTORA, sejam eles em formato físico ou digital.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. OBRIGAÇÕES DA RECEPTORA</h2>
        <p style="margin: 0 0 20px 0;">A RECEPTORA se compromete a:</p>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Manter sigilo absoluto sobre as informações confidenciais;</li>
            <li>Utilizar as informações exclusivamente para o propósito acordado;</li>
            <li>Não divulgar as informações a terceiros sem consentimento prévio;</li>
            <li>Implementar medidas de segurança adequadas.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. VIGÊNCIA</h2>
        <p style="margin: 0 0 20px 0;">Este acordo vigerá por {{duration}} a partir da data de assinatura.</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{disclosingParty}}</p>
                    <p style="margin: 5px 0;">DIVULGADORA</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{receivingParty}}</p>
                    <p style="margin: 5px 0;">RECEPTORA</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['disclosingParty', 'personType', 'address', 'receivingParty', 'receiverType', 'receiverAddress', 'duration', 'location', 'date']
};