<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos_metacrilatos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('numero_pedido')->unique();
            $table->date('fecha');
            $table->enum('estado', ['abierto', 'cerrado', 'enviado'])->default('abierto');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos_metacrilatos');
    }
};
