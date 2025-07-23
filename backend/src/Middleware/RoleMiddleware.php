<?php
namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Http\Message\ResponseInterface as Response;
use Nyholm\Psr7\Response as SlimResponse;

class RoleMiddleware
{
    /** @var int[] */
    private array $rolesNeeded;

    public function __construct(int|array $rolesNeeded)
    {
        $this->rolesNeeded = (array) $rolesNeeded;   // acepta 1 ó varios
    }

    public function __invoke(Request $req, Handler $h): Response
    {
        $u = $req->getAttribute('user');

        if (!$u || !in_array($u->role, $this->rolesNeeded, true)) {
            $r = new SlimResponse(403);
            $r->getBody()->write(json_encode(['error' => 'Forbidden']));
            return $r->withHeader('Content-Type','application/json');
        }
        return $h->handle($req);
    }
}
