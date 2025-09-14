document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // ELEMENTOS DO FORMULÁRIO
    // ========================
    const form = document.getElementById('cadastroForm');
    const submitBtn = document.getElementById('accessBtn');

    // ====================================
    // APLICAÇÃO DE MÁSCARAS EM TEMPO REAL
    // ====================================
    document.getElementById('cnpj').addEventListener('input', function(e) {
        mascaraCNPJ(e.target); // Aplica máscara de CNPJ
    });

    document.getElementById('cep').addEventListener('input', function(e) {
        mascaraCEP(e.target); // Aplica máscara de CEP
    });

    document.getElementById('telefone').addEventListener('input', function(e) {
        mascaraTelefone(e.target); // Aplica máscara de telefone
    });

    // =============================
    // VALIDAÇÕES EM TEMPO REAL
    // =============================
    // Validação de e-mail ao sair do campo
    document.getElementById('email').addEventListener('blur', function() {
        validarCampoEmail(this);
    });

    // Validação de confirmação de senha durante a digitação
    document.getElementById('passwordconfirm').addEventListener('input', function() {
        validarConfirmacaoSenha();
    });

    // =============================
    // ENVIO DO FORMULÁRIO
    // =============================
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede envio tradicional
        handleRegistration();   // Executa função personalizada de cadastro
    });

    // ==========================
    // FUNÇÃO DE VALIDAÇÃO GERAL
    // ==========================
    function validarFormulario() {
        let valido = true;
        let mensagensErro = [];

        // Nome obrigatório
        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            mensagensErro.push('O nome da empresa é obrigatório');
            valido = false;
        }

        // E-mail obrigatório e válido
        const email = document.getElementById('email').value.trim();
        if (!email) {
            mensagensErro.push('O email é obrigatório');
            valido = false;
        } else if (!validarEmail(email)) {
            mensagensErro.push('Por favor, insira um email válido');
            valido = false;
        }

        // Telefone com no mínimo 10 dígitos
        const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
        if (!telefone || telefone.length < 10) {
            mensagensErro.push('Telefone inválido (mínimo 10 dígitos)');
            valido = false;
        }

        // CNPJ com 14 dígitos
        const cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');
        if (!cnpj || cnpj.length !== 14) {
            mensagensErro.push('CNPJ inválido (deve ter 14 dígitos)');
            valido = false;
        }

        // CEP com 8 dígitos
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (!cep || cep.length !== 8) {
            mensagensErro.push('CEP inválido (deve ter 8 dígitos)');
            valido = false;
        }

        // Endereço obrigatório
        const endereco = document.getElementById('endereco').value.trim();
        if (!endereco) {
            mensagensErro.push('O endereço é obrigatório');
            valido = false;
        }

        // Bairro obrigatório
        const bairro = document.getElementById('bairro').value.trim();
        if (!bairro) {
            mensagensErro.push('O bairro é obrigatório');
            valido = false;
        }

        // Senha com mínimo de 6 caracteres
        const senha = document.getElementById('password').value;
        if (!senha || senha.length < 6) {
            mensagensErro.push('A senha deve ter pelo menos 6 caracteres');
            valido = false;
        }

        // Verifica se senhas coincidem
        if (!validarConfirmacaoSenha()) {
            mensagensErro.push('As senhas não coincidem');
            valido = false;
        }

        // Mostra todos os erros juntos, se houver
        if (mensagensErro.length > 0) {
            alert("Por favor, corrija os seguintes erros:\n\n" + mensagensErro.join('\n'));
        }

        return valido;
    }

    // ======================================
    // FUNÇÃO PRINCIPAL DE REGISTRO (CADASTRO)
    // ======================================
    async function handleRegistration() {
        if (!validarFormulario()) {
            return; // Interrompe se o formulário não estiver válido
        }

        try {
            // Desativa botão enquanto processa
            submitBtn.disabled = true;
            submitBtn.value = "Cadastrando...";

            // Coleta dados do formulário
            const formData = new FormData(form);

            // Remove máscaras antes de enviar
            formData.set('cnpj', formData.get('cnpj').replace(/\D/g, ''));
            formData.set('cep', formData.get('cep').replace(/\D/g, ''));
            formData.set('telefone', formData.get('telefone').replace(/\D/g, ''));

            // Envia para o servidor
            const response = await fetch('empresa.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro no servidor');
            }

            if (data.success) {
                // Sucesso no cadastro
                alert('Cadastro realizado com sucesso!');
                
                // Armazena informações no localStorage
                localStorage.setItem('empresa_nome', data.empresa_nome);
                localStorage.setItem('origem', 'cadastro');

                // Redireciona para o painel da empresa
                window.location.href = "../Painel de Controle/paineldecontrole.html";
            } else {
                // Mensagens de erro específicas
                if (data.message.includes('email já está cadastrado')) {
                    alert('Este email já está cadastrado');
                } else if (data.message.includes('CNPJ já está cadastrado')) {
                    alert('Este CNPJ já está cadastrado');
                } else {
                    alert(data.message || "Erro desconhecido no cadastro");
                }
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro ao cadastrar: ' + error.message);
        } finally {
            // Reativa botão ao final
            submitBtn.disabled = false;
            submitBtn.value = "Cadastrar";
        }
    }

    // ==========================
    // FUNÇÕES AUXILIARES
    // ==========================

    // Valida o formato do e-mail
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Exibe alerta se o e-mail for inválido
    function validarCampoEmail(campo) {
        const email = campo.value.trim();
        if (email && !validarEmail(email)) {
            alert('Por favor, insira um email válido');
            return false;
        }
        return true;
    }

    // Verifica se senha e confirmação são iguais
    function validarConfirmacaoSenha() {
        const senha = document.getElementById('password').value;
        const confirmacao = document.getElementById('passwordconfirm').value;
        return senha === confirmacao;
    }

    // Aplica máscara de CNPJ: 00.000.000/0000-00
    function mascaraCNPJ(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 14) value = value.substring(0, 14);
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        input.value = value;
    }

    // Aplica máscara de CEP: 00000-000
    function mascaraCEP(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.substring(0, 8);
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        input.value = value;
    }

    // Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
    function mascaraTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);

        if (value.length === 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length === 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/^(\d{0,2})/, '($1');
        }

        input.value = value;
    }
});
