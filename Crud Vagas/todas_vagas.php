<?php
// Inicia a sessão para verificar se a empresa está logada
session_start();

// Verificação de autenticação - redireciona se não estiver logado
if (!isset($_SESSION['empresa_nome'])) {
    header("Location: ../Tela Login/telaLogin.html");
    exit;
}

// Armazena o nome da empresa da sessão para uso nas consultas
$nomeEmpresa = $_SESSION['empresa_nome'];

// Configurações de conexão com o banco de dados
$servidor = "localhost";
$usuario = "root";
$senha = "";
$bancoDados = "ctec";

try {
    // Estabelece conexão com o MySQL usando MySQLi
    $conexao = new mysqli($servidor, $usuario, $senha, $bancoDados);

    // Verifica erros na conexão
    if ($conexao->connect_error) {
        throw new Exception("Falha na conexão: " . $conexao->connect_error);
    }

    // Prepara a consulta SQL para buscar vagas da empresa, ordenadas por ID decrescente
    $sql = "SELECT * FROM vagas WHERE empresa = ? ORDER BY id DESC";
    $comando = $conexao->prepare($sql);

    // Verifica erros na preparação da consulta
    if (!$comando) {
        throw new Exception("Erro ao preparar consulta: " . $conexao->error);
    }
    
    // Associa o parâmetro (nome da empresa) ao comando preparado
    $comando->bind_param("s", $nomeEmpresa);

    // Executa a consulta preparada
    if (!$comando->execute()) {
        throw new Exception("Erro na execução: " . $comando->error);
    }
    
    // Obtém o resultado da consulta
    $resultado = $comando->get_result();

    // Armazena todas as vagas em um array de objetos
    $vagas = [];
    while ($linha = $resultado->fetch_object()) {
        $vagas[] = $linha;
    }

    // Fecha o comando e a conexão
    $comando->close();
    $conexao->close();

} catch (Exception $erro) {
    // Tratamento de erros - exibe mensagem e encerra
    die("Erro no sistema: " . $erro->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Título dinâmico com nome da empresa -->
    <title>Minhas Vagas - <?= htmlspecialchars($nomeEmpresa) ?></title>
    <link rel="icon" type="imagem/png" href="img/logobranco.png" />
    <!-- Arquivo CSS com estilos -->
    <link rel="stylesheet" href="todas_vagas.css" />
</head>
<body>
    <!-- Cabeçalho com logo e título do sistema -->
    <header class="cabecalho">
        <img src="img/logobranco.png" alt="Logo CTEC" />
        <h1>CTEC - Currículo Técnico Educacional</h1>
    </header>

    <!-- Seção de mensagens de sucesso -->
    <?php if (isset($_GET['sucesso'])): ?>
        <div class="mensagem-sucesso">
            <?php
            // Exibe mensagens conforme código recebido
            switch ($_GET['sucesso']) {
                case 1: echo "Vaga cadastrada com sucesso!"; break;
                case 2: echo "Vaga atualizada com sucesso!"; break;
                case 3: echo "Vaga excluída com sucesso!"; break;
            }
            ?>
        </div>
    <?php endif; ?>

    <!-- Conteúdo principal -->
    <main class="conteiner-principal">
        <!-- Botões de ação -->
        <div class="container-botoes">
            <a href="../Painel de Controle/paineldecontrole.html" class="botao-painel">Painel de Controle</a>
        </div>

        <!-- Título da seção -->
        <h2>Minhas Vagas Disponíveis</h2>

        <!-- Tabela de vagas -->
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Vaga</th>
                    <th>Empresa</th>
                    <th>Quantidade</th>
                    <th>Área</th>
                    <th>Status</th>
                    <th>Contato</th>
                    <th>Telefone</th>
                    <th>Benefícios</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <!-- Verifica se existem vagas -->
                <?php if (!empty($vagas)): ?>
                    <!-- Loop através de cada vaga -->
                    <?php foreach ($vagas as $vaga): ?>
                    <tr>
                        <!-- Coluna ID -->
                        <td><?= $vaga->id ?></td>

                        <!-- Coluna com detalhes da vaga -->
                        <td>
                            <strong><?= htmlspecialchars($vaga->vaga ?? '') ?></strong><br />
                            <small>Local: <?= htmlspecialchars($vaga->local ?? 'Não informado') ?></small><br />
                            <small>Horário: <?= htmlspecialchars($vaga->horario ?? 'Não informado') ?></small>
                        </td>

                        <!-- Coluna com informações da empresa -->
                        <td>
                            <?= htmlspecialchars($vaga->empresa ?? '') ?>
                            <?php if (!empty($vaga->cnpj)): ?>
                                <br /><small>CNPJ: <?= htmlspecialchars($vaga->cnpj) ?></small>
                            <?php endif; ?>
                        </td>

                        <!-- Coluna quantidade de vagas -->
                        <td><?= htmlspecialchars($vaga->quantidade ?? '0') ?></td>

                        <!-- Coluna área de atuação -->
                        <td><?= htmlspecialchars($vaga->area ?? 'Não informada') ?></td>

                        <!-- Coluna status (ativa/inativa) -->
                        <td>
                            <div class="botoes-status">
                                <!-- Botão para status ativo -->
                                <button class="botao-status <?= ($vaga->ativa ?? true) ? 'ativo' : '' ?>" 
                                        data-id-vaga="<?= $vaga->id ?>" 
                                        data-status="1">
                                    Ativa
                                </button>
                                <!-- Botão para status inativo -->
                                <button class="botao-status <?= !($vaga->ativa ?? true) ? 'ativo' : '' ?>" 
                                        data-id-vaga="<?= $vaga->id ?>" 
                                        data-status="0">
                                    Inativa
                                </button>
                            </div>
                        </td>

                        <!-- Coluna contato -->
                        <td>
                            <?= !empty($vaga->contato) ? htmlspecialchars($vaga->contato) : '<span class="texto-claro">Não informado</span>' ?>
                        </td>

                        <!-- Coluna telefone -->
                        <td>
                            <?= !empty($vaga->telefone) ? htmlspecialchars($vaga->telefone) : '<span class="texto-claro">Não informado</span>' ?>
                        </td>

                        <!-- Coluna benefícios -->
                        <td>
                            <span class="badge <?= (!empty($vaga->vale_alimentacao) && $vaga->vale_alimentacao == 'sim') ? 'badge-sim' : 'badge-nao' ?>">
                                VA: <?= (!empty($vaga->vale_alimentacao) && $vaga->vale_alimentacao == 'sim') ? 'SIM' : 'NÃO' ?>
                            </span>
                            <span class="badge <?= (!empty($vaga->vale_transporte) && $vaga->vale_transporte == 'sim') ? 'badge-sim' : 'badge-nao' ?>">
                                VT: <?= (!empty($vaga->vale_transporte) && $vaga->vale_transporte == 'sim') ? 'SIM' : 'NÃO' ?>
                            </span>
                            <?php if (!empty($vaga->beneficios)): ?>
                                <br /><small><?= htmlspecialchars(substr($vaga->beneficios, 0, 50)) ?>...</small>
                            <?php endif; ?>
                        </td>

                        <!-- Coluna com ações (editar/excluir) -->
                        <td class="acoes">
                            <a href="vaga_controller.php?acao=editar&id=<?= $vaga->id ?>">Editar</a>
                            <a href="vaga_controller.php?acao=remover&id=<?= $vaga->id ?>" 
                               onclick="return confirm('Confirmar exclusão desta vaga?')">Excluir</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <!-- Mensagem quando não há vagas -->
                    <tr>
                        <td colspan="10" style="text-align: center;">Nenhuma vaga cadastrada</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>

    <!-- Script para controle de status via AJAX -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Seleciona todos os botões de status
            const botoesStatus = document.querySelectorAll('.botao-status');
            
            // Adiciona evento de clique a cada botão
            botoesStatus.forEach(botao => {
                botao.addEventListener('click', async function() {
                    const idVaga = this.getAttribute('data-id-vaga');
                    const novoStatus = this.getAttribute('data-status');
                    
                    // Ignora se o botão já está ativo
                    if (this.classList.contains('ativo')) return;
                    
                    try {
                        // Faz requisição para atualizar status
                        const resposta = await fetch('vaga_controller.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: `acao=atualizarStatus&id=${idVaga}&ativa=${novoStatus}`
                        });
                        
                        // Verifica se a resposta foi bem-sucedida
                        if (!resposta.ok) {
                            throw new Error('Erro na requisição: ' + resposta.status);
                        }
                        
                        // Processa a resposta JSON
                        const dados = await resposta.json();
                        
                        // Atualiza a interface se a operação foi bem-sucedida
                        if (dados.success) {
                            const divPai = this.parentElement;
                            divPai.querySelectorAll('.botao-status').forEach(bot => {
                                bot.classList.remove('ativo');
                            });
                            this.classList.add('ativo');
                        } else {
                            throw new Error(dados.message || 'Falha ao atualizar');
                        }
                    } catch (erro) {
                        console.error('Erro:', erro);
                        alert(erro.message);
                    }
                });
            });
        });
    </script>
</body>
</html>