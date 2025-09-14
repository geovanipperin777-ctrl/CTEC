<?php
session_start(); // Inicia a sessão para permitir manipulação da sessão atual

// Limpa todas as variáveis de sessão
$_SESSION = array();

// Verifica se a sessão utiliza cookies (geralmente sim)
if (ini_get("session.use_cookies")) {
    // Obtém os parâmetros atuais do cookie de sessão
    $params = session_get_cookie_params();

    // Define o cookie da sessão com tempo expirado para removê-lo do navegador
    setcookie(session_name(), '', time() - 42000,
        $params["path"],       // Mesma path do cookie original
        $params["domain"],     // Mesmo domínio do cookie original
        $params["secure"],     // Mesma flag de segurança (HTTPS) do cookie original
        $params["httponly"]    // Mesma flag httponly do cookie original
    );
}

// Destrói a sessão atual no servidor
session_destroy();

// Retorna uma resposta JSON confirmando o logout/sessão destruída
echo json_encode(['status' => 'ok']);
?>
