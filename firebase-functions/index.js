// index.js - Firebase Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { exec } = require('child_process');

admin.initializeApp();

// Função para commit git
exports.gitCommit = functions.https.onRequest((req, res) => {
  const conteudo = req.body.conteudo;
  const mensagem = req.body.mensagem || 'Commit automático';
  // Salvar conteúdo em arquivo temporário (exemplo)
  // ...
  exec(`git add . && git commit -m "${mensagem}" && git push`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({status: 'erro', error: err.message});
    res.json({status: 'ok', output: stdout});
  });
});

// Função para log git
exports.gitLog = functions.https.onRequest((req, res) => {
  exec('git log --oneline -10', (err, stdout, stderr) => {
    if (err) return res.status(500).json({log: stderr});
    res.json({log: stdout});
  });
});
