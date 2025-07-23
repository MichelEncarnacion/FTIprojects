<?php

namespace App\Controllers;

use PDO;
use Psr\Http\Message\ServerRequestInterface  as Request;
use Psr\Http\Message\ResponseInterface       as Response;
use Nyholm\Psr7\Stream;

class ProyectoController
{
    public function __construct(private PDO $db) {}


    /* listado de los proyectos del profesor */
    public function indexOwn(Request $req, Response $res): Response
    {
        $u = $req->getAttribute('user');              // puesto por JwtMiddleware
        $st = $this->db->prepare(
            'SELECT id,titulo,descripcion,estado,tecnologias
             FROM proyectos
             WHERE profesor_id = ?'
        );
        $st->execute([$u->id]);

        $res->getBody()->write(json_encode($st->fetchAll()));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /** Crear nuevo proyecto */
    public function store(Request $req, Response $res): Response
    {
        $u    = $req->getAttribute('user');
        $data = $req->getParsedBody();
        $st = $this->db->prepare(
            "INSERT INTO proyectos 
             (titulo,descripcion,objetivo,tecnologias,clasif_id,profesor_id)
             VALUES (?,?,?,?,?,?)"
        );
        $st->execute([
            $data['titulo'],
            $data['descripcion'],
            $data['objetivo'],
            $data['tecnologias'],
            $data['clasif_id'],
            $u->id
        ]);
        // devolver el ID creado
        $id = (int)$this->db->lastInsertId();
        $res->getBody()->write(json_encode(['id' => $id]));
        return $res
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    /** Actualizar proyecto propio */
    public function update(Request $req, Response $res, array $args): Response
    {
        $u    = $req->getAttribute('user');
        $id   = (int)$args['id'];
        $data = $req->getParsedBody();

        // opcional: verificar que el proyecto pertenece al profesor
        $chk = $this->db->prepare(
            "SELECT COUNT(*) FROM proyectos 
           WHERE id=? AND profesor_id=?"
        );
        $chk->execute([$id, $u->id]);
        if ($chk->fetchColumn() == 0) {
            return $res->withStatus(404);
        }

        $st = $this->db->prepare(
            "UPDATE proyectos SET
               titulo           = ?,
               descripcion      = ?,
               objetivo         = ?,
               tecnologias      = ?,
               clasif_id = ?,
               imagen_destacada = ?
             WHERE id = ?"
        );
        $st->execute([
            $data['titulo'],
            $data['descripcion'],
            $data['objetivo'],
            $data['tecnologias'],
            $data['clasif_id'],
             $data['imagen_destacada'] ?? null,
            $id
        ]);
        return $res->withStatus(204);
    }

    /** Eliminar proyecto propio */
    public function destroy(Request $req, Response $res, array $args): Response
    {
        $u  = $req->getAttribute('user');
        $id = (int)$args['id'];

        // Verifica pertenencia del proyecto
        $chk = $this->db->prepare(
            "SELECT COUNT(*) FROM proyectos WHERE id=? AND profesor_id=?"
        );
        $chk->execute([$id, $u->id]);
        if ($chk->fetchColumn() == 0) return $res->withStatus(404);

        // 1. Obtener los nombres de las imágenes relacionadas
        $st = $this->db->prepare("SELECT filename FROM proyecto_imagenes WHERE proyecto_id=?");
        $st->execute([$id]);
        $imagenes = $st->fetchAll();

        // 2. Eliminar archivos físicamente del disco
        foreach ($imagenes as $img) {
            $ruta = __DIR__ . '/../../public/uploads/proyectos' . $img->filename;
            if (file_exists($ruta)) {
                unlink($ruta);
            }
        }

        // 3. Eliminar imágenes de la base de datos
        $this->db->prepare("DELETE FROM proyecto_imagenes WHERE proyecto_id=?")
            ->execute([$id]);

        // 4. Eliminar el proyecto
        $this->db->prepare("DELETE FROM proyectos WHERE id=?")
            ->execute([$id]);

        return $res->withStatus(204);
    }


    public function show(Request $req, Response $res, array $args): Response
    {
        $u  = $req->getAttribute('user');
        $id = (int)$args['id'];

        // Verificar que existe y que le pertenece
        $st = $this->db->prepare(
            'SELECT id,titulo,descripcion,objetivo,tecnologias,estado,clasif_id
           FROM proyectos WHERE id = ? AND profesor_id = ?'
        );
        $st->execute([$id, $u->id]);
        $pro = $st->fetch();

        if (!$pro) {
            return $res->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(\Nyholm\Psr7\Stream::create(
                    json_encode(['error' => 'No encontrado'])
                ));
        }

        $res->getBody()->write(json_encode($pro));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /** Cambia estado activo↔inactivo */
    public function toggleEstado(Request $req, Response $res, array $args): Response
    {
        $u  = $req->getAttribute('user');
        $id = (int)$args['id'];

        // 1) Comprueba que el proyecto existe y te pertenece
        $chk = $this->db->prepare(
            "SELECT estado FROM proyectos WHERE id = ? AND profesor_id = ?"
        );
        $chk->execute([$id, $u->id]);
        $row = $chk->fetch();
        if (!$row) {
            return $res->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(\Nyholm\Psr7\Stream::create(
                    json_encode(['error' => 'No encontrado'])
                ));
        }

        // 2) Invierte el estado
        $nuevo = $row->estado === 'activo' ? 'inactivo' : 'activo';
        $up = $this->db->prepare(
            "UPDATE proyectos SET estado = ? WHERE id = ?"
        );
        $up->execute([$nuevo, $id]);

        // 3) Devuelve el nuevo estado
        $res->getBody()->write(json_encode(['estado' => $nuevo]));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /**
     * GET /clasificaciones/{slug}/proyectos
     * Devuelve todos los proyectos de una clasificación + datos del profesor.
     */
    public function indexByClasificacion(Request $req, Response $res, array $args): Response
    {
        $slug = $args['slug'];
        $sql = "
      SELECT 
        p.id, p.titulo, p.estado,
        pr.nombre AS profesor_nombre,
        pr.foto_url AS profesor_foto
      FROM proyectos p
      JOIN clasificaciones c ON p.clasif_id = c.id
      JOIN usuarios    pr ON p.profesor_id = pr.id
      WHERE c.slug = :slug
      ORDER BY p.id DESC
    ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['slug' => $slug]);
        $data = $stmt->fetchAll();
        $res->getBody()->write(json_encode($data));
        return $res->withHeader('Content-Type', 'application/json');
    }


    // 1) Detalle público SIN filtro profesor_id
    public function showPublic(Request $req, Response $res, array $args): Response
    {
        $id = (int) $args['id'];
        $sql = <<<SQL
    SELECT
    p.id,
    p.titulo,
    p.descripcion,
    p.objetivo,
    p.tecnologias,
    p.estado,
    p.clasif_id,
    p.profesor_id,
    u.nombre     AS profesor_nombre,
    u.foto_url   AS profesor_foto_url,
    c.titulo     AS clasif_titulo
    FROM proyectos p
    JOIN usuarios u
    ON p.profesor_id = u.id
    JOIN clasificaciones c
    ON p.clasif_id = c.id
    WHERE p.id = ?
    SQL;


        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $pro = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$pro) {
            $payload = ['error' => 'No encontrado'];
            $res = $res
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
            $res->getBody()->write(json_encode($payload));
            return $res;
        }

        $res = $res->withHeader('Content-Type', 'application/json');
        $res->getBody()->write(json_encode($pro));
        return $res;
    }

    public function index(Request $req, Response $res, array $args): Response
    {
        $stmt = $this->db->query("
          SELECT id, titulo, estado,imagen_destacada
          FROM proyectos
          ORDER BY id DESC
        ");
        $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $res->getBody()->write(json_encode($lista));
        return $res->withHeader('Content-Type', 'application/json');
    }


    public function subirImagenes(Request $req, Response $res, array $args): Response
    {
        $id     = (int)$args['id'];
        $u      = $req->getAttribute('user');
        $files  = $req->getUploadedFiles();

        // Verifica que el proyecto pertenece al profesor
        $chk = $this->db->prepare("SELECT COUNT(*) FROM proyectos WHERE id = ? AND profesor_id = ?");
        $chk->execute([$id, $u->id]);
        if ($chk->fetchColumn() == 0) {
            return $res->withStatus(403);
        }

        // Carpeta destino
        $uploadDir = __DIR__ . '/../../public/uploads/proyectos';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $stmt = $this->db->prepare("INSERT INTO proyecto_imagenes (proyecto_id, filename) VALUES (?, ?)");

        foreach ($files['imagenes'] ?? [] as $file) {
            if ($file->getError() === UPLOAD_ERR_OK) {
                $name = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9\.\-_]/', '_', $file->getClientFilename());
                $file->moveTo($uploadDir . '/' . $name);
                $stmt->execute([$id, $name]);
                // Imagen destacada si no tiene
                $this->db->prepare("UPDATE proyectos SET imagen_destacada = ? WHERE id = ? AND imagen_destacada IS NULL")
                    ->execute([$name, $id]);
            }
        }

        return $res->withStatus(204);
    }

    public function getImagenes(Request $req, Response $res, array $args): Response
    {
        $u  = $req->getAttribute('user');
        $id = (int)$args['id'];

        // Verificar que el proyecto pertenece al profesor
        $chk = $this->db->prepare("SELECT COUNT(*) FROM proyectos WHERE id = ? AND profesor_id = ?");
        $chk->execute([$id, $u->id]);
        if ($chk->fetchColumn() == 0) return $res->withStatus(403);

        $stmt = $this->db->prepare("SELECT id, filename FROM proyecto_imagenes WHERE proyecto_id = ?");
        $stmt->execute([$id]);
        $imagenes = $stmt->fetchAll();

        $res->getBody()->write(json_encode($imagenes));
        return $res->withHeader('Content-Type', 'application/json');
    }


    public function mostrarImagen(Request $req, Response $res, array $args): Response
    {
        $filename = basename($args['filename']);
        $path = __DIR__ . '/../../uploads/proyectos' . $filename;

        if (!file_exists($path)) {
            $res->getBody()->write(json_encode(['error' => 'Imagen no encontrada']));
            return $res
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }

        $stream = Stream::create(fopen($path, 'rb'));

        return $res
            ->withHeader('Content-Type', mime_content_type($path))
            ->withBody($stream);
    }



    public function eliminarImagen(Request $req, Response $res, array $args): Response
    {
        $u = $req->getAttribute('user');
        $id = (int)$args['id'];

        // Verificar que la imagen pertenece a un proyecto del profesor
        $stmt = $this->db->prepare("
        SELECT i.filename, p.profesor_id
        FROM proyecto_imagenes i
        JOIN proyectos p ON i.proyecto_id = p.id
        WHERE i.id = ?
    ");
        $stmt->execute([$id]);
        $img = $stmt->fetch();

        if (!$img || $img->profesor_id != $u->id) {
            return $res->withStatus(403);
        }

        // Eliminar archivo físico
        $filePath = __DIR__ . '/../../uploads/proyectos' . $img->filename;
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // Eliminar de la base de datos
        $del = $this->db->prepare("DELETE FROM proyecto_imagenes WHERE id = ?");
        $del->execute([$id]);

        return $res->withStatus(204);
    }

    public function verImagenesPublicas(Request $req, Response $res, array $args): Response
    {
        $id = (int)$args['id'];

        $stmt = $this->db->prepare("SELECT DISTINCT id, filename FROM proyecto_imagenes WHERE proyecto_id = ?");
        $stmt->execute([$id]);
        $imagenes = $stmt->fetchAll();

        return $res->withHeader("Content-Type", "application/json")
            ->withBody(Stream::create(json_encode($imagenes)));
    }
}
