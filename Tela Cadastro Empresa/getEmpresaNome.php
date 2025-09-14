<?php
// Define que a resposta será no formato JSON
header('Content-Type: application/json');

// Inicia a sessão para acessar variáveis de sessão
session_start();

// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ctec";

// Verifica se a empresa está autenticada pela sessão
if (!isset($_SESSION['empresa_id'])) {
    http_response_code(401); // Código HTTP 401 = Não autorizado
    echo json_encode([
        'success' => false,
        'error' => 'Não autenticado'
    ]);
    exit; // Encerra a execução
}

try {
    // Cria a conexão com o banco
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica se houve erro na conexão
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }

    // Prepara a consulta SQL para obter o nome da empresa a partir do ID da sessão
    $stmt = $conn->prepare("SELECT nome FROM empresas WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['empresa_id']);
    $stmt->execute();

    // Obtém o resultado da consulta
    $result = $stmt->get_result();

    // Verifica se encontrou a empresa
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc(); // Pega o nome
        echo json_encode([
            'success' => true,
            'nome' => $row['nome'] // Retorna o nome da empresa
        ]);
    } else {
        // Empresa não encontrada no banco
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Empresa não encontrada'
        ]);
    }

} catch (Exception $e) {
    // Erro interno do servidor
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

} finally {
    // Encerra os objetos utilizados
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
