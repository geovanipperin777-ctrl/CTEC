<?php
session_start(); // Inicia a sessão para acessar variáveis de sessão

// Verifica se o usuário está logado como empresa (sessão válida)
if (!isset($_SESSION['empresa_id'])) {
    // Se não estiver logado, retorna erro 403 Forbidden e finaliza
    header("HTTP/1.1 403 Forbidden");
    exit("Acesso negado.");
}

// Verifica se os parâmetros 'file' e 'empresa' foram enviados via GET
if (empty($_GET['file']) || empty($_GET['empresa'])) {
    // Se faltar algum parâmetro, retorna erro 400 Bad Request e finaliza
    header("HTTP/1.1 400 Bad Request");
    exit("Parâmetros inválidos.");
}

// Sanitiza o nome do arquivo, removendo possíveis diretórios e caracteres perigosos
$nomeArquivo = basename($_GET['file']);

// Sanitiza o nome da empresa para conter apenas letras, números e underline
$nomeEmpresa = preg_replace('/[^a-zA-Z0-9]/', '_', $_GET['empresa']);

// Define o caminho base seguro onde os arquivos estão armazenados para aquela empresa
$diretorioBase = __DIR__ . '/../Tela Vagas/uploads/' . $nomeEmpresa . '/';

// Obtém o caminho real absoluto do arquivo solicitado
$caminhoCompleto = realpath($diretorioBase . $nomeArquivo);

// Verifica se o arquivo existe e se está dentro do diretório permitido (evita path traversal)
if (!$caminhoCompleto || strpos($caminhoCompleto, realpath($diretorioBase)) !== 0) {
    // Se o arquivo não existir ou estiver fora do diretório, retorna 404 Not Found
    header("HTTP/1.1 404 Not Found");
    exit("Arquivo não encontrado.");
}

// Verifica se o caminho é realmente um arquivo (não diretório)
if (!is_file($caminhoCompleto)) {
    // Se não for arquivo válido, retorna 404 Not Found
    header("HTTP/1.1 404 Not Found");
    exit("Arquivo inválido.");
}

// Obtém a extensão do arquivo em letras minúsculas
$extensao = strtolower(pathinfo($caminhoCompleto, PATHINFO_EXTENSION));

// Define quais extensões de arquivo são permitidas para download
$extensoesPermitidas = ['pdf', 'doc', 'docx', 'txt'];

// Verifica se a extensão do arquivo está entre as permitidas
if (!in_array($extensao, $extensoesPermitidas)) {
    // Se não permitida, retorna erro 403 Forbidden
    header("HTTP/1.1 403 Forbidden");
    exit("Tipo de arquivo não permitido.");
}

// Extrai o nome original para usar no download, removendo prefixos adicionados
$info = pathinfo($nomeArquivo);
$partesNome = explode('_', $info['filename'], 3); // Divide em até 3 partes

// Se o nome tem pelo menos 3 partes, usa a terceira parte como nome original + extensão
// Caso contrário, usa o nome original do arquivo
$nomeDownload = count($partesNome) >= 3 ? $partesNome[2] . '.' . $extensao : $nomeArquivo;

// Define os headers HTTP para forçar o download do arquivo no navegador
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $nomeDownload . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($caminhoCompleto));

// Lê e envia o conteúdo do arquivo para o cliente
readfile($caminhoCompleto);
exit; // Finaliza o script
?>
