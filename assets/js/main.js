/**
 * Main JS
 * Lógica específica para interações dentro da área de conteúdo principal.
 */

document.addEventListener('componentsLoaded', () => {
    // Código que roda após o esqueleto (Header/Footer) carregar
    console.log('Main: Estrutura carregada.');
});

/**
 * Função de manipulação da Newsletter.
 * É chamada diretamente pelo evento onsubmit do formulário em pages/home.json
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
        const successMsg = document.createElement('p');
        successMsg.className = 'text-green-600 dark:text-green-300 font-semibold mt-4 animate-fade-in';
        successMsg.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Cadastro de ${email} realizado!`;
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 4000);

    } else {
        console.error('Newsletter: E-mail inválido.');
    }
}
