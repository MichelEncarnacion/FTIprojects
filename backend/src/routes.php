<?php

use App\Controllers\AuthController;
use App\Controllers\PerfilController;
use App\Controllers\ProyectoController;
use App\Controllers\AdminController;
use App\Middleware\JwtMiddleware;
use App\Middleware\RoleMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\ClasificacionController;

/* ---------- Ruta raíz “/” ---------- */

$app->get('/', function (Request $req, Response $res) {
    $res->getBody()->write(json_encode(['status' => 'API OK']));
    return $res->withHeader('Content-Type', 'application/json');
});

/* ---------- Proyectos públicos  ---------- */


$app->get('/saps/{slug}/proyectos', ProyectoController::class . ':indexByClasificacion');
$app->get('/proyectos', ProyectoController::class . ':index');
$app->get('/clasificaciones', ClasificacionController::class . ':index');
$app->get('/proyectos/{id}', ProyectoController::class . ':showPublic');
$app->get('/imagenes/{filename}', ProyectoController::class . ':mostrarImagen');

$app->get('/public/proyectos/{id}/imagenes', [ProyectoController::class, 'verImagenesPublicas']);

$app->get('/uploads/proyectos/{filename}', function ($req, $res, $args) {
    $filename = basename($args['filename']); // sanitizar el nombre
    $filepath = __DIR__ . '/../../uploads/proyectos/' . $filename;

    if (!file_exists($filepath)) {
        return $res->withStatus(404)->withHeader('Content-Type', 'application/json')
            ->write(json_encode(['error' => 'Archivo no encontrado']));
    }

    $mime = mime_content_type($filepath);
    $stream = \Nyholm\Psr7\Stream::create(fopen($filepath, 'rb'));

    return $res->withBody($stream)->withHeader('Content-Type', $mime);
});




/* ---------- Auth ---------- */
$app->post('/auth/login', AuthController::class . ':login');

/* ---------- Grupo PROFESOR (protegido) ---------- */
$app->group('/profesor', function (RouteCollectorProxy $group) {

    /* PERFIL */
    $group->get('/perfil',        PerfilController::class . ':show');        // GET perfil
    $group->post('/perfil/foto',   PerfilController::class . ':uploadFoto');  // subir foto

    /* PROYECTOS del profesor */
    $group->get('/proyectos',           ProyectoController::class . ':indexOwn'); // listar
    $group->get('/proyectos/{id}',   ProyectoController::class . ':show'); // ver
    $group->post('/proyectos',           ProyectoController::class . ':store');    // crear
    $group->put('/proyectos/{id}',      ProyectoController::class . ':update');   // editar
    $group->delete('/proyectos/{id}',      ProyectoController::class . ':destroy');  // eliminar
    $group->put('/proyectos/{id}/estado', ProyectoController::class . ':toggleEstado'); // cambiar estado
    $group->post('/proyectos/{id}/imagenes', [ProyectoController::class, 'subirImagenes']);
    $group->get('/proyectos/{id}/imagenes', [ProyectoController::class, 'getImagenes']);
    
        $group->delete('/imagenes/{id}', [ProyectoController::class, 'eliminarImagen']);
})


    ->add(new RoleMiddleware(2)) // profesor
    ->add(new JwtMiddleware);













/* ---------- Grupo ADMIN (protegido) ---------- */
$app->group('/admin', function (RouteCollectorProxy $group) {
    # $group->get('/usuarios', [AdminController::class, 'usuarios']);

    // CRUD usuarios
    $group->get('/usuarios',           AdminController::class . ':indexUsuarios');
    $group->post('/usuarios',           AdminController::class . ':storeUsuario');
    $group->get('/usuarios/{id}',      AdminController::class . ':showUsuario');
    $group->put('/usuarios/{id}',      AdminController::class . ':updateUsuario');
    $group->delete('/usuarios/{id}',      AdminController::class . ':deleteUsuario');
})
    ->add(new RoleMiddleware(1)) // admin
    ->add(new JwtMiddleware);

/* ---------- Respuesta OPTIONS global (CORS pre-flight) ---------- */
$app->options('/{routes:.+}', fn($req, $res) => $res);
