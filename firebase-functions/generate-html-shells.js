// Firebase Function para gerar páginas HTML casca automaticamente após aprovação de JSON
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp();
const db = admin.firestore();

// Diretório de destino para páginas HTML
const htmlDir = path.join(__dirname, '../../pages');

exports.onJsonApproved = functions.firestore
  .document('institucional/{docId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    if (before.status !== 'aprovado' && after.status === 'aprovado') {
      const fileName = `${context.params.docId}.html`;
      const filePath = path.join(htmlDir, fileName);
      const html = `<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n  <meta charset="UTF-8">\n  <title>${after.title || 'Página Institucional'}</title>\n  <meta name="description" content="${after.description || ''}">\n  <!-- Placeholder para conteúdo -->\n</head>\n<body>\n  <div id="conteudo-institucional">\n    <!-- Conteúdo será preenchido dinamicamente -->\n  </div>\n</body>\n</html>`;
      fs.writeFileSync(filePath, html);
      console.log(`Página casca criada: ${fileName}`);
    }
    return null;
  });
