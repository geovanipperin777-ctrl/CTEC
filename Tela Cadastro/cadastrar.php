<?php
// Define o tipo de conteúdo retornado como JSON
header('Content-Type: application/json');

// -------------------------------------
// Configurações de conexão com o banco
// -------------------------------------
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ctec";

// Cria conexão com o banco de dados usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se ocorreu erro na conexão e encerra o script com mensagem JSON
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Erro ao conectar ao banco de dados. Tente novamente mais tarde."
    ]));
}

// Define o charset para UTF-8 para suportar acentuação
$conn->set_charset("utf8");

// -------------------------------------
// Verifica se a requisição é do tipo POST
// -------------------------------------
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Tenta ler os dados enviados como JSON bruto
    $data = json_decode(file_get_contents('php://input'), true);

    // Se não conseguiu ler o JSON, tenta pegar dados do POST tradicional
    if (!$data) {
        $data = $_POST;
    }

    // -------------------------------------
    // Sanitização e formatação dos dados recebidos
    // -------------------------------------
    $nome = trim($conn->real_escape_string($data['nome']));
    $email = trim($conn->real_escape_string($data['email']));
    $telefone = preg_replace('/\D/', '', trim($data['telefone'])); // Remove tudo que não for número
    $senha = trim($data['senha']);

    // -------------------------------------
    // Validação dos campos obrigatórios
    // -------------------------------------
    if (empty($nome) || empty($email) || empty($telefone) || empty($senha)) {
        echo json_encode([
            "success" => false,
            "message" => "Todos os campos são obrigatórios."
        ]);
        exit;
    }

    // Validação do número de telefone (deve ter 10 ou 11 dígitos)
    if (strlen($telefone) < 10 || strlen($telefone) > 11) {
        echo json_encode([
            "success" => false,
            "message" => "Telefone inválido. Digite DDD + número (10 ou 11 dígitos)."
        ]);
        exit;
    }

    // Validação do formato do email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Formato de email inválido."
        ]);
        exit;
    }

    // -------------------------------------
    // Verifica se o email já está cadastrado
    // -------------------------------------
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Este email já está cadastrado."
        ]);
        exit;
    }

    // -------------------------------------
    // Criptografa a senha usando hash seguro
    // -------------------------------------
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // -------------------------------------
    // Insere os dados do novo usuário no banco de dados
    // -------------------------------------
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $email, $telefone, $senhaHash);

    // Verifica se o cadastro foi realizado com sucesso
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Cadastro concluído com sucesso!",
            "redirect" => "../Tela inicial/telainicial.html" // Redirecionamento após cadastro
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao processar cadastro: " . $conn->error
        ]);
    }
} else {
    // Caso a requisição não seja POST, retorna erro
    echo json_encode([
        "success" => false,
        "message" => "Método de requisição inválido."
    ]);
}

// Encerra a conexão com o banco
$conn->close();
?>
