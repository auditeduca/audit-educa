export const reportCover = {
  name: '📊 Capa de Relatório',
  description: 'Capa profissional para relatórios',
  category: 'Documentos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; height: 100vh; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px;">
        <div style="margin-bottom: 60px;">
            <h1 style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold;">{{reportTitle}}</h1>
            <p style="margin: 0; font-size: 18px; color: #D4AF37;">{{reportSubtitle}}</p>
        </div>
        <div style="margin-bottom: 60px; flex: 1; display: flex; align-items: center; justify-content: center;">
            <!-- Espaço para imagem ou conteúdo -->
        </div>
        <div style="font-size: 14px;">
            <p style="margin: 5px 0;">{{author}}</p>
            <p style="margin: 5px 0;">{{date}}</p>
            <p style="margin: 5px 0; color: #D4AF37;">{{company}}</p>
        </div>
    </div>`,
  variables: ['reportTitle', 'reportSubtitle', 'author', 'date', 'company']
};