import React, { useState, useEffect, useCallback, useRef } from 'react';

// Configurações dos níveis
const config = {
  fontSizes: ['100%', '115%', '130%', '150%'],
  contrasts: ['none', 'contrast(1.5)', 'contrast(2)', 'invert(1) hue-rotate(180deg)'],
  saturations: ['none', 'grayscale(1)', 'saturate(2.5)'],
  maskHeights: [0, 50, 80, 120],
  colorblindFilters: [
    '',
    'url(#protanopia-filter)',
    'url(#deuteranopia-filter)',
    'url(#tritanopia-filter)'
  ]
};

export default function AccessibilityWidget() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [state, setState] = useState({
    fontSize: 0,
    fontStyle: 0,
    bold: false,
    contrast: 0,
    saturation: 0,
    readingMask: 0,
    links: false,
    colorblind: 0
  });

  const maskRef = useRef(null);

  // Carregar estado salvo
  useEffect(() => {
    const saved = localStorage.getItem('audit_acc_v2.1');
    if (saved) {
      setState(prev => ({ ...prev, ...JSON.parse(saved), panelOpen: false }));
    }
  }, []);

  // Salvar estado
  useEffect(() => {
    localStorage.setItem('audit_acc_v2.1', JSON.stringify(state));
  }, [state]);

  // Aplicar estilos ao body
  useEffect(() => {
    const b = document.body;
    b.style.fontSize = config.fontSizes[state.fontSize];

    // Filtros (contraste, saturação, daltonismo)
    let filter = '';
    if (state.contrast > 0) filter += config.contrasts[state.contrast] + ' ';
    if (state.saturation > 0) filter += config.saturations[state.saturation] + ' ';
    if (state.colorblind > 0) filter += config.colorblindFilters[state.colorblind] + ' ';
    b.style.filter = filter.trim() || 'none';

    // Estilo de texto (fontStyle)
    let styleTag = document.getElementById('acc-text-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'acc-text-style';
      document.head.appendChild(styleTag);
    }
    let css = '';
    if (state.fontStyle === 1) css = '* { font-family: serif !important; }';
    else if (state.fontStyle === 2) css = '* { font-weight: 900 !important; }';
    else if (state.fontStyle === 3) css = '* { font-family: serif !important; font-weight: 900 !important; }';
    styleTag.textContent = css;

  }, [state]);

  // Atualizar nível de um ajuste
  const updateStep = useCallback((key, max) => {
    setState(prev => ({
      ...prev,
      [key]: (prev[key] + 1) > max ? 0 : prev[key] + 1
    }));
  }, []);

  // Resetar tudo
  const resetAll = useCallback(() => {
    setState({
      fontSize: 0,
      fontStyle: 0,
      bold: false,
      contrast: 0,
      saturation: 0,
      readingMask: 0,
      links: false,
      colorblind: 0
    });
  }, []);

  // Máscara de leitura: movimento do mouse
  useEffect(() => {
    if (state.readingMask === 0) return;

    const handleMouseMove = (e) => {
      if (!maskRef.current) return;
      const y = e.clientY;
      const h = config.maskHeights[state.readingMask];
      maskRef.current.style.clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% ${y - h}px, 100% ${y - h}px, 100% ${y + h}px, 0% ${y + h}px, 0% ${y - h}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.readingMask]);

  // VLibras: carregar script e inicializar
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.head.appendChild(script);

    return () => {
      // Limpeza opcional (o widget não tem método destroy)
    };
  }, []);

  // Filtros SVG para daltonismo (inseridos uma vez)
  useEffect(() => {
    if (!document.getElementById('acc-svg-filters')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'acc-svg-filters';
      svg.setAttribute('style', 'position:absolute; width:0; height:0;');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = `
        <defs>
          <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/></filter>
          <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/></filter>
          <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/></filter>
        </defs>
      `;
      document.body.appendChild(svg);
    }
  }, []);

  // Função auxiliar para abrir/fechar o painel
  const togglePanel = () => setPanelOpen(prev => !prev);

  // Função para ativar Libras (disparada pelo botão)
  const toggleLibras = () => {
    const btn = document.querySelector('[vw-access-button]');
    if (btn) btn.click();
  };

  // Renderiza os cartões de controle
  const ControlCard = ({ icon, label, value, max, onClick }) => {
    return (
      <div
        className={`acc-card p-4 bg-gray-50 rounded-xl border-2 text-center cursor-pointer hover:bg-gray-100 transition-all relative group ${
          value > 0 ? 'border-[#C5A059] bg-blue-50' : 'border-transparent'
        }`}
        onClick={onClick}
      >
        <div className="dots absolute top-2 right-2 flex gap-1">
          {[...Array(max)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i < value ? 'bg-[#C5A059] shadow-[0_0_4px_#C5A059]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <i className={`fas ${icon} text-[#0f172a] mb-2 text-xl`}></i>
        <div className="text-[0.7rem] font-bold text-[#0f172a]">{label}</div>
      </div>
    );
  };

  return (
    <>
      {/* Widgets flutuantes (Libras + Acessibilidade) */}
      <div className="side-widgets-container fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[99999] items-end">
        {/* Botão Libras */}
        <div
          className="accessibility-widget-item libras bg-[#ffde39] hover:bg-[#f7d000] flex items-center justify-end relative cursor-pointer transition-all duration-400 rounded-l-full p-1.5 w-[56px] h-[56px] overflow-hidden shadow-lg border-2 border-transparent group"
          onClick={toggleLibras}
        >
          <span className="widget-label text-black text-[0.85rem] font-bold mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Tradutor de Libras
          </span>
          <div className="widget-icon w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-xl text-black bg-black/5">
            <i className="fas fa-sign-language"></i>
          </div>
        </div>

        {/* Botão Acessibilidade */}
        <div
          id="accessibility-btn"
          className={`accessibility-widget-item bg-[#0f172a] hover:bg-[#C5A059] flex items-center justify-end relative cursor-pointer transition-all duration-400 rounded-l-full p-1.5 w-[56px] h-[56px] overflow-hidden shadow-lg border-2 border-transparent group ${
            Object.values(state).some(v => v > 0) ? 'animate-pulse' : ''
          }`}
          onClick={togglePanel}
        >
          <span className="widget-label text-white text-[0.85rem] font-bold mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Recursos Assistivos
          </span>
          <div className="widget-icon w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-xl text-white bg-white/10">
            <i className="fas fa-eye"></i>
          </div>
        </div>
      </div>

      {/* Painel de Acessibilidade */}
      <div
        id="accessibility-panel"
        className={`fixed top-5 right-20 w-[400px] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-[100000] flex flex-col overflow-hidden transition-all duration-400 border border-gray-200 ${
          panelOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-x-[150%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="panel-header bg-white px-6 py-4 flex justify-between items-center border-b-4 border-[#C5A059]">
          <div className="font-bold text-[#0f172a] text-lg">
            Audit <span className="text-[#C5A059]">Educa</span>
          </div>
          <button
            onClick={togglePanel}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="panel-body p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Seção Fonte */}
          <div className="mb-6">
            <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">
              Fonte
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ControlCard
                icon="fa-text-height"
                label="Tamanho"
                value={state.fontSize}
                max={3}
                onClick={() => updateStep('fontSize', 3)}
              />
              <ControlCard
                icon="fa-font"
                label="Estilo"
                value={state.fontStyle}
                max={3}
                onClick={() => updateStep('fontStyle', 3)}
              />
            </div>
          </div>

          {/* Seção Visual */}
          <div className="mb-6">
            <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">
              Visual
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ControlCard
                icon="fa-circle-half-stroke"
                label="Contraste"
                value={state.contrast}
                max={3}
                onClick={() => updateStep('contrast', 3)}
              />
              <ControlCard
                icon="fa-droplet"
                label="Saturação"
                value={state.saturation}
                max={2}
                onClick={() => updateStep('saturation', 2)}
              />
            </div>
          </div>

          {/* Seção Leitura & Daltonismo */}
          <div className="mb-6">
            <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">
              Leitura & Daltonismo
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ControlCard
                icon="fa-mask"
                label="Máscara"
                value={state.readingMask}
                max={3}
                onClick={() => updateStep('readingMask', 3)}
              />
              <ControlCard
                icon="fa-eye-dropper"
                label="Daltonismo"
                value={state.colorblind}
                max={3}
                onClick={() => updateStep('colorblind', 3)}
              />
            </div>
          </div>

          <button
            onClick={resetAll}
            className="w-full py-4 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-[#1e40af] transition-colors mt-4"
          >
            REDEFINIR TUDO
          </button>
        </div>
      </div>

      {/* Máscara de leitura (renderizada condicionalmente) */}
      {state.readingMask > 0 && (
        <div
          ref={maskRef}
          id="reading-mask"
          className="fixed top-0 left-0 w-full h-full bg-black/70 z-[99998] pointer-events-none"
        ></div>
      )}
    </>
  );
}