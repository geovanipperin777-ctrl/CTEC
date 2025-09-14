// Espera o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {

    // ------------------------
    // Seleciona os elementos do formulário
    // ------------------------
    const form = document.getElementById('cadastroForm');            // Formulário de cadastro
    const accessBtn = document.getElementById('accessBtn');          // Botão "Cadastrar"
    const telefoneInput = document.getElementById('telefone');       // Campo de telefone
    const passwordInput = document.getElementById('password');       // Campo de senha
    const passwordConfirmInput = document.getElementById('passwordconfirm'); // Campo de confirmação de senha

    // ------------------------
    // Máscara dinâmica para o telefone
    // ------------------------
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
            value = value.substring(0, 11); // Limita a 11 dígitos
            let formattedValue = '';

            // Formata: (XX) XXXXX-XXXX
            if (value.length > 0) {
                formattedValue = `(${value.substring(0, 2)}`;
                if (value.length > 2) {
                    formattedValue += `) ${value.substring(2, 7)}`;
                    if (value.length > 7) {
                        formattedValue += `-${value.substring(7, 11)}`;
                    }
                }
            }

            e.target.value = formattedValue; // Atualiza o campo com a máscara
        });
    }

    // ------------------------
    // Validação de senha (mínimo de caracteres)
    // ------------------------
    function validatePassword() {
        if (passwordInput.value.length < 6) {
            passwordInput.setCustomValidity('A senha deve ter pelo menos 6 caracteres');
        } else {
            passwordInput.setCustomValidity('');
        }
    }

    // ------------------------
    // Validação de confirmação de senha (se as duas batem)
    // ------------------------
    function validatePasswordConfirm() {
        if (passwordInput.value !== passwordConfirmInput.value) {
            passwordConfirmInput.setCustomValidity('As senhas não coincidem');
        } else {
            passwordConfirmInput.setCustomValidity('');
        }
    }

    // Ativa validação em tempo real
    passwordInput.addEventListener('input', validatePassword);
    passwordConfirmInput.addEventListener('input', validatePasswordConfirm);

    // ------------------------
    // Função principal que lida com o cadastro
    // ------------------------
    async function handleCadastro(e) {
        e.preventDefault(); // Evita o envio padrão do formulário

        // Coleta os dados do formulário
        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            telefone: formData.get('telefone').replace(/\D/g, '').trim(),
            senha: formData.get('senha')
        };

        // ------------------------
        // Validações básicas antes do envio
        // ------------------------
        if (!data.nome || !data.email || !data.telefone || !data.senha) {
            return alert('Por favor, preencha todos os campos.');
        }

        if (data.telefone.length < 10 || data.telefone.length > 11) {
            return alert('Telefone inválido. Digite DDD + número (10 ou 11 dígitos).');
        }

        if (data.senha.length < 6) {
            return alert('A senha deve ter no mínimo 6 caracteres.');
        }

        if (data.senha !== passwordConfirmInput.value.trim()) {
            return alert('As senhas não coincidem.');
        }

        // Desativa o botão e mostra mensagem de carregamento
        accessBtn.disabled = true;
        accessBtn.textContent = 'Cadastrando...';

        // ------------------------
        // Envia os dados para o backend via fetch (AJAX)
        // ------------------------
        try {
            const response = await fetch('cadastrar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Caso a resposta tenha erro HTTP
            if (!response.ok) {
                throw new Error(result.message || 'Erro no servidor');
            }

            // Se cadastro for bem-sucedido
            if (result.success) {
                alert('Cadastro concluído com sucesso!');
                localStorage.setItem('userName', data.nome); // Armazena o nome no localStorage

                // Redireciona para a tela indicada ou para a tela inicial padrão
                if (result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    window.location.href = '../Tela inicial/telainicial.html';
                }
            } else {
                throw new Error(result.message || 'Erro ao cadastrar');
            }

        } catch (error) {
            // Exibe erro no console e alerta na tela
            console.error('Erro no cadastro:', error);
            alert(error.message || 'Erro ao conectar com o servidor');
        } finally {
            // Restaura o botão
            accessBtn.disabled = false;
            accessBtn.textContent = 'Cadastrar';
        }
    }

    // ------------------------
    // Eventos de envio do formulário
    // ------------------------
    form.addEventListener('submit', handleCadastro); // Envio por botão ou Enter
    accessBtn.addEventListener('click', handleCadastro); // Clique direto no botão

    // Permite enviar com Enter, exceto se estiver em uma textarea
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleCadastro(e);
        }
    });
});
