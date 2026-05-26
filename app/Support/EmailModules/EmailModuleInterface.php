<?php

namespace App\Support\EmailModules;

interface EmailModuleInterface
{
    public function key(): string;

    /**
     * @param array<string, mixed> $context
     * @return array<string, mixed>
     */
    public function buildPayload(array $context): array;
}
