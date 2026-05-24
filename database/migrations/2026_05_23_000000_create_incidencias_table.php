<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidencias', function (Blueprint $table) {
            $table->id();
            $table->string('numero_incidencia')->unique();
            $table->date('fecha');
            $table->text('descripcion');
            $table->string('alcance')->default('todos');
            $table->foreignId('colegio_veterinario_id')->nullable()->constrained('colegios_veterinarios')->nullOnDelete();
            $table->string('estado')->default('abierta');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidencias');
    }
};
