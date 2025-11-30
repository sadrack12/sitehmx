<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        // Para requisições de API, sempre retornar JSON
        if ($request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    protected function handleApiException($request, Throwable $e)
    {
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        
        $response = [
            'message' => $e->getMessage() ?: 'Internal Server Error',
        ];

        if (config('app.debug')) {
            $response['exception'] = get_class($e);
            $response['trace'] = $e->getTrace();
        }

        $jsonResponse = response()->json($response, $statusCode);
        
        // Adicionar headers CORS manualmente
        return $jsonResponse
            ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
