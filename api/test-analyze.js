/**
 * TESTE LOCAL - API ANALYZEENGINE
 * Simula requisição POST para /api/analyze
 * Execute: npm run test-api
 */

require('dotenv').config();

const handler = require('./analyze.cjs');

// Mock do Express/Vercel request/response
class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.body = data;
    console.log('\n✅ RESPOSTA HTTP:', this.statusCode);
    console.log(JSON.stringify(data, null, 2));
    return this;
  }

  end() {
    return this;
  }
}

// Teste
(async () => {
  console.log('🔄 Iniciando teste local da API Groq...\n');
  console.log('📋 Validações:');
  console.log('  - GROQ_API_KEY presente?', process.env.GROQ_API_KEY ? '✅' : '❌');
  console.log('  - SDK carregado?', (() => {
    try {
      const Groq = require('groq-sdk');
      return Groq ? '✅' : '❌';
    } catch {
      return '❌';
    }
  })());

  const mockReq = {
    method: 'POST',
    body: {
      context: 'Auditoria externa de Demonstrações Financeiras - Exercício 2024',
      userMessage: 'Quais os principais riscos de distorção identificados na auditoria?',
      documents: [
        { name: 'BP_2024.pdf', type: 'balance_sheet' },
        { name: 'DRE_2024.pdf', type: 'income_statement' }
      ]
    }
  };

  const mockRes = new MockResponse();

  try {
    await handler(mockReq, mockRes);
  } catch (error) {
    console.error('\n❌ ERRO NA REQUISIÇÃO:');
    console.error('  Tipo:', error.name);
    console.error('  Mensagem:', error.message);
    process.exit(1);
  }
})();