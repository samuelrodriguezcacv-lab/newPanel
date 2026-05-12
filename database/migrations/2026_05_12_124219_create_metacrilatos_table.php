<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metacrilatos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo_centro', [
                'Consultorio Veterinario',
                'Clínica Veterinaria',
                'Hospital Veterinario',
                'Centro Veterinario',
            ]);
            $table->string('codigo_registro'); // Ej: MA339
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metacrilatos');
    }
};