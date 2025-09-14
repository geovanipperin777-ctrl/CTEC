

// Recupera o modelo selecionado da URL
const urlParams = new URLSearchParams(window.location.search);
const modeloSelecionado = urlParams.get('modelo');

document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('scrollToTop')) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        sessionStorage.removeItem('scrollToTop');
    }
});



// Contadores para experiências, formações e idiomas
let expCount = 1;
let formCount = 1;
let idiomaCount = 1;

/**
 * Função para calcular idade com base na data de nascimento
 * @param {string} dataNascimento - formato YYYY-MM-DD
 * @returns {number|null} - retorna a idade ou null se inválida
 */
function calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    
    if (isNaN(nascimento.getTime())) return null; // data inválida
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
    
    // Verifica se a pessoa ainda não fez aniversário este ano
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--;
    }
    
    return idade;
}

// Quando a data de nascimento for alterada, calcula e exibe a idade
document.getElementById('dataNascimento').addEventListener('change', function() {
    const dataNascimento = this.value;
    const idade = calcularIdade(dataNascimento);
    const idadeElemento = document.getElementById('idadeCalculada');
    const idadeHidden = document.getElementById('idade');
    
    if (idade !== null) {
        idadeElemento.textContent = `Idade calculada: ${idade} anos`;
        idadeHidden.value = idade; // campo oculto para armazenar a idade
    } else {
        idadeElemento.textContent = '';
        idadeHidden.value = '';
    }
});

// Configuração dos botões de remoção de seção
function setupRemoveSection(btnId, confirmId, cancelId, confirmBtnId, sectionId) {
    const btn = document.getElementById(btnId);
    const confirmDiv = document.getElementById(confirmId);
    const cancelBtn = document.getElementById(cancelId);
    const confirmBtn = document.getElementById(confirmBtnId);
    
    // Garante que a confirmação está escondida inicialmente
    confirmDiv.style.display = 'none';
    
    btn.addEventListener('click', function() {
        confirmDiv.style.display = 'block';
    });
    
    cancelBtn.addEventListener('click', function() {
        confirmDiv.style.display = 'none';
    });
    
    confirmBtn.addEventListener('click', function() {
        document.getElementById(sectionId).style.display = 'none';
        confirmDiv.style.display = 'none';
    });
}

// Configurar para cada seção
setupRemoveSection(
    'btn-remove-experiencias',
    'confirm-remove-experiencias',
    'cancel-remove-experiencias',
    'confirm-remove-experiencias-btn',
    'experiencias-section'
);

setupRemoveSection(
    'btn-remove-formacoes',
    'confirm-remove-formacoes',
    'cancel-remove-formacoes',
    'confirm-remove-formacoes-btn',
    'formacoes-section'
);

setupRemoveSection(
    'btn-remove-habilidades',
    'confirm-remove-habilidades',
    'cancel-remove-habilidades',
    'confirm-remove-habilidades-btn',
    'habilidades-section'
);

// Adicionar nova experiência
document.getElementById('add-experiencia').addEventListener('click', function() {
    const container = document.getElementById('experiencias-container');
    const newExp = document.createElement('div');
    newExp.className = 'experiencia-item';
    newExp.innerHTML = `
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="empresa${expCount+1}">Empresa</label>
                    <input type="text" id="empresa${expCount+1}" name="experiencia[${expCount}][empresa]">
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="cargo${expCount+1}">Cargo</label>
                    <input type="text" id="cargo${expCount+1}" name="experiencia[${expCount}][cargo]">
                </div>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="inicio${expCount+1}">Ano de Início</label>
                    <input type="number" id="inicio${expCount+1}" name="experiencia[${expCount}][inicio]" min="1900" max="2100" class="year-input">
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="fim${expCount+1}">Ano de Término</label>
                    <input type="number" id="fim${expCount+1}" name="experiencia[${expCount}][fim]" min="1900" max="2100" class="year-input">
                    <small>Deixe em branco se for o emprego atual</small>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label for="descricao${expCount+1}">Descrição das Atividades</label>
            <textarea id="descricao${expCount+1}" name="experiencia[${expCount}][descricao]"></textarea>
        </div>
        
        <button type="button" class="remove-btn" onclick="this.parentNode.remove()">
            <i class="fas fa-trash-alt"></i> Remover experiência
        </button>
    `;
    container.appendChild(newExp);
    expCount++;
});

