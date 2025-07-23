<?php
namespace App\Controllers;

use PDO;
use Psr\Http\Message\ServerRequestInterface  as Request;
use Psr\Http\Message\ResponseInterface       as Response;

class ClasificacionController
{
    public function __construct(private PDO $db) {}

    // GET /clasificaciones
    public function index(Request $req, Response $res): Response
    {
        $stmt = $this->db->query(
          'SELECT id, titulo FROM clasificaciones ORDER BY id'
        );
        $list = $stmt->fetchAll();

        $res->getBody()->write(json_encode($list));
        return $res->withHeader('Content-Type','application/json');
    }
}
