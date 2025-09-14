document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o formulário de login e o elemento para exibir mensagens de erro
    const loginForm = document.getElementById('loginForm');
    const errorElement = document.getElementById('errorMessage');

    // Adiciona evento ao submeter o formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)
        
        // Obtém e limpa os valores dos campos de nome e senha
        const nome = document.getElementById('nome').value.trim();
        const senha = document.getElementById('senha').value.trim();
        
        errorElement.textContent = ''; // Limpa mensagem de erro anterior
        
        // Valida se os campos não estão vazios
        if (!nome || !senha) {
            showError('Por favor, preencha todos os campos.');
            return; // Sai da função para evitar o envio
        }

        try {
            // Envia uma requisição POST para o arquivo PHP com os dados em JSON
            const response = await fetch('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Define tipo do conteúdo como JSON
                },
                body: JSON.stringify({ nome, senha }) // Converte dados para JSON
            });

            // Aguarda a resposta e converte para objeto JS
            const data = await response.json();
            
            // Se o login foi bem-sucedido
            if (data.success) {
                // Armazena o nome do usuário no localStorage para uso posterior
                if (data.nome) {
                    localStorage.setItem('userName', data.nome);
                }
                
                // Exibe alertas diferentes dependendo do tipo de usuário logado
                if (data.tipo === 'usuario') {
                    alert('Login realizado como usuário');
                } else if (data.tipo === 'empresa') {
                    alert('Login realizado como empresa');
                }
                
                // Redireciona o usuário para a página indicada pelo backend
                window.location.href = data.redirect;
            } else {
                // Caso falhe o login, mostra a mensagem de erro retornada
                showError(data.message || 'Credenciais inválidas. Tente novamente.');
            }
        } catch (error) {
            // Captura e exibe erro caso a requisição falhe (problema de rede, servidor, etc)
            console.error('Erro:', error);
            showError('Erro ao tentar fazer login. Tente novamente mais tarde.');
        }
    });

    // Função para exibir mensagens de erro na página
    function showError(message) {
        errorElement.textContent = message;
    }
});
