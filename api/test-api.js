/**
 * Teste local da API Groq sem Vercel
 */

const handler = require('./api/analyze.js');

// Mock do objeto request/response
const mockReq = {
  method: 'POST',
  body: {
    context: 'Auditoria de demonstrações financeiras',
    userMessage: 'Quais os principais riscos de distorção?',
    documents: []
  }
};

const mockRes = {
  statusCode: 200,
  headers: {},
  setHeader: function(key, value) {
    this.headers[key] = value;
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('\n✅ RESPOSTA:\n', JSON.stringify(data, null, 2));
  },
  end: function() {
    console.log('Response ended');
  }
};

// Simular chamada
console.log('🔄 Testando API localmente...\n');

handler(mockReq, mockRes).catch(err => {
  console.error('❌ ERRO:', err.message);
});