// Adicionar nova formação
document.getElementById('add-formacao').addEventListener('click', function() {
    const container = document.getElementById('formacoes-container');
    const newForm = document.createElement('div');
    newForm.className = 'formacao-item';
    newForm.innerHTML = `
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="instituicao${formCount+1}">Instituição de Ensino</label>
                    <input type="text" id="instituicao${formCount+1}" name="formacao[${formCount}][instituicao]">
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="curso${formCount+1}">Curso</label>
                    <input type="text" id="curso${formCount+1}" name="formacao[${formCount}][curso]">
                </div>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="nivel${formCount+1}">Nível</label>
                    <select id="nivel${formCount+1}" name="formacao[${formCount}][nivel]">
                        <option value="">Selecione</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Graduação">Graduação</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="conclusao${formCount+1}">Ano de Conclusão</label>
                    <input type="number" id="conclusao${formCount+1}" name="formacao[${formCount}][conclusao]" min="1900" max="2100" class="year-input">
                </div>
            </div>
        </div>
        
        <button type="button" class="remove-btn" onclick="this.parentNode.remove()">
            <i class="fas fa-trash-alt"></i> Remover formação
        </button>
    `;
    container.appendChild(newForm);
    formCount++;
});

// Adicionar novo idioma
document.getElementById('add-idioma').addEventListener('click', function() {
    const container = document.getElementById('idiomas-container');
    const newIdioma = document.createElement('div');
    newIdioma.className = 'idioma-item';
    newIdioma.innerHTML = `
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <input type="text" name="idioma[${idiomaCount}][nome]" placeholder="Idioma">
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <select name="idioma[${idiomaCount}][nivel]">
                        <option value="">Nível</option>
                        <option value="Básico">Básico</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                    </select>
                </div>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="this.parentNode.remove()">
            <i class="fas fa-trash-alt"></i> Remover idioma
        </button>
    `;
    container.appendChild(newIdioma);
    idiomaCount++;
});

// Gerenciamento de habilidades
const habilidadeInput = document.getElementById('habilidade-input');
const habilidadesSelecionadas = document.getElementById('habilidades-selecionadas');
const habilidadesHidden = document.getElementById('habilidades');
let habilidadesArray = [];

habilidadeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        e.preventDefault();
        const habilidade = this.value.trim();
        
        if (!habilidadesArray.includes(habilidade)) {
            habilidadesArray.push(habilidade);
            updateHabilidadesDisplay();
        }
        
        this.value = '';
    }
});

