<?php

namespace App\Support\EmailModules;

use InvalidArgumentException;

class EmailModuleRegistry
{
    /** @var array<string, EmailModuleInterface> */
    private array $modules;

    public function __construct()
    {
        $this->modules = [
            'pedidos' => new PedidosEmailModule(),
        ];
    }

    public function get(string $key): EmailModuleInterface
    {
        if (!isset($this->modules[$key])) {
            throw new InvalidArgumentException("Modulo de email no registrado: {$key}");
        }

        return $this->modules[$key];
    }
}
