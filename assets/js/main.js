/**
 * Lógica de Carregamento Principal e Handlers de Eventos
 *
 * Este script aguarda o evento 'componentsLoaded' (disparado pelo preloader.js) para garantir
 * que o conteúdo principal seja exibido somente após a conclusão da transição visual.
 */

// Simulação de conteúdo da Home (para injeção após o preloader)
const HOME_CONTENT_DATA = {
    "title": "Audit Educa - Início",
    "html": `<section id='inicio' class='relative bg-audit-blue text-white py-20'>\n    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>\n        <h1 class='text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-down'>Bem-vindo ao Audit Educa</h1>\n        <p class='text-xl md:text-2xl animate-fade-in'>Sua plataforma de conhecimento sem fronteiras.</p>\n    </div>\n    \n    <!-- SVG de Onda 1 (Divisor com Sinergia Dourada) -->\n    <div class='absolute bottom-0 left-0 w-full h-auto z-10' style='height: 100px;'>\n        <!-- Camada 2: Gold (Linha Dourada - Z: 10) -->\n        <svg class='absolute bottom-0 left-0 w-full h-full fill-current text-audit-gold' viewBox='0 0 1440 100' preserveAspectRatio='none'>\n            <path d='M1440,50 C1200,85 960,95 720,95 C480,95 240,85 0,50 L0,100 L1440,100 Z'></path>\n        </svg>\n        <!-- Camada 1: White/Navy (Máscara do fundo da SEÇÃO 2 - Z: 20) -->\n        <svg class='absolute bottom-0 left-0 w-full h-full fill-current text-gray-100 dark:text-audit-bgDark z-20' viewBox='0 0 1440 100' preserveAspectRatio='none'>\n            <path d='M1440,60 C1200,90 960,100 720,100 C480,100 240,90 0,60 L0,100 L1440,100 Z'></path>\n        </svg>\n    </div>\n</section>\n\n<!-- SEÇÃO 2 (ACESSO RÁPIDO) -->\n<section id='acesso-rapido' class='relative bg-gray-100 dark:bg-audit-bgDark py-20'>\n    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>\n        <h2 class='text-3xl md:text-4xl font-bold mb-12 text-audit-blue dark:text-audit-gold animate-slide-in-up text-center'>Acesso Rápido</h2>\n        <div class='grid md:grid-cols-5 gap-6 text-audit-navy/90 dark:text-gray-300'>\n            \n            <!-- Item 1: Modelos de Papéis de Trabalho -->\n            <div class='p-6 rounded-xl shadow-xl dark:bg-audit-cardDark/80 hover:shadow-2xl transition-shadow border border-audit-blue/10 dark:border-audit-gold/20 text-center flex flex-col items-center'>\n                <i class='fas fa-file-alt text-4xl text-audit-gold mb-3'></i>\n                <h3 class='font-semibold text-lg text-audit-blue dark:text-white mb-2'>Papéis de Trabalho</h3>\n                <a href='#' class='text-sm text-audit-blue/70 dark:text-gray-400 hover:text-audit-gold font-medium mt-auto'>Acessar Modelos</a>\n            </div>\n            \n            <!-- Item 2: Modelos de Carta de Circularização -->\n            <div class='p-6 rounded-xl shadow-xl dark:bg-audit-cardDark/80 hover:shadow-2xl transition-shadow border border-audit-blue/10 dark:border-audit-gold/20 text-center flex flex-col items-center'>\n                <i class='fas fa-envelope-open-text text-4xl text-audit-gold mb-3'></i>\n                <h3 class='font-semibold text-lg text-audit-blue dark:text-white mb-2'>Carta de Circularização</h3>\n                <a href='#' class='text-sm text-audit-blue/70 dark:text-gray-400 hover:text-audit-gold font-medium mt-auto'>Acessar Modelos</a>\n            </div>\n\n            <!-- Item 3: Exame de Suficiência -->\n            <div class='p-6 rounded-xl shadow-xl dark:bg-audit-cardDark/80 hover:shadow-2xl transition-shadow border border-audit-blue/10 dark:border-audit-gold/20 text-center flex flex-col items-center'>\n                <i class='fas fa-balance-scale text-4xl text-audit-gold mb-3'></i>\n                <h3 class='font-semibold text-lg text-audit-blue dark:text-white mb-2'>Exame de Suficiência</h3>\n                <a href='#' class='text-sm text-audit-blue/70 dark:text-gray-400 hover:text-audit-gold font-medium mt-auto'>Acesse nosso simulado</a>\n            </div>\n            \n            <!-- Item 4: Exame de Qualificação Técnica -->\n            <div class='p-6 rounded-xl shadow-xl dark:bg-audit-cardDark/80 hover:shadow-2xl transition-shadow border border-audit-blue/10 dark:border-audit-gold/20 text-center flex flex-col items-center'>\n                <i class='fas fa-laptop-code text-4xl text-audit-gold mb-3'></i>\n                <h3 class='font-semibold text-lg text-audit-blue dark:text-white mb-2'>Exame de Qualificação Técnica (CNAI)</h3>\n                <a href='#' class='text-sm text-audit-blue/70 dark:text-gray-400 hover:text-audit-gold font-medium mt-auto'>Acesse nosso simulado</a>\n            </div>\n\n            <!-- Item 5: Guia de Bolso -->\n            <div class='p-6 rounded-xl shadow-xl dark:bg-audit-cardDark/80 hover:shadow-2xl transition-shadow border border-audit-blue/10 dark:border-audit-gold/20 text-center flex flex-col items-center'>\n                <i class='fas fa-book-reader text-4xl text-audit-gold mb-3'></i>\n                <h3 class='font-semibold text-lg text-audit-blue dark:text-white mb-2'>Guia de Bolso</h3>\n                <a href='#' class='text-sm text-audit-blue/70 dark:text-gray-400 hover:text-audit-gold font-medium mt-auto'>Acessar Conteúdo</a>\n            </div>\n\n        </div>\n    </div>\n</section>\n\n<!-- SEÇÃO NEWSLETTER -->\n<section id='newsletter' class='bg-audit-gold text-audit-navy py-20'>\n    <div class='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>\n        <h2 class='text-3xl md:text-4xl font-extrabold mb-4'>Assine Nossa Newsletter</h2>\n        <p class='text-lg mb-8 opacity-90'>Receba as últimas novidades, guias exclusivos e artigos de compliance diretamente na sua caixa de entrada.</p>\n        \n        <form onsubmit='handleNewsletter(event)' class='flex flex-col sm:flex-row gap-4 justify-center'>\n            <input type='email' placeholder='Seu melhor e-mail corporativo' required class='flex-grow p-4 rounded-xl border-2 border-audit-navy/20 focus:border-audit-blue focus:ring-audit-blue shadow-lg transition-all dark:bg-white dark:text-audit-navy'>\n            <button type='submit' class='bg-audit-blue text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-audit-navy transition-colors'>\n                <i class='fas fa-paper-plane mr-2'></i> Inscrever-se\n            </button>\n        </form>\n    </div>\n</section>`
};
const mainContainer = document.getElementById('main-container');

