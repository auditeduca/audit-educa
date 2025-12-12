/**
 * Lógica do Preloader com Morphing e Glassmorphism
 * Gerencia a barra de progresso, as transições visuais e o estado de execução única (sessionStorage).
 */
const preloaderManager = (function() {
    // Variáveis globais para o preloader
    const EXECUTION_FLAG = 'preloaderExecuted';
    let progressBar = null;
    let loaderWrapper = null;
    let loadInterval = null;
    let progress = 0;
    
    // Conteúdo HTML do preloader (armazenado para injeção rápida)
    const preloaderHtmlContent = `
        <div id="loader-wrapper">
            <div class="loader-bg"></div>
            <div class="center-cluster">
                <div class="morph-blob"></div>
                <div class="logo-container">
                    <img src="https://auditeduca.com.br/assets/images/logotipo-audit-educa-default.webp" 
                         alt="Audit Educa Logo" 
                         class="logo-img">
                    <div class="golden-line"></div>
                </div>
            </div>
            <div class="loading-bar-container">
                <div class="loading-bar-fill" id="progress-bar"></div>
            </div>
        </div>
    `;


    /**
     * Verifica se o preloader já foi executado. Se sim, evita a execução.
     * @returns {boolean} True se já foi executado, false caso contrário.
     */
    function checkExecutionStatus() {
        if (sessionStorage.getItem(EXECUTION_FLAG) === 'true') {
            // Se já executou, garante que a página não fique travada e remove o preloader se ele existir
            document.body.classList.remove('overflow-hidden');
            const wrapper = document.getElementById('loader-wrapper');
            if (wrapper) wrapper.remove();
            return true;
        }
        // Se for a primeira vez, adiciona o CSS de bloqueio de scroll
        document.body.classList.add('overflow-hidden');
        return false;
    }

    /**
     * Injeta o HTML do preloader no body e inicializa as referências.
     */
    function injectPreloaderHtml() {
        if (checkExecutionStatus()) return;

        document.body.insertAdjacentHTML('afterbegin', preloaderHtmlContent);
        loaderWrapper = document.getElementById('loader-wrapper');
        progressBar = document.getElementById('progress-bar');
    }

    /**
     * Simula o carregamento incremental.
     */
    function startLoadingSimulation() {
        progress = 0;
        if (progressBar) progressBar.style.width = '0%';
        
        loadInterval = setInterval(() => {
            // A velocidade simula o tempo de carregamento de recursos e a espera de UX.
            progress += Math.random() * 4; 
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadInterval);
                finishLoadingTransition();
            }
            
            if (progressBar) progressBar.style.width = `${progress}%`;
        }, 80); 
    }

    /**
     * Executa a transição final: morphing para glassmorphism e remoção.
     */
    function finishLoadingTransition() {
        if (progressBar) progressBar.style.width = '100%';

        setTimeout(() => {
            // Etapa 1: Ativa o efeito glass (morphing blob -> tela de vidro)
            document.body.classList.add('loaded');
            
            // Marca a execução única
            sessionStorage.setItem(EXECUTION_FLAG, 'true');

            // Etapa 2: Aguarda a transição final do glassmorphism e remove o preloader
            setTimeout(() => {
                document.body.classList.add('loaded-complete');
                document.body.classList.remove('overflow-hidden');
                
                // Dispara evento para que outros scripts (como main.js) saibam que a tela foi liberada
                document.dispatchEvent(new Event('componentsLoaded')); // MUDANÇA AQUI: usando componentsLoaded
                console.log('Preloader: Concluído e flag de execução única definida.');
            }, 1200); // 1.2s para a transição do morphing se completar
        }, 200);
    }

    // Retorna as funções necessárias para o escopo global
    return {
        injectPreloaderHtml: injectPreloaderHtml, 
        start: function() {
            // O init é chamado no window.load (após DOMContentLoaded)
            if (!checkExecutionStatus()) {
                startLoadingSimulation();
            }
        }
    };
})();

// 1. Injeta o HTML o mais cedo possível, se a flag não estiver setada.
document.addEventListener('DOMContentLoaded', preloaderManager.injectPreloaderHtml);

// 2. Inicia o carregamento (barra de progresso) quando todos os ativos da página estiverem carregados.
window.addEventListener('load', preloaderManager.start);
