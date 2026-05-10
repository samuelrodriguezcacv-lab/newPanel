<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php', // ← añade esta línea
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
    ->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        '/sellos', // ← excluye esta ruta
        '/tareas', // ← excluye esta ruta
        '/pedidos',
        '/tareas/*/sellos', // ← excluye esta ruta
        '/api-sellos/*', // ← excluye esta ruta
        '/pedidos/*/cerrar',
        '/pedidos/*/estado', // PUT ya estaba pero añade por si acaso
        '/tareas/*/sellos/*', // ← cambia la que tenías
        '/tareas/*', // ← añade esta línea para eliminar tareas
        '/sellos/*', // ← añade esta línea para actualizar sellos
        '/ordenes-compra-colegios',
    '/ordenes-compra-colegios/*',
    ]);
})
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
