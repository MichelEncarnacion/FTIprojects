<?php
/*---------------------------------------------
 | backend/bootstrap.php
 +--------------------------------------------*/

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use DI\Container;
use Slim\Factory\AppFactory;
use Psr\Container\ContainerInterface;
use App\Middleware\CorsMiddleware;
use App\Controllers\AuthController;
use App\Controllers\ClasificacionController;
use App\Controllers\ProyectoController;
use App\Controllers\PerfilController;
/* 1) Variables de entorno */
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();                // no rompe si falta .env

/* 2) Contenedor */
$container = new Container();

/* 2-a) Servicio PDO */
$container->set('db', function () {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $_ENV['DB_HOST'],
        $_ENV['DB_NAME']
    );
    return new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
    ]);
});
$container->set(PDO::class, fn(ContainerInterface $c) => $c->get('db'));
/* 2-b) Fábrica de AuthController con inyección de PDO */
$container->set(AuthController::class, function (ContainerInterface $c) {
    return new AuthController($c->get('db'));
});

$container->set(ProyectoController::class, function(ContainerInterface $c){
    return new ProyectoController($c->get('db'));
});

$container->set(ClasificacionController::class, function(ContainerInterface $c){
    return new ClasificacionController($c->get('db'));
});

// Fábrica de PerfilController con inyección de PDO
$container->set(PerfilController::class, fn($c) =>
    new PerfilController($c->get('db'))
);
/* 3) Pasa el contenedor a Slim antes de crear la app */
AppFactory::setContainer($container);
$app = AppFactory::create();

/* 4) Middlewares (orden correcto) */
$app->addRoutingMiddleware();          // interno de Slim
$app->addBodyParsingMiddleware();      // JSON / x-www-form
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->getDefaultErrorHandler()->forceContentType('text/html');

$app->add(new CorsMiddleware());       // CORS es el último add()

/* 5) Rutas */
require __DIR__ . '/src/routes.php';

/* 6) Ejecutar */
$app->run();
