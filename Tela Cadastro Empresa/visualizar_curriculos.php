<?php
session_start();

if (!isset($_SESSION['empresa_id'])) {
    header("Location: ../Tela de Login/telaLogin.html");
    exit;
}

// Configuração do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ctec";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }

    // Busca o nome da empresa
    $stmt = $conn->prepare("SELECT nome FROM empresas WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['empresa_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $empresa = $result->fetch_assoc();
    
    if (!$empresa) {
        throw new Exception("Empresa não encontrada");
    }

    // Prepara o nome da pasta (substitui caracteres especiais por _)
    $pastaEmpresa = "../Tela Vagas/uploads/" . preg_replace('/[^a-zA-Z0-9]/', '_', $empresa['nome']);

} catch (Exception $e) {
    die("Erro: " . $e->getMessage());
} finally {
    if (isset($conn)) $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Currículos Recebidos - <?php echo htmlspecialchars($empresa['nome']); ?></title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .envoltorio-principal {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .lista-curriculos {
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
            justify-content: center;
        }
        .cartao-curriculo {
            background: #fafafa;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            width: 320px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s ease;
        }
        .cartao-curriculo:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .nome-arquivo {
            font-size: 18px;
            font-weight: bold;
            color: #222;
            margin-bottom: 15px;
            word-break: break-word;
        }
        .info-arquivo {
            font-size: 14px;
            color: #555;
            margin-bottom: 20px;
        }
        .botao-download {
            background-color: #2196F3;
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 16px;
            padding: 12px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            text-align: center;
            text-decoration: none;
            display: block;
        }
        .botao-download:hover {
            background-color: #0b7dda;
        }
        @media (max-width: 768px) {
            .lista-curriculos {
                flex-direction: column;
                align-items: center;
            }
            .cartao-curriculo {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="envoltorio-principal">
        <h1>Currículos Recebidos - <?php echo htmlspecialchars($empresa['nome']); ?></h1>
        <div class="lista-curriculos">
        <?php
        if (is_dir($pastaEmpresa)) {
            $arquivos = array_diff(scandir($pastaEmpresa), ['.', '..']);
            
            if (empty($arquivos)) {
                echo "<p>Nenhum currículo recebido ainda.</p>";
            } else {
                foreach ($arquivos as $arquivo) {
                    $caminho = $pastaEmpresa . '/' . $arquivo;
                    $info = pathinfo($caminho);
                    
                    echo '<div class="cartao-curriculo">';
                    echo '<div class="nome-arquivo">' . htmlspecialchars($info['filename']) . '</div>';
                    echo '<div class="info-arquivo">';
                    echo 'Enviado em: ' . date('d/m/Y H:i', filemtime($caminho));
                    echo '</div>';
                    echo '<a href="' . htmlspecialchars(str_replace('../', '', $caminho)) . '" download class="botao-download">Download</a>';
                    echo '</div>';
                }
            }
        } else {
            echo "<p>Nenhum currículo recebido ainda.</p>";
        }
        ?>
        </div>
    </div>
</body>
</html>