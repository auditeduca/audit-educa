export const businessCardVirtual = {
  name: '💼 Cartão de Visitas Virtual',
  description: 'Cartão digital para compartilhamento online',
  category: 'Digital',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; border-radius: 12px; text-align: center;">
        <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">{{name}}</h1>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #D4AF37;">{{title}}</p>
        <div style="margin: 30px 0; padding: 20px 0; border-top: 1px solid rgba(212, 175, 55, 0.3); border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
            <p style="margin: 5px 0; font-size: 12px;">{{phone}}</p>
            <p style="margin: 5px 0; font-size: 12px;">{{email}}</p>
            <p style="margin: 5px 0; font-size: 12px;">{{website}}</p>
        </div>
        <p style="margin: 20px 0 0 0; font-size: 11px; opacity: 0.8;">{{company}}</p>
    </div>`,
  variables: ['name', 'title', 'phone', 'email', 'website', 'company']
};