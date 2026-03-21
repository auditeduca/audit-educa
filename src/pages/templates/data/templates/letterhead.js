export const letterhead = {
  name: '📋 Papel Timbrado',
  description: 'Template de papel timbrado para documentos',
  category: 'Documentos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; min-height: 297mm; padding: 20mm; background-color: #ffffff; position: relative;">
        <div style="border-top: 4px solid #D4AF37; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px; font-weight: bold;">{{companyName}}</h1>
            <p style="margin: 5px 0; color: #666666; font-size: 12px;">{{address}}</p>
            <p style="margin: 5px 0; color: #666666; font-size: 12px;">{{phone}} | {{email}}</p>
        </div>
        <div style="min-height: 200mm; color: #333333; line-height: 1.6;">
            <p>{{content}}</p>
        </div>
        <div style="position: absolute; bottom: 20mm; left: 20mm; right: 20mm; border-top: 1px solid #D4AF37; padding-top: 10px; font-size: 10px; color: #666666; text-align: center;">
            {{footerText}}
        </div>
    </div>`,
  variables: ['companyName', 'address', 'phone', 'email', 'content', 'footerText']
};