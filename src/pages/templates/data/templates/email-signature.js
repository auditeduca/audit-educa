export const emailSignature = {
  name: '📧 Assinatura de E-mail',
  description: 'Template profissional para assinatura de e-mails',
  category: 'Comunicação',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0; padding: 20px; background-color: #ffffff; border-top: 4px solid #D4AF37;">
        <div style="padding: 20px 0; border-bottom: 1px solid #eeeeee;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #002D5B;">{{name}}</p>
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #D4AF37; text-transform: uppercase;">{{title}}</p>
            <div style="font-size: 11px; color: #666666; line-height: 1.5;">
                <p style="margin: 0;">{{company}}</p>
                <p style="margin: 5px 0;">{{phone}}</p>
                <p style="margin: 5px 0;"><a href="mailto:{{email}}" style="color: #002D5B; text-decoration: none;">{{email}}</a></p>
            </div>
        </div>
    </div>`,
  variables: ['name', 'title', 'company', 'phone', 'email']
};