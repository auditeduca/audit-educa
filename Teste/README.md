# Audit Educa — Pacote de Exemplo

Este pacote contém uma página de calculadora (juros simples) com:
- Tailwind + Lucide via CDN
- Rail esquerdo fixo (sempre visível) e drawers padronizados (380px; altura total com scroll)
- Respiro direito (.with-right-rail)
- Tour de ajuda (Driver.js via CDN)
- Botões com feedback visual e voz (SpeechSynthesis)
- API de PDF (assets/js/api/pdf-api.js)
- API de menu assistivo (assets/js/api/assistive-menu.js) — **opcional**, inicialização comentada

## Uso
Abra `calculadora-casca.html` no navegador. Para ativar o menu assistivo, descomente as duas linhas ao final do arquivo e publique.

## Estrutura
- calculadora-casca.html
- exemplo-calculadora.html
- assets/css/*
- assets/js/* (inclui /api)
- assets/partials/* (header/footer — injetáveis)
- assets/images/audit-educa-favicon.webp
