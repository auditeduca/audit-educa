export const proposal = {
  name: '📄 Proposta Comercial',
  description: 'Template de proposta para envio por e-mail',
  category: 'Documentos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0; padding: 40px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 4px solid #D4AF37;">
            <h2 style="margin: 0; color: #002D5B; font-size: 22px; font-weight: 700;">PROPOSTA COMERCIAL</h2>
        </div>
        <p style="margin: 0 0 20px 0; color: #444444;">Prezado Sr. <strong>{{clientName}}</strong>,</p>
        <p style="margin: 0 0 20px 0; color: #444444;">Submetemos à vossa apreciação a proposta referente aos serviços de <strong>{{serviceDescription}}</strong>.</p>
        <div style="background-color: #fdfaf0; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 2px;">
            <p style="margin: 0 0 10px 0; color: #002D5B; font-weight: bold; font-size: 14px; text-transform: uppercase;">METODOLOGIA:</p>
            <p style="margin: 0; color: #555555; font-size: 13px;">{{methodology}}</p>
        </div>
        <p style="margin: 0 0 30px 0; color: #444444; font-size: 14px;">Estamos à disposição para discutir o cronograma de implementação.</p>
    </div>`,
  variables: ['clientName', 'serviceDescription', 'methodology']
};