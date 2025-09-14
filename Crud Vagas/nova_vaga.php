<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="imagem/png" href="img/logobranco.png">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Repertório Vagas - CTEC</title>
    <link rel="stylesheet" href="nova_vaga.css">
</head>
<body>

    <!-- Cabeçalho -->
    <div class="cabecalho">
        <img src="../img/logobranco.png">
        <h1>CTEC - Currículo Técnico Educacional</h1>
    </div>

    <!-- Alerta de inclusão de vaga -->
    <?php if (isset($_GET['inclusao']) && $_GET['inclusao'] == 1) { ?>
        <div class="alerta">
            <h5>Vaga inserida com sucesso!</h5>
        </div>
    <?php } ?>

    <!-- Menu de navegação -->
    <div class="menu">
        <ul>
            <li><a href="../Painel de Controle/paineldecontrole.html">Painel de Controle</a></li>
        </ul>
    </div>

    <!-- Formulário de nova vaga -->
    <div class="container-formulario">
        <h4 class="titulo-formulario">Nova Vaga</h4>
        <hr class="divisor-formulario">
        <form method="POST" action="vaga_controller.php?acao=inserir" onsubmit="return validarFormulario()">

            <!-- Primeira linha -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Empresa contratante:</label>
                    <input name="empresa" type="text" required placeholder="Exemplo: Tech Solutions Ltda">
                </div>
                <div class="grupo-campo">
                    <label>Nome da Vaga:</label>
                    <input name="vaga" type="text" required placeholder="Exemplo: Desenvolvedor Web">
                </div>
            </div>

            <!-- Segunda linha -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Telefone para contato:</label>
                    <input name="telefone" id="telefone" type="text" placeholder="Caso não deseja contato - Deixar nulo">
                    <div id="telefone-error" class="mensagem-erro">O telefone deve ter entre 10 e 11 dígitos (sem contar caracteres especiais).</div>
                </div>
                <div class="grupo-campo">
                    <label>E-mail para contato:</label>
                    <input name="contato" type="email" placeholder="Caso não deseja contato - Deixar nulo">
                </div>
            </div>

            <!-- Terceira linha -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Quantidade de Vagas:</label>
                    <input name="quantidade" type="number" placeholder="Exemplo: 20">
                </div>
                <div class="grupo-campo">
                    <label>Área da Vaga:</label>
                    <input name="area" type="text" placeholder="Exemplo: Contabilidade">
                </div>
            </div>

            <!-- Quarta linha -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Carga horária diária:</label>
                    <input name="horario" type="text" placeholder="Exemplo: 8 horas">
                </div>
                <div class="grupo-campo">
                    <label>Escala semanal:</label>
                    <input name="escala" type="text" placeholder="Exemplo: Segunda a Sexta">
                </div>
            </div>

            <!-- Quinta linha -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Local de trabalho:</label>
                    <input name="local" type="text" placeholder="Exemplo: São Paulo - SP ou Remoto">
                </div>
                <div class="grupo-campo">
                    <label>CNPJ (opcional):</label>
                    <input name="cnpj" id="cnpj" type="text" placeholder="Exemplo: 00.000.000/0000-00">
                    <div id="cnpj-error" class="mensagem-erro">O CNPJ deve ter exatamente 14 dígitos (sem contar caracteres especiais).</div>
                </div>
            </div>

            <!-- Sexta linha - Vale alimentação e transporte -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Oferece Vale Alimentação?</label>
                    <div class="opcoes-sim-nao">
                        <label>
                            <input type="radio" name="vale_alimentacao" value="sim" checked> Sim
                        </label>
                        <label>
                            <input type="radio" name="vale_alimentacao" value="nao"> Não
                        </label>
                    </div>
                </div>
                <div class="grupo-campo">
                    <label>Oferece Vale Transporte?</label>
                    <div class="opcoes-sim-nao">
                        <label>
                            <input type="radio" name="vale_transporte" value="sim" checked> Sim
                        </label>
                        <label>
                            <input type="radio" name="vale_transporte" value="nao"> Não
                        </label>
                    </div>
                </div>
            </div>

            <!-- Sétima linha - Requisitos e benefícios -->
            <div class="linha-formulario">
                <div class="grupo-campo">
                    <label>Requisitos:</label>
                    <textarea name="requisitos" placeholder="Descreva os requisitos para a vaga"></textarea>
                </div>
                <div class="grupo-campo">
                    <label>Benefícios (opcional):</label>
                    <textarea name="beneficios" placeholder="Descreva outros benefícios oferecidos"></textarea>
                </div>
            </div>

            <!-- Botão de envio -->
            <div class="container-botao">
                <button type="submit" class="botao">Criar Vaga</button>
            </div>
        </form>
    </div>

    <script src="nova_vaga.js"></script>
</body>
</html>
