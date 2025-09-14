// -------------------------------------------
// Função para exibir o nome da empresa logada
// -------------------------------------------
function exibirNomeEmpresa() {
    // Remove qualquer nome antigo da empresa armazenado no localStorage
    localStorage.removeItem('empresa_nome');
    
    // Faz uma requisição para a API que retorna o nome da empresa logada
    fetch('../Tela Cadastro Empresa/getEmpresaNome.php')
        .then(response => {
            // Verifica se a resposta da API está OK (status 200)
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            // Se a resposta for bem-sucedida e tiver um nome de empresa
            if (data.success && data.nome) {
                const nomeEmpresa = data.nome;

                // Atualiza o conteúdo do elemento com ID 'nomeEmpresa'
                document.getElementById('nomeEmpresa').textContent = nomeEmpresa;

                // Armazena o nome no sessionStorage (válido apenas para a sessão atual)
                sessionStorage.setItem('empresa_nome', nomeEmpresa);
            } else {
                // Caso não haja nome, define um texto padrão
                document.getElementById('nomeEmpresa').textContent = 'Sua Empresa';
            }
        })
        .catch(error => {
            // Em caso de erro na requisição, exibe mensagem no console
            console.error('Erro ao buscar nome da empresa:', error);

            // Define um nome padrão na interface
            document.getElementById('nomeEmpresa').textContent = 'Sua Empresa';
        });
}

// -------------------------------------------
// Funções de navegação entre páginas do sistema
// -------------------------------------------

// Redireciona para a página de criação de nova vaga
function abrirTelaCriarVaga() {
    window.location.href = "../Crud Vagas/nova_vaga.php";
}

// Redireciona para a tela que exibe todas as vagas criadas pela empresa
function abrirTelaVagasCriadas() {
    window.location.href = "../Crud Vagas/todas_vagas.php";
}

// Redireciona para a página de visualização de currículos recebidos
function abrirTelaCurriculos() {
    window.location.href = "../Visualizar Curriculo/visualizar_curriculos.php";
}

// -------------------------------------------------
// Executa quando a página for completamente carregada
// -------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Remove qualquer nome de empresa antigo armazenado na sessão
    sessionStorage.removeItem('empresa_nome');

    // Executa a função para exibir o nome da empresa atual
    exibirNomeEmpresa();

    // Configura o botão de "Voltar" para redirecionar para a tela de login
    // e limpar os dados temporários armazenados
    const botaoVoltar = document.querySelector('.voltar');
    if (botaoVoltar) {
        botaoVoltar.onclick = function() {
            // Limpa os dados de nome da empresa das sessões temporárias
            sessionStorage.removeItem('empresa_nome');
            localStorage.removeItem('empresa_nome');

            // Redireciona para a tela de login
            window.location.href = '../Tela de Login/telaLogin.html';
        };
    }
});
