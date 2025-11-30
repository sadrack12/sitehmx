<?php
/**
 * Script temporário para limpar cache do Laravel
 * 
 * ATENÇÃO: Delete este arquivo depois de usar!
 * 
 * Como usar:
 * 1. Faça upload deste arquivo para public_html/api/
 * 2. Acesse: https://clamatec.com/api/limpar-cache-temporario.php
 * 3. Delete o arquivo depois
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    
    echo "<h1>Limpando Cache...</h1>";
    
    $kernel->call('route:clear');
    echo "<p>✅ Route cache limpo</p>";
    
    $kernel->call('config:clear');
    echo "<p>✅ Config cache limpo</p>";
    
    $kernel->call('cache:clear');
    echo "<p>✅ Application cache limpo</p>";
    
    echo "<h2 style='color: green;'>✅ Cache limpo com sucesso!</h2>";
    echo "<p><strong>IMPORTANTE: Delete este arquivo agora por segurança!</strong></p>";
    
} catch (Exception $e) {
    echo "<h2 style='color: red;'>❌ Erro ao limpar cache:</h2>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}

