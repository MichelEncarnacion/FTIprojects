<?php
namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Http\Message\ResponseInterface as Response;
use Nyholm\Psr7\Response as SlimResponse;

class JwtMiddleware
{
    public function __invoke(Request $request, Handler $handler): Response
    {
        /* 1. Leer cabecera Authorization: Bearer <token> */
        $auth = $request->getHeaderLine('Authorization');
        if (!$auth || !preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) {
            return $this->unauthorized();
        }

        $token = $m[1];

        /* 2. Validar token */
        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Throwable $e) {
            return $this->unauthorized();
        }

        /* 3. Inyectar el usuario en la request y continuar */
        $request = $request->withAttribute('user', $decoded);
        return $handler->handle($request);
    }

    private function unauthorized(): Response
    {
        $res = new SlimResponse();
        $res->getBody()->write(json_encode(['error' => 'Unauthorized']));
        return $res->withHeader('Content-Type', 'application/json')
                   ->withStatus(401);
    }
}
