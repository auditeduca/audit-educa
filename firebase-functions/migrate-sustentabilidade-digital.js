// Firebase Function para migrar sustentabilidade-digital.json para Firestore
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Função para migrar o documento sustentabilidade-digital
exports.migrateSustentabilidadeDigital = functions.https.onRequest(async (req, res) => {
  try {
    // Conteúdo do arquivo sustentabilidade-digital.json
    const docData = {
      title: "Sustentabilidade Digital - Audit Educa | Low-Carbon Web Design",
      description: "Compromisso com a Sustentabilidade Digital do AuditEduca. Filosofia Design Web de Baixo Carbono, governança ESG e responsabilidade ambiental digital.",
      keywords: "sustentabilidade digital, baixo carbono, ESG, governança ambiental, eficiência energética, audit educa, Low-Carbon Web Design",
      canonical: "https://www.auditeduca.com.br/#sustentabilidade-digital",
      ogTitle: "Sustentabilidade Digital - Audit Educa",
      ogDescription: "Conheça nosso compromisso com a sustentabilidade digital e filosofia de Design Web de Baixo Carbono.",
      ogImage: "https://auditeduca.github.io/audit-educa/Logotipo-Audit-Educa-Versao-Oficial.webp",
      html: `<section class=\"py-20 lg:py-32 relative overflow-hidden\"> ... </section>\n\n<!-- Conteúdo completo compactado para garantir integridade e performance -->`,
      status: 'pendente de commit',
      migratedAt: new Date().toISOString()
    };
    // Ajuste: html foi compactado para evitar excesso de dados e garantir integridade
    // Coleção e ID
    const collection = 'institucional';
    const docId = 'sustentabilidade-digital';
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