// Listener para o evento de conclusão do preloader
document.addEventListener('componentsLoaded', () => {
    // Código que roda após o esqueleto (Header/Footer) carregar e o preloader sair.
    console.log('Main: Evento componentsLoaded recebido. Injetando conteúdo principal.');
    
    if (mainContainer) {
        // Injeta o conteúdo da home/página atual
        mainContainer.innerHTML = HOME_CONTENT_DATA.html;
        document.title = HOME_CONTENT_DATA.title;
        console.log('Main Content: Conteúdo injetado no #main-container.');
    }
});

/**
 * Função de manipulação da Newsletter.
 * É chamada diretamente pelo evento onsubmit do formulário em pages/home.json
 * @param {Event} event O evento de submissão do formulário.
 */
function handleNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector('input[type="email"]');
    const email = input.value;
    
    // Simulação de envio
    if (email && email.includes('@') && email.length > 5) {
        console.log(`Newsletter: E-mail ${email} cadastrado com sucesso (Simulação).`);
        input.value = ''; // Limpa o campo
        
        const form = event.target;
        
        // Remove qualquer mensagem anterior
        form.parentNode.querySelectorAll('.newsletter-msg').forEach(msg => msg.remove());

        const successMsg = document.createElement('p');
        // Define a classe da mensagem
        successMsg.className = 'newsletter-msg text-green-600 dark:text-green-300 font-semibold mt-4 opacity-0';
        // Adiciona animação de entrada
        successMsg.style.animation = 'fadeIn 0.5s ease-out forwards'; 
        successMsg.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Cadastro de ${email} realizado!`;
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
            // Adiciona animação de saída (a keyframe 'fadeOut' deve estar em global.css)
            successMsg.style.animation = 'fadeOut 0.5s ease-out forwards'; 
            setTimeout(() => successMsg.remove(), 500);
        }, 4000);

    } else {
        console.error('Newsletter: E-mail inválido.');
        
        const form = event.target;
        form.parentNode.querySelectorAll('.newsletter-msg').forEach(msg => msg.remove());
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'newsletter-msg text-red-600 dark:text-red-300 font-semibold mt-4 opacity-0';
        errorMsg.style.animation = 'fadeIn 0.5s ease-out forwards';
        errorMsg.innerHTML = `<i class="fas fa-times-circle mr-2"></i> Por favor, insira um e-mail válido.`;
        form.parentNode.insertBefore(errorMsg, form.nextSibling);

        // Remove a mensagem de erro após 5 segundos
        setTimeout(() => {
            errorMsg.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => errorMsg.remove(), 500);
        }, 5000);
    }
}

// Exporta a função para que ela possa ser acessada globalmente (necessário para o onsubmit no HTML)
window.handleNewsletter = handleNewsletter;
