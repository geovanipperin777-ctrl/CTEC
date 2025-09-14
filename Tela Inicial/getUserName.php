<?php
session_start(); // Inicia a sessão para acessar variáveis de sessão

header('Content-Type: application/json'); // Define o tipo de conteúdo da resposta como JSON

// Verifica se as variáveis de sessão 'email' e 'tipo' estão definidas
// Se não estiverem, retorna JSON com 'nome' null e encerra o script
if (!isset($_SESSION['email']) || !isset($_SESSION['tipo'])) {
    echo json_encode(['nome' => null]);
    exit;
}

require_once('../Tela Vagas/db.php'); // Inclui o arquivo de conexão com o banco de dados

$email = $_SESSION['email']; // Obtém o e-mail do usuário da sessão
$tipo = $_SESSION['tipo'];   // Obtém o tipo do usuário ('usuario' ou 'empresa')

// Prepara a consulta SQL dependendo do tipo de usuário
if ($tipo === 'usuario') {
    $stmt = $conn->prepare("SELECT nome FROM usuarios WHERE email = ?");
} else {
    $stmt = $conn->prepare("SELECT nome FROM empresas WHERE email = ?");
}

// Liga o parâmetro $email na consulta preparada (para evitar SQL Injection)
$stmt->bind_param("s", $email);

// Executa a consulta
$stmt->execute();

// Obtém o resultado da consulta
$result = $stmt->get_result();

// Verifica se a consulta retornou algum resultado
if ($result && $result->num_rows > 0) {
    // Busca o primeiro registro como array associativo
    $row = $result->fetch_assoc();

    // Retorna o nome encontrado em formato JSON
    echo json_encode(['nome' => $row['nome']]);
} else {
    // Caso não encontre nenhum registro, retorna nome nulo
    echo json_encode(['nome' => null]);
}

// Fecha a consulta e a conexão com o banco de dados
$stmt->close();
$conn->close();
?>
