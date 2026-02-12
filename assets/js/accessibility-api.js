/**
 * Audit Educa - Accessibility API & Controller v2.1
 * Integrates assistive resources with index.html style
 */

window.AccessControl = (function() {
    const state = {
        fontSize: 0, fontStyle: 0, bold: false, contrast: 0,
        saturation: 0, readingMask: 0, links: false, colorblind: 0,
        panelOpen: false
    };

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

    function init() {
        createSVGFilters();
        createElements();
        loadState();
        setupEventListeners();
        apply();
    }

    function createSVGFilters() {
        if (!document.getElementById('acc-svg-filters')) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.id = 'acc-svg-filters';
            svg.setAttribute('style', 'position:absolute; width:0; height:0;');
            svg.setAttribute('aria-hidden', 'true');
            svg.innerHTML = `
                <defs>
                    <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"></feColorMatrix></filter>
                    <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"></feColorMatrix></filter>
                    <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"></feColorMatrix></filter>
                </defs>
            `;
            document.body.appendChild(svg);
        }
    }

    function createElements() {
        if (!document.querySelector('.side-widgets-container')) {
            const container = document.createElement('div');
            container.className = 'side-widgets-container fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[99999] items-flex-end';
            
            const librasBtn = document.createElement('div');
            librasBtn.className = 'accessibility-widget-item libras bg-[#ffde39] hover:bg-[#f7d000] flex items-center justify-end relative cursor-pointer transition-all duration-400 rounded-l-full p-1.5 w-[56px] h-[56px] overflow-hidden shadow-lg border-2 border-transparent group';
            librasBtn.onclick = () => window.toggleLibras();
            librasBtn.innerHTML = `<span class="widget-label text-black text-[0.85rem] font-bold mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Tradutor de Libras</span><div class="widget-icon w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-xl text-black bg-black/5"><i class="fas fa-sign-language"></i></div>`;

            const accBtn = document.createElement('div');
            accBtn.id = 'accessibility-btn';
            accBtn.className = 'accessibility-widget-item bg-[#0f172a] hover:bg-[#C5A059] flex items-center justify-end relative cursor-pointer transition-all duration-400 rounded-l-full p-1.5 w-[56px] h-[56px] overflow-hidden shadow-lg border-2 border-transparent group';
            accBtn.onclick = () => togglePanel();
            accBtn.innerHTML = `<span class="widget-label text-white text-[0.85rem] font-bold mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Recursos Assistivos</span><div class="widget-icon w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-xl text-white bg-white/10"><i class="fas fa-eye"></i></div>`;

            container.appendChild(librasBtn);
            container.appendChild(accBtn);
            document.body.appendChild(container);
        }

        if (!document.getElementById('accessibility-panel')) {
            const panel = document.createElement('div');
            panel.id = 'accessibility-panel';
            panel.className = 'fixed top-5 right-20 w-[400px] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-[100000] flex flex-col overflow-hidden transition-all duration-400 translate-x-[150%] opacity-0 pointer-events-none border border-gray-200';
            panel.innerHTML = `
                <div class="panel-header bg-white px-6 py-4 flex justify-between items-center border-b-4 border-[#C5A059]">
                    <div class="font-bold text-[#0f172a] text-lg">Audit <span class="text-[#C5A059]">Educa</span></div>
                    <button onclick="window.AccessControl.togglePanel()" class="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="panel-body p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div class="mb-6"><div class="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">Fonte</div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('fontSize', 3)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-text-height text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Tamanho</div>
                            </div>
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('fontStyle', 3)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-font text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Estilo</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-6"><div class="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">Visual</div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('contrast', 3)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-circle-half-stroke text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Contraste</div>
                            </div>
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('saturation', 2)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-droplet text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Saturação</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-6"><div class="text-[0.65rem] font-extrabold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">Leitura & Daltonismo</div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('readingMask', 3)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-mask text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Máscara</div>
                            </div>
                            <div class="acc-card p-4 bg-gray-50 rounded-xl border-2 border-transparent text-center cursor-pointer hover:bg-gray-100 transition-all relative group" onclick="window.AccessControl.updateStep('colorblind', 3)">
                                <div class="dots absolute top-2 right-2 flex gap-1"></div><i class="fas fa-eye-dropper text-[#0f172a] mb-2"></i><div class="text-[0.7rem] font-bold text-[#0f172a]">Daltonismo</div>
                            </div>
                        </div>
                    </div>
                    <button onclick="window.AccessControl.resetAll()" class="w-full py-4 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-[#1e40af] transition-colors mt-4">REDEFINIR TUDO</button>
                </div>
            `;
            document.body.appendChild(panel);
        }

        if (!document.getElementById('reading-mask')) {
            const mask = document.createElement('div');
            mask.id = 'reading-mask';
            mask.className = 'fixed top-0 left-0 w-full h-full bg-black/70 z-[99998] pointer-events-none hidden';
            document.body.appendChild(mask);
        }
    }

    function togglePanel() {
        state.panelOpen = !state.panelOpen;
        const panel = document.getElementById('accessibility-panel');
        if (state.panelOpen) { panel.classList.remove('translate-x-[150%]', 'opacity-0', 'pointer-events-none'); }
        else { panel.classList.add('translate-x-[150%]', 'opacity-0', 'pointer-events-none'); }
    }

    function updateStep(key, max) {
        state[key] = (state[key] + 1) > max ? 0 : state[key] + 1;
        apply();
    }

    function apply() {
        const b = document.body;
        b.style.fontSize = config.fontSizes[state.fontSize];
        
        let filter = "";
        if (state.contrast > 0) filter += config.contrasts[state.contrast] + " ";
        if (state.saturation > 0) filter += config.saturations[state.saturation] + " ";
        if (state.colorblind > 0) filter += config.colorblindFilters[state.colorblind] + " ";
        b.style.filter = filter.trim() || "none";

        document.getElementById('reading-mask').style.display = state.readingMask > 0 ? 'block' : 'none';

        const textStyle = document.getElementById('acc-text-style') || document.createElement('style');
        textStyle.id = 'acc-text-style';
        let css = '';
        if (state.fontStyle === 1) css = '* { font-family: serif !important; }';
        else if (state.fontStyle === 2) css = '* { font-weight: 900 !important; }';
        else if (state.fontStyle === 3) css = '* { font-family: serif !important; font-weight: 900 !important; }';
        textStyle.textContent = css;
        document.head.appendChild(textStyle);

        updateUI();
        saveState();
    }

    function updateUI() {
        const cards = document.querySelectorAll('.acc-card');
        cards.forEach(card => {
            const onclick = card.getAttribute('onclick');
            const key = ['fontSize', 'fontStyle', 'contrast', 'saturation', 'readingMask', 'colorblind'].find(k => onclick.includes(k));
            if (key) {
                const val = state[key];
                card.classList.toggle('border-[#C5A059]', val > 0);
                card.classList.toggle('bg-blue-50', val > 0);
                const dots = card.querySelector('.dots');
                if (dots) {
                    dots.innerHTML = '';
                    const max = (key === 'saturation') ? 2 : 3;
                    for (let i = 1; i <= max; i++) {
                        const dot = document.createElement('div');
                        dot.className = `w-1.5 h-1.5 rounded-full ${i <= val ? 'bg-[#C5A059] shadow-[0_0_4px_#C5A059]' : 'bg-gray-300'}`;
                        dots.appendChild(dot);
                    }
                }
            }
        });
        const hasActive = Object.keys(state).some(k => k !== 'panelOpen' && !!state[k]);
        const btn = document.getElementById('accessibility-btn');
        if (btn) btn.classList.toggle('animate-pulse', hasActive);
    }

    function resetAll() {
        Object.keys(state).forEach(k => { if (k !== 'panelOpen') state[k] = 0; });
        apply();
    }

    function saveState() { localStorage.setItem('audit_acc_v2.1', JSON.stringify(state)); }
    function loadState() {
        const saved = localStorage.getItem('audit_acc_v2.1');
        if (saved) { Object.assign(state, JSON.parse(saved)); state.panelOpen = false; }
    }

    function setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            if (state.readingMask > 0) {
                const mask = document.getElementById('reading-mask');
                const y = e.clientY;
                const h = config.maskHeights[state.readingMask];
                mask.style.clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% ${y-h}px, 100% ${y-h}px, 100% ${y+h}px, 0% ${y+h}px, 0% ${y-h}px)`;
            }
        });
    }

    return { init, togglePanel, updateStep, resetAll };
})();

window.toggleLibras = function() { const btn = document.querySelector('[vw-access-button]'); if (btn) btn.click(); };

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('script[src*="vlibras-plugin.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.onload = () => { new window.VLibras.Widget('https://vlibras.gov.br/app'); };
        document.head.appendChild(script);
    }
    window.AccessControl.init();
});
