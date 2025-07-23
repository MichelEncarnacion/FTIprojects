<?php
namespace App\Controllers;

use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;

class AuthController
{
    private PDO $db;

    /* antes recibías $container; ahora inyectamos PDO directamente */
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function login(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody();          // requiere BodyParsingMiddleware
        $stmt = $this->db->prepare(
            'SELECT * FROM usuarios WHERE email = ? LIMIT 1'
        );
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user->password)) {
            $res->getBody()->write(json_encode(['error' => 'Credenciales inválidas']));
            return $res->withHeader('Content-Type', 'application/json')
                       ->withStatus(401);
        }

        $payload = [
            'id'   => $user->id,
            'role' => $user->role_id,
            'exp'  => time() + 60 * 60     // expira en 1 h
        ];
        $token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        $res->getBody()->write(json_encode([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'role'  => $user->role_id,
                'name'  => $user->nombre,
                'email' => $user->email
            ]
        ]));
        return $res->withHeader('Content-Type', 'application/json');
    }
}
