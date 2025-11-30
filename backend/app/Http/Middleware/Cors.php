<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        // Obter a origem da requisição
        $origin = $request->headers->get('Origin');
        
        // Permitir localhost e qualquer IP na rede local
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];
        
        // Adicionar origem da requisição se for válida (não vazia e não null)
        if ($origin && !in_array($origin, $allowedOrigins)) {
            // Verificar se é um IP local ou domínio válido
            $parsedOrigin = parse_url($origin);
            if ($parsedOrigin) {
                $host = $parsedOrigin['host'] ?? '';
                $port = $parsedOrigin['port'] ?? '';
                $scheme = $parsedOrigin['scheme'] ?? 'http';
                
                // Permitir IPs locais (192.168.x.x, 10.x.x.x, 172.16-31.x.x, 172.20.x.x) e localhost
                // Também permitir qualquer IP que não seja público (desenvolvimento)
                $isLocal = (
                    strpos($host, 'localhost') !== false ||
                    strpos($host, '127.0.0.1') !== false ||
                    preg_match('/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]|20)\.)/', $host) ||
                    preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/', $host)
                );
                
                if ($isLocal) {
                    $allowedOrigins[] = $origin;
                    // Também adicionar variações com/sem porta
                    if ($port && $port != '3000') {
                        $allowedOrigins[] = "{$scheme}://{$host}:3000";
                    }
                }
            }
        }
        
        // Se a origem estiver na lista permitida, usar ela; caso contrário, usar *
        // Em desenvolvimento, permitir qualquer origem para facilitar testes
        $finalOrigin = ($origin && in_array($origin, $allowedOrigins)) ? $origin : '*';
        
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $finalOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN')
                ->header('Access-Control-Allow-Credentials', $finalOrigin !== '*' ? 'true' : 'false')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        // Add CORS headers to the response
        return $response
            ->header('Access-Control-Allow-Origin', $finalOrigin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN')
            ->header('Access-Control-Allow-Credentials', $finalOrigin !== '*' ? 'true' : 'false')
            ->header('Access-Control-Max-Age', '86400');
    }
}

