<?php
session_start();
header('Content-Type: application/json');

// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ctec";

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Erro de conexão com o banco de dados."]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Limpa qualquer sessão anterior
    session_unset();
    
    // Obter dados do corpo da requisição
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $nome = trim($data['nome'] ?? '');
    $senha = trim($data['senha'] ?? '');

    // Validação dos campos
    if (empty($nome) || empty($senha)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Por favor, preencha todos os campos."]);
        exit;
    }

    // Função para verificar credenciais
    function verificarCredenciais($conn, $tabela, $nome, $senha) {
        $stmt = $conn->prepare("SELECT id, nome, senha FROM $tabela WHERE nome = ?");
        $stmt->bind_param("s", $nome);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $usuario = $result->fetch_assoc();
            if (password_verify($senha, $usuario['senha'])) {
                return $usuario;
            }
        }
        return false;
    }

    // Verificar primeiro na tabela de usuários
    $usuario = verificarCredenciais($conn, 'usuarios', $nome, $senha);
    if ($usuario) {
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['nome'] = $usuario['nome'];
        $_SESSION['tipo'] = 'usuario';
        
        echo json_encode([
            "success" => true,
            "message" => "Login realizado com sucesso!",
            "redirect" => "../Tela Inicial/telainicial.html",
            "nome" => $usuario['nome'],
            "tipo" => 'usuario'
        ]);
        exit;
    }

    // Se não encontrou em usuários, verificar em empresas
    $empresa = verificarCredenciais($conn, 'empresas', $nome, $senha);
    if ($empresa) {
        $_SESSION['empresa_id'] = $empresa['id'];
        $_SESSION['empresa_nome'] = $empresa['nome'];
        $_SESSION['tipo'] = 'empresa';
        
        echo json_encode([
            "success" => true,
            "message" => "Login realizado com sucesso!",
            "redirect" => "../Painel de Controle/paineldecontrole.html",
            "nome" => $empresa['nome'],
            "tipo" => 'empresa'
        ]);
        exit;
    }

    // Se não encontrou em nenhuma tabela
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Nome de usuário ou senha incorretos."]);
}

$conn->close();
?>