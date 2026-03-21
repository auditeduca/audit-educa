export const presentation = {
  name: '🎯 Apresentação/PPT',
  description: 'Template de apresentação em HTML',
  category: 'Apresentações',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; padding: 60px 40px; text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold;">{{presentationTitle}}</h1>
        <p style="margin: 0 0 40px 0; font-size: 24px; color: #D4AF37;">{{presentationSubtitle}}</p>
        
        <div style="margin-top: 60px; padding: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="margin: 0 0 20px 0; font-size: 28px;">Agenda</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 10px 0; font-size: 18px;">• {{topic1}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic2}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic3}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic4}}</li>
            </ul>
        </div>
        
        <div style="margin-top: 60px; font-size: 16px; opacity: 0.8;">
            <p style="margin: 5px 0;">{{presenterName}} | {{presenterTitle}}</p>
            <p style="margin: 5px 0;">{{companyName}}</p>
            <p style="margin: 5px 0;">{{date}}</p>
        </div>
    </div>`,
  variables: ['presentationTitle', 'presentationSubtitle', 'topic1', 'topic2', 'topic3', 'topic4', 'presenterName', 'presenterTitle', 'companyName', 'date']
};