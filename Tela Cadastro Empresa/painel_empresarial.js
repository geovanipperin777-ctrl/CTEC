document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const nomeEmpresaElement = document.getElementById('nomeEmpresa');
    const btnVoltar = document.getElementById('btnVoltar');
    const btnCriarVaga = document.getElementById('btnCriarVaga');
    const btnVerCurriculos = document.getElementById('btnVerCurriculos');

    // Verifica autenticação
    function verificarAutenticacao() {
        return fetch('../api/verificarAutenticacao.php')
            .then(response => {
                if (!response.ok) throw new Error('Erro na verificação');
                return response.json();
            });
    }

    // Carrega o nome da empresa
    async function carregarNomeEmpresa() {
        try {
            nomeEmpresaElement.textContent = "Carregando...";
            
            const auth = await verificarAutenticacao();
            if (!auth.autenticado) throw new Error('Não autenticado');

            const response = await fetch('../api/getEmpresaNome.php');
            if (!response.ok) throw new Error('Erro ao buscar dados');

            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Erro desconhecido');

            nomeEmpresaElement.textContent = data.nome;
        } catch (error) {
            console.error('Erro:', error);
            nomeEmpresaElement.textContent = "Erro ao carregar";
            setTimeout(() => {
                window.location.href = "../Tela de Login/telaLogin.html";
            }, 2000);
        }
    }

    // Event Listeners
    btnVoltar.addEventListener('click', function() {
        fetch('../api/logout.php')
            .finally(() => {
                window.location.href = "../Tela de Login/telaLogin.html";
            });
    });

    btnCriarVaga.addEventListener('click', function() {
        verificarAutenticacao()
            .then(auth => {
                if (auth.autenticado) {
                    window.location.href = "../Crud Vagas/novo_modelo.php";
                } else {
                    throw new Error('Não autenticado');
                }
            })
            .catch(() => {
                window.location.href = "../Tela de Login/telaLogin.html";
            });
    });

    btnVerCurriculos.addEventListener('click', function() {
        verificarAutenticacao()
            .then(auth => {
                if (auth.autenticado) {
                    window.location.href = "../visualizar_curriculos.php";
                } else {
                    throw new Error('Não autenticado');
                }
            })
            .catch(() => {
                window.location.href = "../Tela de Login/telaLogin.html";
            });
    });

    // Inicialização
    carregarNomeEmpresa();
});