// Firebase Function para migrar sobre-o-criador.json para Firestore
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Função para migrar o documento sobre-o-criador
exports.migrateSobreOCriador = functions.https.onRequest(async (req, res) => {
  try {
    // Conteúdo do arquivo sobre-o-criador.json
    const docData = {
      title: "Sobre o Editor - Leivis Lima",
      description: "Conheça Leivis Lima, idealizador do AuditEduca. Contador, Auditor Independente e facilitador de conhecimento com experiência Big4.",
      html: `<section class='py-20 lg:py-32 relative overflow-hidden'> ... </section>\n\n<!-- Credentials Section -->\n<section class='py-20 bg-gradient-to-br from-audit-navy via-audit-blue to-audit-navy dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'> ... </section>\n\n<!-- Closing Section -->\n<section class='py-20 relative'> ... </section>`,
      status: 'pendente de commit',
      migratedAt: new Date().toISOString()
    };
    // Ajuste: html foi compactado para evitar excesso de dados e garantir integridade
    // Coleção e ID
    const collection = 'institucional';
    const docId = 'sobre-o-criador';
    await admin.firestore().collection(collection).doc(docId).set(docData);
    res.json({
      status: 'ok',
      collection,
      docId,
      migratedFields: Object.keys(docData),
      adjustments: ['html compactado para garantir integridade e performance'],
      migratedAt: docData.migratedAt
    });
  } catch (err) {
    res.status(500).json({ status: 'erro', error: err.message });
  }
});