function updateHabilidadesDisplay() {
    habilidadesSelecionadas.innerHTML = '';
    habilidadesArray.forEach((hab, index) => {
        const tag = document.createElement('div');
        tag.className = 'habilidade-tag';
        tag.innerHTML = `
            ${hab}
            <button type="button" onclick="removeHabilidade(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        habilidadesSelecionadas.appendChild(tag);
    });
    habilidadesHidden.value = habilidadesArray.join(', ');
}

window.removeHabilidade = function(index) {
    habilidadesArray.splice(index, 1);
    updateHabilidadesDisplay();
};

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 0) {
        value = value.replace(/(\d{0})(\d{0})(\d{0,5})(\d{0,4})/, 
                       (_, ddd, prefix, first, last) => {
            let result = '';
            if (ddd) result += `(${ddd}`;
            if (prefix) result += `) ${prefix}`;
            if (first) result += `-${first}`;
            if (last) result += `${last}`;
            return result;
        });
    }
    e.target.value = value;
});

// Gerenciamento do upload de foto
document.getElementById('foto-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('O arquivo é muito grande. Por favor, selecione uma imagem menor que 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const fotoPreview = document.getElementById('foto-preview');
            fotoPreview.src = event.target.result;
            fotoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Envio do formulário
document.getElementById('curriculoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const fotoInput = document.getElementById('foto-input');
    let fotoBase64 = null;
    
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            fotoBase64 = event.target.result;
            submitFormData(formData, fotoBase64);
        };
        reader.readAsDataURL(file);
    } else {
        submitFormData(formData, null);
    }
});

const CHAR_LIMITS = {
    'objetivo': 500,
    'sobre': 500,
    'descricao1': 500
};

// Configurar o botão voltar
document.getElementById('btnVoltarTopo').addEventListener('click', function() {
    window.location.href = '../tela inicial/telainicial.html';
});

// Função para criar contadores de caracteres
function setupCharCounters() {
    Object.keys(CHAR_LIMITS).forEach(id => {
        const textarea = document.getElementById(id);
        if (textarea) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.textContent = `${textarea.value.length}/${CHAR_LIMITS[id]}`;
            textarea.parentNode.appendChild(counter);
            
            textarea.addEventListener('input', function() {
                const remaining = CHAR_LIMITS[id] - this.value.length;
                counter.textContent = `${this.value.length}/${CHAR_LIMITS[id]}`;
                
                // Atualiza classes para feedback visual
                counter.classList.remove('warning', 'error');
                if (remaining < 50 && remaining >= 10) {
                    counter.classList.add('warning');
                } else if (remaining < 10) {
                    counter.classList.add('error');
                }
                
                // Limita o texto se exceder o máximo
                if (this.value.length > CHAR_LIMITS[id]) {
                    this.value = this.value.substring(0, CHAR_LIMITS[id]);
                    counter.textContent = `${CHAR_LIMITS[id]}/${CHAR_LIMITS[id]}`;
                }
            });
        }
    });
}

// Botão Voltar
document.getElementById('btnVoltar').addEventListener('click', function() {
    window.location.href = '../tela inicial/telainicial.html';
});

// Chamar a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setupCharCounters();
    
    // Adicionar classe ao botão Voltar
    const btnVoltar = document.getElementById('btnVoltar');
    btnVoltar.classList.add('btn-voltar');
    btnVoltar.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar';
});

function submitFormData(formData, fotoBase64) {
    const data = {
        modelo: modeloSelecionado,
        infoPessoais: {
            nome: formData.get('nome'),
            idade: formData.get('idade') || null,
            profissao: formData.get('profissao') || null,
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            linkedin: formData.get('linkedin') || null,
            objetivo: formData.get('objetivo') || null,
            sobre: formData.get('sobre') || null,
            foto: fotoBase64
        },
        experiencias: [],
        formacoes: [],
        idiomas: [],
        habilidades: habilidadesArray.length > 0 ? habilidadesArray : null
    };
    
    // Processar experiências (ignorar se todos campos estiverem vazios)
    for (let i = 0; formData.get(`experiencia[${i}][empresa]`) !== null; i++) {
        const empresa = formData.get(`experiencia[${i}][empresa]`);
        const cargo = formData.get(`experiencia[${i}][cargo]`);
        
        if (empresa || cargo) {
            data.experiencias.push({
                empresa: empresa,
                cargo: cargo,
                inicio: formData.get(`experiencia[${i}][inicio]`) || null,
                fim: formData.get(`experiencia[${i}][fim]`) || null,
                descricao: formData.get(`experiencia[${i}][descricao]`) || null
            });
        }
    }
    
    // Processar formações (ignorar se todos campos estiverem vazios)
    for (let i = 0; formData.get(`formacao[${i}][instituicao]`) !== null; i++) {
        const instituicao = formData.get(`formacao[${i}][instituicao]`);
        const curso = formData.get(`formacao[${i}][curso]`);
        
        if (instituicao || curso) {
            data.formacoes.push({
                instituicao: instituicao,
                curso: curso,
                nivel: formData.get(`formacao[${i}][nivel]`) || null,
                conclusao: formData.get(`formacao[${i}][conclusao]`) || null
            });
        }
    }
    
    // Processar idiomas (ignorar se todos campos estiverem vazios)
    for (let i = 0; formData.get(`idioma[${i}][nome]`) !== null; i++) {
        const nome = formData.get(`idioma[${i}][nome]`);
        if (nome) {
            data.idiomas.push({
                nome: nome,
                nivel: formData.get(`idioma[${i}][nivel]`) || null
            });
        }
    }
    
    // Salvar e redirecionar
    localStorage.setItem('dadosCurriculo', JSON.stringify(data));
    window.location.href = `visualizacao.html?modelo=${modeloSelecionado}`;
}

// Botão Voltar
document.getElementById('btnVoltar').addEventListener('click', function() {
    window.history.back();
});