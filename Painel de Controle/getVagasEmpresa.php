<?php
// Inicia a sessão para acessar variáveis de sessão (como o ID da empresa logada)
session_start();

// Define o tipo de retorno da resposta como JSON
header('Content-Type: application/json');

// -------------------------------
// Configurações do banco de dados
// -------------------------------
$servername = "localhost"; // Nome do servidor (localhost = máquina local)
$username = "root";        // Nome de usuário do banco de dados
$password = "";            // Senha do banco (em branco, no caso)
$dbname = "ctec";          // Nome do banco de dados

// -------------------------------
// Verifica se a empresa está autenticada
// -------------------------------
if (!isset($_SESSION['empresa_id'])) {
    // Se não houver empresa logada, retorna erro 401 (não autorizado)
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Não autenticado'
    ]);
    exit; // Encerra a execução do script
}

try {
    // -------------------------------
    // Tenta conectar ao banco de dados
    // -------------------------------
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica se houve erro na conexão
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }

    // -------------------------------
    // Busca as vagas da empresa logada
    // -------------------------------
    $empresaId = $_SESSION['empresa_id']; // Obtém o ID da empresa da sessão

    // Prepara a consulta SQL com parâmetro para evitar SQL Injection
    $stmt = $conn->prepare("
        SELECT 
            id, vaga, quantidade, area, horario, requisitos, local, 
            contato, telefone, cnpj, escala, vale_alimentacao, 
            vale_transporte, beneficios, data_cadastro 
        FROM vagas 
        WHERE empresa_id = ?
    ");

    // Associa o parâmetro (empresa_id) ao statement
    $stmt->bind_param("i", $empresaId); // "i" indica que o parâmetro é um número inteiro

    // Executa a consulta
    $stmt->execute();

    // Obtém os resultados da consulta
    $result = $stmt->get_result();

    // Array que armazenará todas as vagas retornadas
    $vagas = [];

    // Percorre os resultados e armazena cada vaga no array
    while ($row = $result->fetch_assoc()) {
        $vagas[] = $row;
    }

    // Retorna as vagas em formato JSON com sucesso
    echo json_encode([
        'success' => true,
        'vagas' => $vagas
    ]);
} catch (Exception $e) {
    // Caso ocorra algum erro, retorna erro 500 (erro interno do servidor)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    // Fecha o statement e a conexão com o banco, se existirem
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
