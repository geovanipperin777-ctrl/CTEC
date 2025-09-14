// Função para validar o formulário antes do envio
function validarFormulario() {
    // Validação do telefone
    const telefoneInput = document.getElementById('telefone'); // Campo do telefone
    const telefoneError = document.getElementById('telefone-error'); // Mensagem de erro do telefone
    const telefoneValue = telefoneInput.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

    // Verifica se o número de telefone tem entre 10 e 11 dígitos
    if (telefoneValue && (telefoneValue.length < 10 || telefoneValue.length > 11)) {
        telefoneError.style.display = 'block'; // Mostra erro
        telefoneInput.focus(); // Coloca o foco no campo
        return false; // Impede o envio do formulário
    } else {
        telefoneError.style.display = 'none'; // Esconde a mensagem de erro
    }

    // Validação do CNPJ
    const cnpjInput = document.getElementById('cnpj'); // Campo do CNPJ
    const cnpjError = document.getElementById('cnpj-error'); // Mensagem de erro do CNPJ
    const cnpjValue = cnpjInput.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

    // Verifica se o CNPJ contém exatamente 14 dígitos
    if (cnpjValue && cnpjValue.length !== 14) {
        cnpjError.style.display = 'block'; // Mostra erro
        cnpjInput.focus(); // Coloca o foco no campo
        return false; // Impede o envio do formulário
    } else {
        cnpjError.style.display = 'none'; // Esconde a mensagem de erro
    }

    // Se tudo estiver válido, permite o envio
    return true;
}

// Máscara para o campo de telefone (aplicada enquanto o usuário digita)
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    // Limita a quantidade máxima de dígitos a 11
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    // Aplica a máscara (formatação)
    if (value.length > 0) {
        value = value.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, function(match, g1, g2, g3) {
            let result = '';
            if (g1) result += `(${g1}`;         // DDD
            if (g2) result += `) ${g2}`;        // Parte do número
            if (g3) result += `-${g3}`;         // Final do número
            return result;
        });
    }

    e.target.value = value; // Atualiza o valor formatado no campo
});

// Máscara para o campo de CNPJ (aplicada enquanto o usuário digita)
document.getElementById('cnpj').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    // Limita a quantidade máxima de dígitos a 14
    if (value.length > 14) {
        value = value.substring(0, 14);
    }

    // Aplica a máscara (formatação)
    if (value.length > 0) {
        value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, function(match, g1, g2, g3, g4, g5) {
            let result = '';
            if (g1) result += `${g1}`;
            if (g2) result += `.${g2}`;
            if (g3) result += `.${g3}`;
            if (g4) result += `/${g4}`;
            if (g5) result += `-${g5}`;
            return result;
        });
    }

    e.target.value = value; // Atualiza o valor formatado no campo
});
