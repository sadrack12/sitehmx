<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atestado Médico</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        
        .documento-container {
            width: 85%;
            max-width: 85%;
            background: #ffffff;
            margin: 0 auto;
            padding: 3mm;
            box-sizing: border-box;
        }
        
        .header-modern {
            background: linear-gradient(135deg, #2c5530 0%, #3d6b42 100%);
            color: #000000;
            padding: 2.5mm;
            border-radius: 4px 4px 0 0;
            margin-bottom: 2mm;
            text-align: center;
        }
        
        .logo-container {
            margin-bottom: 1mm;
        }
        
        .logo-container img {
            max-height: 12mm;
            max-width: 55mm;
            filter: brightness(0);
            display: block;
            margin: 0 auto;
        }
        
        .governo-info {
            font-size: 8px;
            font-weight: bold;
            margin-bottom: 0.4mm;
            line-height: 1.3;
            color: #000000;
            display: block;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
        
        .instituicao-nome {
            font-size: 13px;
            font-weight: bold;
            margin: 1mm 0 0.5mm 0;
            letter-spacing: 0.5px;
            color: #000000;
            display: block;
        }
        
        .documento-title {
            background: #f8f9fa;
            border-left: 4px solid #2c5530;
            padding: 1mm 2mm;
            margin-bottom: 2mm;
            border-radius: 3px;
            text-align: center;
        }
        
        .documento-title h1 {
            font-size: 12px;
            font-weight: bold;
            color: #2c5530;
            text-transform: uppercase;
            margin: 0;
        }
        
        .documento-title .numero {
            font-size: 9px;
            color: #666;
            margin-top: 0.3mm;
        }
        
        .atestado-content {
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            padding: 5mm;
            border: 2px solid #2c5530;
            border-left: 5px solid #2c5530;
            border-radius: 4px;
            margin: 3mm 0;
            min-height: 50mm;
            text-align: justify;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .atestado-text {
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.8;
            margin-bottom: 2mm;
        }
        
        .paciente-nome {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 1mm;
        }
        
        .assinatura-section {
            margin-top: 8mm;
            text-align: right;
        }
        
        .assinatura-line {
            border-top: 1px solid #000;
            width: 60mm;
            margin: 8mm auto 1mm;
        }
        
        .assinatura-text {
            font-size: 8px;
            color: #495057;
            text-align: center;
        }
        
        .footer-modern {
            background: #f8f9fa;
            border-top: 2px solid #2c5530;
            padding: 0.8mm 2mm;
            margin-top: 2mm;
            border-radius: 0 0 4px 4px;
            text-align: center;
        }
        
        .footer-modern .texto {
            font-size: 6px;
            color: #495057;
            line-height: 1.2;
        }
        
        @page {
            margin: 3mm;
            size: A4;
        }
    </style>
</head>
<body>
    <div class="documento-container">
        <!-- Cabeçalho -->
        <div class="header-modern">
            <?php if($configuracao && $configuracao->mostrar_logo && $logo_base64): ?>
                <div class="logo-container">
                    <img src="<?php echo e($logo_base64); ?>" alt="Logo">
                </div>
            <?php endif; ?>
            
            <?php if($configuracao): ?>
                <?php if($configuracao->a_republica): ?>
                    <div class="governo-info"><?php echo e($configuracao->a_republica); ?></div>
                <?php else: ?>
                    <div class="governo-info">REPÚBLICA DE ANGOLA</div>
                <?php endif; ?>
                <?php if($configuracao->o_ministerio): ?>
                    <div class="governo-info"><?php echo e($configuracao->o_ministerio); ?></div>
                <?php else: ?>
                    <div class="governo-info">MINISTÉRIO DA SAÚDE</div>
                <?php endif; ?>
                <?php if($configuracao->o_governo): ?>
                    <div class="governo-info"><?php echo e($configuracao->o_governo); ?></div>
                <?php else: ?>
                    <div class="governo-info">GOVERNO PROVINCIAL DO MOXICO</div>
                <?php endif; ?>
                
                <div class="instituicao-nome"><?php echo e($configuracao->nome_instituicao); ?></div>
            <?php else: ?>
                <div class="instituicao-nome">Hospital Geral do Moxico</div>
            <?php endif; ?>
        </div>
        
        <!-- Título do Documento -->
        <div class="documento-title">
            <h1>ATESTADO MÉDICO</h1>
            <div class="numero">Nº <?php echo e(str_pad($consulta->id, 6, '0', STR_PAD_LEFT)); ?> | Emitido em: <?php echo e($data_emissao); ?></div>
        </div>
        
        <!-- Conteúdo do Atestado -->
        <div class="atestado-content">
            <div class="atestado-text">
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    Atesto para os devidos fins que o(a) paciente <span class="paciente-nome"><?php echo e($consulta->paciente->nome); ?></span>, 
                    NIF: <?php echo e($consulta->paciente->nif); ?>,
                    <?php if($consulta->paciente->data_nascimento): ?>
                        nascido(a) em <?php echo e(\Carbon\Carbon::parse($consulta->paciente->data_nascimento)->format('d/m/Y')); ?>,
                    <?php endif; ?>
                    foi atendido(a) nesta unidade de saúde em <?php echo e(\Carbon\Carbon::parse($consulta->data_consulta)->format('d/m/Y')); ?>.
                </p>
                
                <?php if($tipo_atestado === 'doenca' && $dias_afastamento): ?>
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    Em virtude do quadro clínico apresentado, recomendo afastamento das atividades por <strong><?php echo e($dias_afastamento); ?> dia(s)</strong>, 
                    a partir de <?php echo e(\Carbon\Carbon::parse($consulta->data_consulta)->format('d/m/Y')); ?>.
                </p>
                <?php elseif($tipo_atestado === 'saude'): ?>
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    Após avaliação clínica, o(a) paciente encontra-se em condições de saúde adequadas para o exercício de suas atividades normais.
                </p>
                <?php elseif($tipo_atestado === 'comparecimento'): ?>
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    Atesto que o(a) paciente compareceu a esta unidade de saúde para atendimento médico em <?php echo e(\Carbon\Carbon::parse($consulta->data_consulta)->format('d/m/Y')); ?>.
                </p>
                <?php endif; ?>
                
                <?php if($cid): ?>
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    CID: <strong><?php echo e($cid); ?></strong>
                </p>
                <?php endif; ?>
                
                <?php if($observacoes): ?>
                <p style="text-indent: 5mm; margin-bottom: 2mm;">
                    Observações: <?php echo e($observacoes); ?>

                </p>
                <?php endif; ?>
                
                <p style="text-indent: 5mm; margin-top: 3mm;">
                    Este atestado é válido apenas para o fim a que se destina e não possui valor legal para outros fins.
                </p>
            </div>
        </div>
        
        <!-- Assinatura -->
        <div class="assinatura-section">
            <div class="assinatura-line"></div>
            <div class="assinatura-text">
                <?php if($consulta->medico): ?>
                    <?php echo e($consulta->medico->nome); ?><?php if($consulta->medico->crm): ?> - Nº Ordem: <?php echo e($consulta->medico->crm); ?><?php endif; ?>
                <?php else: ?>
                    Médico Responsável
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Rodapé -->
        <div class="footer-modern">
            <div class="texto">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>

<?php /**PATH /var/www/html/resources/views/documentos/atestado.blade.php ENDPATH**/ ?>