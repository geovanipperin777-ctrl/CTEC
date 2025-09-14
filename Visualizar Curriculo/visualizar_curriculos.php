<?php
session_start(); // Inicia a sessão para acessar variáveis de sessão

// Verifica se o usuário está logado como empresa (sessão válida)
if (!isset($_SESSION['empresa_id'])) {
    // Se não estiver logado, redireciona para a página de login
    header("Location: ../Tela de Login/telaLogin.html");
    exit;
}

// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ctec";

try {
    // Cria conexão com o banco usando mysqli
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verifica erros na conexão
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }

    // Prepara a consulta para buscar o nome da empresa com base no id da sessão
    $consulta = $conn->prepare("SELECT nome FROM empresas WHERE id = ?");
    $consulta->bind_param("i", $_SESSION['empresa_id']); // Bind do parâmetro id (inteiro)
    $consulta->execute(); // Executa a consulta
    $resultado = $consulta->get_result(); // Obtém resultado
    $empresa = $resultado->fetch_assoc(); // Busca o resultado em array associativo
    
    // Se a empresa não for encontrada no banco, lança exceção
    if (!$empresa) {
        throw new Exception("Empresa não encontrada");
    }

    // Prepara o caminho da pasta onde os currículos são armazenados, sanitizando o nome da empresa
    $pastaEmpresa = __DIR__ . "/../Tela Vagas/uploads/" . preg_replace('/[^a-zA-Z0-9]/', '_', $empresa['nome']);

} catch (Exception $erro) {
    // Em caso de erro, exibe a mensagem e encerra a execução
    die("Erro: " . $erro->getMessage());
} finally {
    // Fecha a conexão com o banco, se aberta
    if (isset($conn)) $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8"> <!-- Define o charset da página -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsividade -->
    <title>Currículos Recebidos - <?php echo htmlspecialchars($empresa['nome']); ?></title> <!-- Título dinâmico -->
    <link rel="stylesheet" href="visualizarcurriculo.css"> <!-- CSS personalizado -->
    <link rel="icon" type="image/x-icon" href="../img/logobranco.png"> <!-- Ícone da aba -->
    <!-- Link para ícones Font Awesome para usar a seta do botão voltar -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Cabeçalho da página com logo e título -->
    <header class="cabecalho">
        <img src="../img/logobranco.png" alt="Logo CTEC">
        <h1>CTEC - Currículo Técnico Educacional</h1>
    </header>

    <!-- Botão para voltar ao painel de controle, com ícone -->
    <div class="container-voltar">
        <a href="../Painel de Controle/paineldecontrole.html" class="botao-voltar">
            <i class="fas fa-arrow-left"></i> Voltar ao Painel
        </a>
    </div>

    <!-- Conteúdo principal -->
    <main class="container-principal">
        <!-- Título da página com o nome da empresa -->
        <h1 class="titulo-pagina">Currículos Recebidos - <?php echo htmlspecialchars($empresa['nome']); ?></h1>
        
        <!-- Área onde serão listados os currículos recebidos -->
        <div class="lista-curriculos">
            <?php
            // Verifica se a pasta da empresa existe
            if (is_dir($pastaEmpresa)) {
                // Lê todos os arquivos da pasta, ignorando '.' e '..'
                $arquivos = array_diff(scandir($pastaEmpresa), ['.', '..']);
                
                // Se não houver arquivos, exibe mensagem de nenhum currículo recebido
                if (empty($arquivos)) {
                    echo "<p class='sem-curriculos'>Nenhum currículo recebido ainda.</p>";
                } else {
                    // Para cada arquivo encontrado na pasta
                    foreach ($arquivos as $arquivo) {
                        $caminhoCompleto = realpath($pastaEmpresa . '/' . $arquivo); // Caminho absoluto
                        if (!is_file($caminhoCompleto)) continue; // Pula se não for arquivo regular
                        
                        // Extrai informações do arquivo (nome, extensão)
                        $info = pathinfo($arquivo);
                        $extensao = strtolower($info['extension'] ?? '');
                        
                        // Define as extensões permitidas para mostrar
                        $extensoesPermitidas = ['pdf', 'doc', 'docx', 'txt'];
                        
                        // Pula arquivos com extensões não permitidas
                        if (!in_array($extensao, $extensoesPermitidas)) continue;
                        
                        // Formata o nome para exibição, removendo prefixos (ex: IDs ou datas)
                        $partesNome = explode('_', $info['filename'], 3);
                        $nomeExibicao = count($partesNome) >= 3 ? $partesNome[2] : $info['filename'];
                        
                        // Exibe o "cartão" do currículo com nome, data de envio e botão de download
                        echo '<div class="cartao-curriculo">';
                        echo '<div class="nome-curriculo">' . htmlspecialchars($nomeExibicao) . '.' . $extensao . '</div>';
                        echo '<div class="info-curriculo">Enviado em: ' . date('d/m/Y H:i', filemtime($caminhoCompleto)) . '</div>';
                        echo '<a href="download_curriculo.php?file=' . urlencode($arquivo) . '&empresa=' . urlencode($empresa['nome']) . '" class="botao-download">Download</a>';
                        echo '</div>';
                    }
                }
            } else {
                // Se a pasta da empresa não existir, também exibe que não há currículos
                echo "<p class='sem-curriculos'>Nenhum currículo recebido ainda.</p>";
            }
            ?>
        </div>
    </main>
</body>
</html>
