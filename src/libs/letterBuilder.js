// src/libs/letterBuilder.js
import { TPLS, BANK_PRODS } from './letterTemplates.js';

export function buildLetter(type, data) {
  const template = TPLS.find(t => t.tipo === type) || TPLS[0];
  const lang = data.lang || 'pt';
  const bodyFn = template.body[lang] || template.body.pt;
  const bodyHtml = bodyFn(data, ''); // placeholders

  // Simulação de dados para renderização das seções
  const html = `
    <div data-section="cabecalho" style="margin-bottom: 20px; text-align: center;">
      ${renderHeader(data)}
    </div>
    <div data-section="destinatario" style="margin-bottom: 30px;">
      ${renderDestinatario(data)}
    </div>
    <div data-section="assunto" style="margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: bold;">Confirmação Externa - NBC TA 505</h2>
    </div>
    <div data-section="corpo" style="margin-bottom: 30px;">
      ${bodyHtml}
    </div>
    ${data.produtos ? `<div data-section="produtos" style="margin-bottom: 30px;">${renderProdutos(data.produtos)}</div>` : ''}
    <div data-section="conclusao" style="margin-bottom: 30px;">
      ${renderConclusao(data)}
    </div>
    <div data-section="anexos">
      ${renderAnexos(data)}
    </div>
  `;

  return html;
}

function renderHeader(data) {
  return `<div style="font-size: 14px; color: #4a5568;">${data.firma || 'Firma de Auditoria'}</div>`;
}

function renderDestinatario(data) {
  return `<div style="font-size: 12px;">
    <strong>${data.nome || ''}</strong><br>
    ${data.empresa || ''}<br>
    ${data.end || ''}
  </div>`;
}

function renderProdutos(produtos) {
  return `<table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead><tr style="background: #f3f4f6;"><th style="border: 1px solid #e5e7eb; padding: 8px;">Produto</th><th style="border: 1px solid #e5e7eb; padding: 8px;">Valor</th></tr></thead>
    <tbody>${produtos.map(p => `<tr><td style="border: 1px solid #e5e7eb; padding: 8px;">${p.nome}</td><td style="border: 1px solid #e5e7eb; padding: 8px;">${p.valor}</td></tr>`).join('')}</tbody>
   </table>`;
}

function renderConclusao(data) {
  return `<p>Favor responder até ${data.data_resposta || '10 dias úteis'}.</p>`;
}

function renderAnexos(data) {
  return `<p style="font-size: 10px; color: #6b7280;">Instruções de resposta digital conforme NBC TA 505.</p>`;
}