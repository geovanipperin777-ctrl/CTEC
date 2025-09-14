<?php
// Define o tipo de retorno como JSON
header('Content-Type: application/json');

// Configurações do banco de dados e diretório de uploads
$config = [
    'servername' => "localhost",
    'username' => "root",
    'password' => "",
    'dbname' => "ctec",
    'uploads_dir' => "../Tela Vagas/uploads/"
];

try {
    // Verifica se o método HTTP é POST
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        throw new Exception("Método não permitido", 405);
    }

    // Armazena os dados enviados pelo formulário
    $dados = $_POST;

    // Campos obrigatórios
    $requiredFields = ['nome', 'email', 'senha', 'cnpj', 'cep', 'endereco', 'bairro', 'telefone'];
    $missingFields = [];

    // Verifica se todos os campos obrigatórios estão preenchidos
    foreach ($requiredFields as $field) {
        if (empty($dados[$field])) $missingFields[] = $field;
    }

    // Se algum campo estiver faltando, retorna erro
    if (!empty($missingFields)) {
        throw new Exception("Campos obrigatórios faltando: " . implode(', ', $missingFields), 400);
    }

    // Valida formato do email
    if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Formato de email inválido", 400);
    }

    // Remove caracteres não numéricos do CNPJ e valida tamanho
    $cleanCnpj = preg_replace('/\D/', '', $dados['cnpj']);
    if (strlen($cleanCnpj) != 14) throw new Exception("CNPJ deve conter 14 dígitos", 400);

    // Remove caracteres não numéricos do CEP e valida tamanho
    $cleanCep = preg_replace('/\D/', '', $dados['cep']);
    if (strlen($cleanCep) != 8) throw new Exception("CEP deve conter 8 dígitos", 400);

    // Remove caracteres não numéricos do telefone e valida tamanho
    $cleanTelefone = preg_replace('/\D/', '', $dados['telefone']);
    if (strlen($cleanTelefone) < 10) throw new Exception("Telefone deve conter pelo menos 10 dígitos", 400);

    // Verifica se a senha possui no mínimo 6 caracteres
    if (strlen($dados['senha']) < 6) throw new Exception("Senha deve ter pelo menos 6 caracteres", 400);

    // Conecta ao banco de dados
    $conn = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);
    if ($conn->connect_error) throw new Exception("Erro de conexão com o banco: " . $conn->connect_error, 500);

    // Verifica se o email já está cadastrado
    $checkEmail = $conn->prepare("SELECT id FROM empresas WHERE email = ?");
    $checkEmail->bind_param("s", $dados['email']);
    $checkEmail->execute();
    if ($checkEmail->get_result()->num_rows > 0) throw new Exception("Este email já está cadastrado", 409);
    $checkEmail->close();

    // Verifica se o CNPJ já está cadastrado
    $checkCnpj = $conn->prepare("SELECT id FROM empresas WHERE cnpj = ?");
    $checkCnpj->bind_param("s", $cleanCnpj);
    $checkCnpj->execute();
    if ($checkCnpj->get_result()->num_rows > 0) throw new Exception("Este CNPJ já está cadastrado", 409);
    $checkCnpj->close();

    // Insere os dados no banco de dados
    $insertStmt = $conn->prepare("INSERT INTO empresas (nome, email, senha, cnpj, cep, endereco, bairro, telefone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $hashedPassword = password_hash($dados['senha'], PASSWORD_DEFAULT); // Criptografa a senha
    $insertStmt->bind_param("ssssssss", $dados['nome'], $dados['email'], $hashedPassword, $cleanCnpj, $cleanCep, $dados['endereco'], $dados['bairro'], $cleanTelefone);

    if (!$insertStmt->execute()) throw new Exception($insertStmt->error, 500);

    $empresaId = $insertStmt->insert_id; // Pega o ID da empresa recém cadastrada
    $insertStmt->close();

    // Cria uma pasta para a empresa, se ainda não existir
    $pastaEmpresa = $config['uploads_dir'] . preg_replace('/[^a-zA-Z0-9]/', '_', $dados['nome']);
    if (!file_exists($pastaEmpresa)) mkdir($pastaEmpresa, 0755, true);

    // Inicia a sessão e armazena os dados da empresa
    session_start();
    $_SESSION['empresa_id'] = $empresaId;
    $_SESSION['empresa_nome'] = $dados['nome'];

    // Retorna resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Cadastro realizado com sucesso!',
        'empresa_id' => $empresaId,
        'empresa_nome' => $dados['nome']
    ]);

} catch (Exception $e) {
    // Retorna erro com código HTTP apropriado
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'code' => $e->getCode() ?: 500
    ]);
} finally {
    // Encerra a conexão com o banco de dados
    if (isset($conn)) $conn->close();
}
