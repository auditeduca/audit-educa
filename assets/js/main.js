/**
 * Lógica de Carregamento Principal e Handlers de Eventos
 * Este script aguarda o evento 'componentsLoaded' (disparado pelo preloader) antes de carregar o conteúdo principal.
 */

// Adiciona classes de animação ao escopo global (assumindo que o CSS define estas animações)
// Estes nomes de classes são usados no pages/home.json
// Exemplo: Elemento animado em pages/home.json:
// <h1 class='... animate-fade-in-down'>...</h1>

// O código abaixo é apenas um placeholder de escopo para as classes de animação.
// A definição real das animações (keyframes) deve estar no assets/css/global.css.
document.addEventListener('componentsLoaded', () => {
    // Código que roda após o esqueleto (Header/Footer) carregar e o preloader sair.
    console.log('Main: Estrutura carregada (Preloader finalizado).');
    
    // Carregue e injete o conteúdo da home/página atual aqui, se ainda não o fez.
    // Exemplo de Injeção:
    /*
    const homeContent = { ... }; // Dados de pages/home.json
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
        mainContainer.innerHTML = homeContent.html;
    }
    */
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
    if (email && email.includes('@')) {
        console.log(`Newsletter: E-mail ${email} cadastrado com sucesso (Simulação).`);
        input.value = ''; // Limpa o campo
        
        // Alerta visual amigável (em vez de alert() nativo)
        const form = event.target;
        
        // Remove qualquer mensagem anterior
        form.parentNode.querySelectorAll('.newsletter-msg').forEach(msg => msg.remove());

        const successMsg = document.createElement('p');
        successMsg.className = 'newsletter-msg text-green-600 dark:text-green-300 font-semibold mt-4 opacity-0';
        successMsg.style.animation = 'fadeIn 0.5s ease-out forwards'; // Usando animação inline
        successMsg.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Cadastro de ${email} realizado!`;
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.5s ease-out forwards'; // Adiciona animação de saída (se definida no CSS)
            setTimeout(() => successMsg.remove(), 500);
        }, 4000);

    } else {
        console.error('Newsletter: E-mail inválido.');
        // Adiciona mensagem de erro
        const form = event.target;
        form.parentNode.querySelectorAll('.newsletter-msg').forEach(msg => msg.remove());
        const errorMsg = document.createElement('p');
        errorMsg.className = 'newsletter-msg text-red-600 dark:text-red-300 font-semibold mt-4 opacity-0';
        errorMsg.style.animation = 'fadeIn 0.5s ease-out forwards';
        errorMsg.innerHTML = `<i class="fas fa-times-circle mr-2"></i> Por favor, insira um e-mail válido.`;
        form.parentNode.insertBefore(errorMsg, form.nextSibling);
    }
}

// Exporta a função para que ela possa ser acessada globalmente (necessário para onsubmit no HTML)
window.handleNewsletter = handleNewsletter;
