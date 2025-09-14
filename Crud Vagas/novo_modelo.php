<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="imagem/png" href="img/logobranco.png">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Repertorio Vagas - CTEC</title>
    <link rel="stylesheet" href="novo_modelo.css">
</head>
<body>
    <div class="header">
        <img src="img/logobranco.png">
        <h1>CTEC - Currículo Técnico Educacional</h1>
    </div>

    <?php if (isset($_GET['inclusao']) && $_GET['inclusao'] == 1) { ?>
        <div class="alert">
            <h5>Vaga inserida com sucesso!</h5>
        </div>
    <?php } ?>

    <div class="menu">
        <ul>
            <li><a href="../Painel de Controle/paineldecontrole.html">Painel de Controle</a></li>
        </ul>
    </div>

    <div class="form-container">
        <h4 class="form-title">Nova Vaga</h4>
        <hr class="form-divider">
        <form method="POST" action="vaga_controller.php?acao=inserir" onsubmit="return validarFormulario()">
            <div class="form-row">
                <!-- Primeira linha - 2 campos -->
                <div class="form-group">
                    <label>Empresa contratante:</label>
                    <input name="empresa" type="text" required placeholder="Exemplo: Tech Solutions Ltda">
                </div>
                <div class="form-group">
                    <label>Nome da Vaga:</label>
                    <input name="vaga" type="text" required placeholder="Exemplo: Desenvolvedor Web">
                </div>
            </div>

            <div class="form-row">
                <!-- Segunda linha - 2 campos -->
                <div class="form-group">
                    <label>Telefone para contato:</label>
                    <input name="telefone" id="telefone" type="text" placeholder="Exemplo: (11) 99999-9999">
                    <div id="telefone-error" class="error-message">O telefone deve ter entre 10 e 11 dígitos (sem contar caracteres especiais).</div>
                </div>
                <div class="form-group">
                    <label>E-mail para contato:</label>
                    <input name="contato" type="email" placeholder="Exemplo: contato@empresa.com">
                </div>
            </div>

            <div class="form-row">
                <!-- Terceira linha - 2 campos -->
                <div class="form-group">
                    <label>Quantidade de Vagas:</label>
                    <input name="quantidade" type="number" placeholder="Exemplo: 20">
                </div>
                <div class="form-group">
                    <label>Área da Vaga:</label>
                    <input name="area" type="text" placeholder="Exemplo: Contabilidade">
                </div>
            </div>

            <div class="form-row">
                <!-- Quarta linha - 2 campos -->
                <div class="form-group">
                    <label>Carga horária diária:</label>
                    <input name="horario" type="text" placeholder="Exemplo: 8 horas">
                </div>
                <div class="form-group">
                    <label>Escala semanal:</label>
                    <input name="escala" type="text" placeholder="Exemplo: Segunda a Sexta">
                </div>
            </div>

            <div class="form-row">
                <!-- Quinta linha - 2 campos -->
                <div class="form-group">
                    <label>Local de trabalho:</label>
                    <input name="local" type="text" placeholder="Exemplo: São Paulo - SP ou Remoto">
                </div>
                <div class="form-group">
                    <label>CNPJ (opcional):</label>
                    <input name="cnpj" id="cnpj" type="text" placeholder="Exemplo: 00.000.000/0000-00">
                    <div id="cnpj-error" class="error-message">O CNPJ deve ter exatamente 14 dígitos (sem contar caracteres especiais).</div>
                </div>
            </div>

            <div class="form-row">
                <!-- Sexta linha - 2 campos de sim/não -->
                <div class="form-group">
                    <label>Oferece Vale Alimentação?</label>
                    <div class="yes-no-options">
                        <label>
                            <input type="radio" name="vale_alimentacao" value="sim" checked> Sim
                        </label>
                        <label>
                            <input type="radio" name="vale_alimentacao" value="nao"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Oferece Vale Transporte?</label>
                    <div class="yes-no-options">
                        <label>
                            <input type="radio" name="vale_transporte" value="sim" checked> Sim
                        </label>
                        <label>
                            <input type="radio" name="vale_transporte" value="nao"> Não
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Requisitos:</label>
                <textarea name="requisitos" placeholder="Descreva os requisitos para a vaga"></textarea>
            </div>

            <div class="form-group">
                <label>Benefícios (opcional):</label>
                <textarea name="beneficios" placeholder="Descreva outros benefícios oferecidos"></textarea>
            </div>

            <div class="btn-container">
                <button type="submit" class="btn">Criar Vaga</button>
            </div>
        </form>
    </div>

    <script src="novo_modelo.js"></script>
</body>
</html>