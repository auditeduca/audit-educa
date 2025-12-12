/**
 * Lógica de Carregamento Principal e Handlers de Eventos
 *
 * Objetivo: Configurar listeners globais. O TemplateEngine.js é responsável pelo roteamento 
 * e injeção do conteúdo principal da página (Ex: home.json).
 * * *Aviso*: A injeção inicial de conteúdo foi removida deste arquivo (main.js) para evitar 
 * conflito com a lógica de roteamento do template-engine.js, que é quem deve 
 * gerenciar o placeholder #content-placeholder.
 */

// Listener para o evento de conclusão do preloader
document.addEventListener('componentsLoaded', () => {
    // Código que roda após o esqueleto (Header/Footer) carregar e o preloader sair.
    console.log('Main: Evento componentsLoaded recebido. Handlers de eventos globais inicializados.');
    
    // OBS: O template-engine.js agora deve carregar a rota inicial ('home') por conta própria
    // após receber este evento ou após sua própria inicialização.
});

/**
 * Função de manipulação da Newsletter (Mantida para ser globalmente acessível)
 * É chamada diretamente pelo evento onsubmit do formulário.
 * @param {Event} event O evento de submissão do formulário.
 */
function handleNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector('input[type="email"]');
    const email = input.value;
    
    if (email && email.includes('@') && email.length > 5) {
        console.log(`Newsletter: E-mail ${email} cadastrado com sucesso (Simulação).`);
        input.value = '';
        
        const form = event.target;
        form.parentNode.querySelectorAll('.newsletter-msg').forEach(msg => msg.remove());

        const successMsg = document.createElement('p');
        successMsg.className = 'newsletter-msg text-green-600 dark:text-green-300 font-semibold mt-4 opacity-0';
        successMsg.style.animation = 'fadeIn 0.5s ease-out forwards'; 
        successMsg.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Cadastro de ${email} realizado!`;
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        setTimeout(() => {
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

        setTimeout(() => {
            errorMsg.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => errorMsg.remove(), 500);
        }, 5000);
    }
}

// Exporta a função para que ela possa ser acessada globalmente 
window.handleNewsletter = handleNewsletter;
