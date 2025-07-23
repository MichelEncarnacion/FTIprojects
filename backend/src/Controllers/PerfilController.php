<?php

namespace App\Controllers;

use PDO;
use Psr\Http\Message\ServerRequestInterface  as Request;
use Psr\Http\Message\ResponseInterface       as Response;

// Ensure Intervention Image is installed via Composer and autoloaded
use Intervention\Image\ImageManagerStatic as Image;

class PerfilController
{
    public function __construct(private PDO $db) {}

    public function uploadFoto(Request $req, Response $res): Response
    {
        $user = $req->getAttribute('user');                 // lo añadió JwtMiddleware

        /** @var \Psr\Http\Message\UploadedFileInterface $file */
        $file = $req->getUploadedFiles()['file'] ?? null;
        if (!$file || $file->getError() !== UPLOAD_ERR_OK) {
            return $res->withStatus(400)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(['error' => 'Archivo no válido']));
        }

        /* ─── 1. Validaciones básicas ─── */
        $maxBytes   = 2 * 1024 * 1024; // 2 MB
        $mime       = $file->getClientMediaType();
        $extAllowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

        if (!isset($extAllowed[$mime]) || $file->getSize() > $maxBytes) {
            return $res->withStatus(415)->write('Tipo o tamaño no permitido');
        }

        /* ─── 2. Construir nombre y mover ─── */
        $dir  = __DIR__ . '/../../public/uploads/profesores';
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $ext  = $extAllowed[$mime];
        $fileName = 'prof_' . $user->id . '_' . time() . '.' . $ext;
        $filePath = $dir . '/' . $fileName;
        $file->moveTo($filePath);

        /* ─── 3. Miniatura opcional (150×150) ─── */
        #Image::configure(['driver'=>'gd']);
        #Image::make($filePath)->fit(150, 150)->save($filePath);

        /* ─── 4. Guardar URL en la BD ─── */
        // 4. Define correctamente la ruta relativa
        $relative = "/uploads/profesores/{$fileName}";

        // 5. Guarda **solo** la ruta relativa
        $stmt = $this->db->prepare('UPDATE usuarios SET foto_url = ? WHERE id = ?');
        $stmt->execute([$relative, $user->id]);

        // 6. Devuelve también la ruta relativa al cliente
        $res->getBody()->write(json_encode(['url' => $relative]));
        return $res->withHeader('Content-Type', 'application/json');
    }

    // PerfilController.php
    public function show($req, $res)
    {
        $u = $req->getAttribute('user');
        if (!$u) {
            return $res->withStatus(401)->write('Sin token');
        }

        $stmt = $this->db->prepare(
            'SELECT id,nombre,email,foto_url,formacion_lic,formacion_mtr,formacion_doc
       FROM usuarios WHERE id = ? LIMIT 1'
        );
        $stmt->execute([$u->id]);

        $perfil = $stmt->fetch();
        if (!$perfil) {
            return $res->withStatus(404)->write('No encontrado');
        }

        $res->getBody()->write(json_encode($perfil));
        return $res->withHeader('Content-Type', 'application/json');
    }


    // ProyectoController.php
    public function indexOwn($req, $res)
    {
        $u = $req->getAttribute('user');
        $stmt = $this->db->prepare(
            'SELECT id,titulo,descripcion,estado
       FROM proyectos WHERE profesor_id = ?'
        );
        $stmt->execute([$u->id]);
        $res->getBody()->write(json_encode($stmt->fetchAll()));
        return $res->withHeader('Content-Type', 'application/json');
    }
}
