<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tareas_logistica', function (Blueprint $table) {
            $table->id();
            $table->string('numero_tarea')->unique();
            $table->enum('tipo', [
                'sellos',
                'metacrilato',
                'anulacion',
                'devolucion',
                'carnets',
                'otro'
            ]);
            $table->string('descripcion')->nullable();
            $table->enum('estado', [
                'pendiente',
                'en_proceso',
                'completada'
            ])->default('pendiente');
            // Vinculación opcional con módulo sellos
            $table->string('tarea_sellos')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tareas_logistica');
    }
};