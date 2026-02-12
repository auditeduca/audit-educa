// Script para gerar páginas HTML casca a partir de JSON aprovado no Firebase
// Uso: node generate-html-shells.js

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Inicialização Firebase
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Diretório de destino para páginas HTML
const htmlDir = path.join(__dirname, 'pages');

async function generateShellPages() {
  const collection = db.collection('institucional');
  const snapshot = await collection.where('status', '==', 'aprovado').get();

  if (snapshot.empty) {
    console.log('Nenhum documento aprovado encontrado.');
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const fileName = `${doc.id}.html`;
    const filePath = path.join(htmlDir, fileName);
    const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>${data.title || 'Página Institucional'}</title>
  <meta name="description" content="${data.description || ''}">
  <!-- Placeholder para conteúdo -->
</head>
<body>
  <div id="conteudo-institucional">
    <!-- Conteúdo será preenchido dinamicamente -->
  </div>
</body>
</html>`;
    fs.writeFileSync(filePath, html);
    console.log(`Página casca criada: ${fileName}`);
  });
}

generateShellPages();
