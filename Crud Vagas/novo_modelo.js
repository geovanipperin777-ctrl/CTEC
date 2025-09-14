function validarFormulario() {
            // Validação do telefone
            const telefoneInput = document.getElementById('telefone');
            const telefoneError = document.getElementById('telefone-error');
            const telefoneValue = telefoneInput.value.replace(/\D/g, ''); // Remove todos os não dígitos
            
            if (telefoneValue && (telefoneValue.length < 10 || telefoneValue.length > 11)) {
                telefoneError.style.display = 'block';
                telefoneInput.focus();
                return false;
            } else {
                telefoneError.style.display = 'none';
            }
            
            // Validação do CNPJ
            const cnpjInput = document.getElementById('cnpj');
            const cnpjError = document.getElementById('cnpj-error');
            const cnpjValue = cnpjInput.value.replace(/\D/g, ''); // Remove todos os não dígitos
            
            if (cnpjValue && cnpjValue.length !== 14) {
                cnpjError.style.display = 'block';
                cnpjInput.focus();
                return false;
            } else {
                cnpjError.style.display = 'none';
            }
            
            return true;
        }

        // Máscara para telefone
        document.getElementById('telefone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length > 0) {
                value = value.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, function(match, g1, g2, g3) {
                    let result = '';
                    if (g1) result += `(${g1}`;
                    if (g2) result += `) ${g2}`;
                    if (g3) result += `-${g3}`;
                    return result;
                });
            }
            
            e.target.value = value;
        });

        // Máscara para CNPJ
        document.getElementById('cnpj').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 14) {
                value = value.substring(0, 14);
            }
            
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
            
            e.target.value = value;
        });