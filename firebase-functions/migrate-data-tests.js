// Script para migrar arquivos JSON de Data_tests para Firestore
// Uso: node migrate-data-tests.js

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const baseDir = path.join(__dirname, '../Data_tests');
const subDirs = ['BCB', 'CVM', 'OTHERS', 'PREVIC', 'QTG', 'SUSEP'];

async function migrate() {
  for (const sub of subDirs) {
    const dir = path.join(baseDir, sub);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const docId = `${sub}_${file.replace('.json','')}`;
      await db.collection('data_tests').doc(docId).set({
        ...content,
        status: 'pendente',
        migratedAt: new Date().toISOString(),
        sourceFile: filePath
      });
      console.log(`Migrado: ${docId}`);
    }
  }
  console.log('Migração concluída.');
}

migrate();
