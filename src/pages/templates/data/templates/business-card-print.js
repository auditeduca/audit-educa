export const businessCardPrint = {
  name: '🎫 Cartão de Visitas (Impressão)',
  description: 'Cartão profissional para impressão - 90x50mm',
  category: 'Materiais',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 90mm; height: 50mm; padding: 5mm; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; display: flex; align-items: center; justify-content: space-between;">
        <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">{{name}}</p>
            <p style="margin: 5px 0; font-size: 11px; color: #D4AF37;">{{title}}</p>
            <p style="margin: 5px 0; font-size: 10px;">{{phone}}</p>
            <p style="margin: 5px 0; font-size: 10px;">{{email}}</p>
        </div>
        <div style="width: 1px; height: 30mm; background-color: #D4AF37; margin: 0 10px;"></div>
    </div>`,
  variables: ['name', 'title', 'phone', 'email']
};