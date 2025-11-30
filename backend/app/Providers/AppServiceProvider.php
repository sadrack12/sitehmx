<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadRoutes();
    }

    protected function loadRoutes(): void
    {
        // Carregar rotas da API sem prefixo adicional
        // O prefixo 'api' já está na URL (https://clamatec.com/api/)
        // e o .htaccess redireciona para public/, então o Laravel recebe sem /api/
        if (file_exists(base_path('routes/api.php'))) {
            require base_path('routes/api.php');
        }
        
        if (file_exists(base_path('routes/web.php'))) {
            require base_path('routes/web.php');
        }
    }
}

