document.addEventListener('DOMContentLoaded', function() {
    // Aplica o tema escuro conforme configuração salva (mesmo que usuário não esteja logado)
    applyTheme();
    
    // 1. FUNCIONALIDADE DE USUÁRIO LOGADO
    const userNav = document.getElementById('userNav'); // Elemento do menu usuário

    if (userNav) {
        // Tenta obter o nome do usuário do sessionStorage ou, se não existir, do localStorage
        const userName = sessionStorage.getItem('userName') || localStorage.getItem('userName');
        
        if (userName) {
            // Se encontrou o nome, exibe o menu de usuário logado
            showLoggedInMenu(userName);
        } else {
            // Se não encontrou, faz requisição AJAX para obter o nome do servidor (getUserName.php)
            fetch('getUserName.php')
                .then(response => response.json())
                .then(data => {
                    if (data.nome) {
                        // Exibe o menu com o nome recebido
                        showLoggedInMenu(data.nome);
                        // Armazena no localStorage para otimizar futuras visitas
                        localStorage.setItem('userName', data.nome);
                    } else {
                        // Caso não receba nome, mostra o botão de login
                        showLoginButton();
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar nome:', error);
                    // Em caso de erro na requisição, também exibe botão de login
                    showLoginButton();
                });
        }
    }

    // Configura o botão para alternar tema claro/escuro (funciona mesmo sem login)
    setupThemeToggle();

    // Configura o redirecionamento do ícone/site CPS para a tela de carregamento com destino definido
    setupCpsRedirect();

    // 2. Inicializa todos os carrosséis da página
    document.querySelectorAll('.carrossel-container').forEach(initCarrossel);
});

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function initCarrossel(carrosselContainer) {
    const slides = carrosselContainer.querySelector('.carrossel-slides');
    const items = carrosselContainer.querySelectorAll('.carrossel-item');
    const prevBtn = carrosselContainer.querySelector('.carrossel-btn.prev');
    const nextBtn = carrosselContainer.querySelector('.carrossel-btn.next');
    const dots = carrosselContainer.querySelectorAll('.indicador');
    
    let currentIndex = 0;  // Índice atual do slide
    const totalItems = items.length;

    // Atualiza a posição do carrossel e o indicador ativo
    function updateCarrossel() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('ativo', index === currentIndex);
        });
    }

    // Avança para o próximo slide
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarrossel();
    });

    // Volta para o slide anterior
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarrossel();
    });

    // Permite selecionar slide clicando nos pontos indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarrossel();
        });
    });

    // Troca automática de slides a cada 5 segundos
    let interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarrossel();
    }, 5000);

    // Pausa o carrossel ao passar o mouse sobre ele
    carrosselContainer.addEventListener('mouseenter', () => {
        clearInterval(interval);
    });

    // Retoma o carrossel ao tirar o mouse de cima
    carrosselContainer.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarrossel();
        }, 5000);
    });

    // Inicializa o carrossel exibindo o slide inicial
    updateCarrossel();
}

// Configura o clique no ícone CPS para redirecionar para a tela de carregamento com destino
function setupCpsRedirect() {
    const cpsIcon = document.getElementById('cps');
    if (cpsIcon) {
        cpsIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // Redireciona para tela de carregamento passando parâmetro destino=cps
            window.location.href = '../Tela de carregamento/telacarregamento.html?destino=cps';
        });
    }
}

// Aplica o tema escuro ou claro baseado no valor salvo no localStorage
function applyTheme() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Configura o botão para alternar entre tema claro e escuro
function setupThemeToggle() {
    const toggleTheme = document.getElementById('toggleTheme');
    if (toggleTheme) {
        // Ajusta o texto do botão conforme o estado atual
        if (localStorage.getItem('darkMode') === 'enabled') {
            toggleTheme.textContent = 'Tema Claro';
        } else {
            toggleTheme.textContent = 'Tema Escuro';
        }
        
        // Ao clicar no botão, alterna a classe dark-mode no body e atualiza o texto e o localStorage
        toggleTheme.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                this.textContent = 'Tema Claro';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                this.textContent = 'Tema Escuro';
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Exibe o menu para usuário logado com o nome recebido
function showLoggedInMenu(userName) {
    document.getElementById('loginLink').style.display = 'none'; // Oculta botão de login
    const loggedInMenu = document.getElementById('loggedInMenu');
    if (loggedInMenu) {
        loggedInMenu.style.display = 'block'; // Mostra o menu do usuário logado
        document.getElementById('usuarioNome').textContent = `Olá, ${userName}`; // Mostra nome
    }
}

// Exibe o botão/link para login (quando usuário não está logado)
function showLoginButton() {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.style.display = 'inline-block'; // Exibe o botão/link
    }
}

// =============================================
// FUNÇÕES DE LOGOUT
// =============================================

// Função global para logout, chamada pelo botão/sinalizador de logout na interface
window.logout = function() {
    // Salva a preferência do tema antes de limpar dados para não perder a configuração
    const themePreference = localStorage.getItem('darkMode');
    
    // Remove os dados de autenticação armazenados no localStorage e sessionStorage
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userName');
    
    // Restaura a preferência do tema após remover os dados de usuário
    if (themePreference) {
        localStorage.setItem('darkMode', themePreference);
    }
    
    // Chama o logout no servidor via fetch para destruir sessão
    fetch('logout.php')
        .then(() => {
            // Após logout, recarrega a página para refletir estado deslogado
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro no logout:', error);
            // Mesmo com erro, recarrega a página para evitar inconsistência
            window.location.reload();
        });
};
