<?php

namespace App\Controllers;

use PDO;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Nyholm\Psr7\Stream;

class AdminController
{
    public function __construct(private PDO $db) {}

    /** Listar todos los usuarios */
    public function indexUsuarios(Request $req, Response $res): Response
    {
        $stmt = $this->db->query("
            SELECT u.id, u.nombre, u.email, u.foto_url,  r.nombre AS rol
            FROM usuarios u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.id DESC
        ");
        $res->getBody()->write(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /** Obtener un usuario por ID */
    public function showUsuario(Request $req, Response $res, array $args): Response
    {
        $id = (int)$args['id'];
        $stmt = $this->db->prepare("
            SELECT id, nombre, email, foto_url, role_id, formacion_lic, formacion_mtr, formacion_doc
            FROM usuarios WHERE id = ?
        ");
        $stmt->execute([$id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            return $res->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(Stream::create(json_encode(['error' => 'No encontrado'])));
        }

        $res->getBody()->write(json_encode($usuario));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /** Crear nuevo usuario */
    public function storeUsuario(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody();

        $stmt = $this->db->prepare("
            INSERT INTO usuarios (nombre, email, password, role_id,formacion_lic, formacion_mtr, formacion_doc)
            VALUES (?, ?, ?, ?, ?, ?,?)
        ");
        $stmt->execute([
            $data['nombre'],
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $data['role_id'],
            $data['formacion_lic'] ?? null,
            $data['formacion_mtr'] ?? null,
            $data['formacion_doc'] ?? null
        ]);

        $id = (int)$this->db->lastInsertId();
        $res->getBody()->write(json_encode(['id' => $id]));
        return $res->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    /** Actualizar usuario */
    public function updateUsuario(Request $req, Response $res, array $args): Response
    {
        $id   = (int)$args['id'];
        $data = $req->getParsedBody();

        $stmt = $this->db->prepare("
            UPDATE usuarios SET 
                nombre = ?, 
                email = ?, 
                role_id = ?,
                formacion_lic = ?,
                formacion_mtr = ?,
                formacion_doc = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['nombre'],
            $data['email'],
            $data['role_id'],
            $data['formacion_lic'] ?? null,
            $data['formacion_mtr'] ?? null,
            $data['formacion_doc'] ?? null,
            $id
        ]);

        return $res->withStatus(204);
    }

    /** Eliminar usuario */
    public function deleteUsuario(Request $req, Response $res, array $args): Response
    {
        $id = (int)$args['id'];

        $stmt = $this->db->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);

        return $res->withStatus(204);
    }
}
