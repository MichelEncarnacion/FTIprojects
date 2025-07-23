<?php
namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Nyholm\Psr7\Response as SlimResponse;

class CorsMiddleware
{
    public function __invoke(Request $request, Handler $handler): Response
    {
        $origin = $request->getHeaderLine('Origin') ?: '*';

        // --- Pre-flight ---
        if ($request->getMethod() === 'OPTIONS') {
            return $this->withHeaders(new SlimResponse(204), $origin);
        }

        // --- Request normal ---
        $response = $handler->handle($request);
        return $this->withHeaders($response, $origin);
    }

    private function withHeaders(Response $response, string $origin): Response
    {
        return $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    }
}
