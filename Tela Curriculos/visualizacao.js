// Recupera os dados do currículo do localStorage
let dadosCurriculo = JSON.parse(localStorage.getItem('dadosCurriculo'));

// Verifica se está na página de edição (presença do parâmetro "editando" na URL)
const estaEditando = new URLSearchParams(window.location.search).has('editando');

// Se estiver editando e não houver dados no localStorage, tenta buscar no sessionStorage (dados temporários)
if (estaEditando && !dadosCurriculo) {
    dadosCurriculo = JSON.parse(sessionStorage.getItem('dadosEditados')) || dadosCurriculo;
}

// Define um texto fixo indicando o modelo atual no indicador de modelo
document.getElementById('modeloIndicator').textContent = 'Modelo Moderno';

/**
 * Gera o currículo na página com base nos dados armazenados
 */
function gerarCurriculo() {
    const curriculoPaper = document.getElementById('curriculoPaper');

    // Se não encontrar dados, exibe mensagem solicitando preenchimento do formulário
    if (!dadosCurriculo) {
        curriculoPaper.innerHTML = '<p>Nenhum dado de currículo encontrado. Por favor, preencha o formulário.</p>';
        return;
    }

    // Desestrutura os dados pessoais e listas do currículo
    const { infoPessoais, experiencias, formacoes, habilidades, idiomas } = dadosCurriculo;

    // Começa a montar o HTML do currículo
    let html = `
        <div class="cabecalho">
            ${infoPessoais.foto ? `<img src="${infoPessoais.foto}" class="foto-perfil">` : ''}
            <div class="info-principal">
                <h1>${infoPessoais.nome}</h1>
                ${infoPessoais.profissao ? `<h2>${infoPessoais.profissao}</h2>` : ''}
                <div class="contato-info">
                    <div><i class="fas fa-envelope"></i> ${infoPessoais.email}</div>
                    <div><i class="fas fa-phone"></i> ${infoPessoais.telefone}</div>
                    ${infoPessoais.linkedin ? `<div><i class="fab fa-linkedin"></i> ${infoPessoais.linkedin}</div>` : ''}
                </div>
            </div>
        </div>`;

    // Se houver objetivo profissional, adiciona seção
    if (infoPessoais.objetivo) {
        html += `<div class="secao"><h3 class="secao-titulo">Objetivo Profissional</h3><p>${infoPessoais.objetivo}</p></div>`;
    }

    // Se houver "sobre", adiciona seção
    if (infoPessoais.sobre) {
        html += `<div class="secao"><h3 class="secao-titulo">Sobre</h3><p>${infoPessoais.sobre}</p></div>`;
    }

    // Monta seção de experiências profissionais, se houver
    if (experiencias?.length) {
        html += `<div class="secao"><h3 class="secao-titulo">Experiência Profissional</h3>`;
        experiencias.forEach(exp => {
            if (!exp.empresa && !exp.cargo) return; // Ignora se ambos não existirem
            html += `<div class="experiencia-item">
                <div class="experiencia-cabecalho">
                    <div>${exp.empresa || ''} ${exp.cargo ? ` - ${exp.cargo}` : ''}</div>
                    <div class="experiencia-periodo">${formatarPeriodo(exp.inicio, exp.fim)}</div>
                </div>
                ${exp.descricao ? `<div class="experiencia-descricao">${exp.descricao}</div>` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    // Monta seção de formações acadêmicas, se houver
    if (formacoes?.length) {
        html += `<div class="secao"><h3 class="secao-titulo">Formação Acadêmica</h3>`;
        formacoes.forEach(f => {
            html += `<div class="formacao-item">
                <div class="formacao-cabecalho">
                    <div>${f.instituicao || ''} ${f.curso ? ` - ${f.curso}` : ''} ${f.nivel ? `(${f.nivel})` : ''}</div>
                    ${f.conclusao ? `<div class="formacao-periodo">${f.conclusao}</div>` : ''}
                </div>
            </div>`;
        });
        html += `</div>`;
    }

    // Monta seção de habilidades, se houver
    if (habilidades?.length) {
        html += `<div class="secao"><h3 class="secao-titulo">Habilidades</h3><div class="habilidades-lista">`;
        habilidades.forEach(h => html += `<span class="habilidade-tag">${h}</span>`);
        html += `</div></div>`;
    }

    // Monta seção de idiomas, se houver
    if (idiomas?.length) {
        html += `<div class="secao"><h3 class="secao-titulo">Idiomas</h3><div class="idiomas-lista">`;
        idiomas.forEach(i => {
            html += `<div class="idioma-item"><div class="idioma-nome">${i.nome}</div><div class="idioma-nivel">${i.nivel}</div></div>`;
        });
        html += `</div></div>`;
    }

    // Insere o HTML gerado no container principal do currículo
    document.getElementById('curriculoPaper').innerHTML = html;
}

/**
 * Formata o período de uma experiência ou formação no formato "inicio - fim"
 * Caso fim não seja informado, usa "Atual"
 * @param {string|null} inicio 
 * @param {string|null} fim 
 * @returns {string}
 */
function formatarPeriodo(inicio, fim) {
    return `${inicio || ''} - ${fim || 'Atual'}`;
}

// Evento para botão de download do currículo em PDF usando html2pdf
document.getElementById('btnDownload').addEventListener('click', () => {
    const element = document.getElementById('curriculoPaper');
    const nomeArquivo = `Curriculo_${dadosCurriculo.infoPessoais.nome.replace(/\s+/g, '_')}.pdf`;

    // Configurações para o pdf
    const opt = {
        margin: 5,
        filename: nomeArquivo,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 1.5, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Gera e salva o PDF
    html2pdf().set(opt).from(element).save();
});

// Evento para botão "Editar" que volta para o formulário e mantém a rolagem no topo
document.getElementById('btnEditar').addEventListener('click', () => {
    sessionStorage.setItem('scrollToTop', 'true'); // Sinaliza para a página do formulário rolar para o topo ao carregar
    window.history.back();
});

/**
 * Função para imprimir o currículo
 * Aplica cores atuais e configurações específicas para impressão
 */
function imprimirCurriculo() {
    // Obtém as cores definidas nas variáveis CSS atuais
    const primaria = getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria').trim();
    const secundaria = getComputedStyle(document.documentElement).getPropertyValue('--cor-secundaria').trim();
    
    // Clona o conteúdo do currículo para imprimir
    const printContent = document.getElementById('curriculoPaper').cloneNode(true);
    
    // Cria um container temporário para o conteúdo de impressão
    const printDiv = document.createElement('div');
    printDiv.id = 'print-container';
    printDiv.appendChild(printContent);
    document.body.appendChild(printDiv);
    
    // Estilos específicos para impressão (cores, visibilidade e margem)
    const printStyles = `
        <style data-print-styles>
            :root {
                --cor-primaria: ${primaria};
                --cor-secundaria: ${secundaria};
            }
            @page { size: A4; margin: 10mm; }
            body * { visibility: hidden; }
            #print-container, #print-container * { 
                visibility: visible;
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
            }
            #print-container { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                margin: 0; 
                padding: 0; 
            }
            /* Esconde elementos desnecessários para impressão */
            .header, .color-palette, .acoes-container { display: none !important; }
        </style>
    `;
    
    // Adiciona os estilos ao documento
    document.head.insertAdjacentHTML('beforeend', printStyles);
    
    // Dispara a impressão
    window.print();
    
    // Remove o container e os estilos de impressão após impressão
    setTimeout(() => {
        printDiv.remove();
        const addedStyles = document.querySelector('style[data-print-styles]');
        if (addedStyles) addedStyles.remove();
    }, 500);
}

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona automaticamente a opção de cor 'moderno'
    const defaultOption = document.querySelector('.color-option[data-name="moderno"]');
    if (defaultOption) {
        defaultOption.classList.add('selected');
        const p = defaultOption.dataset.primary, s = defaultOption.dataset.secondary;
        // Aplica as cores primária e secundária ao documento
        document.documentElement.style.setProperty('--cor-primaria', p);
        document.documentElement.style.setProperty('--cor-secundaria', s);
    }

    // Adiciona eventos de clique para as opções de cores para mudar o tema
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove a seleção de todas
            colorOptions.forEach(o => o.classList.remove('selected'));
            // Marca a opção clicada como selecionada
            option.classList.add('selected');
            // Atualiza as cores do tema
            const p = option.dataset.primary, s = option.dataset.secondary, n = option.dataset.name;
            document.documentElement.style.setProperty('--cor-primaria', p);
            document.documentElement.style.setProperty('--cor-secundaria', s);
            // Atualiza o texto indicador do modelo selecionado
            document.getElementById('modeloIndicator').textContent = `Modelo ${n.charAt(0).toUpperCase() + n.slice(1)}`;
        });
    });

    // Gera o currículo ao carregar a página
    gerarCurriculo();
});
