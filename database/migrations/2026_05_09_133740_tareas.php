<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('tareas', function (Blueprint $table) {
        $table->id();
        $table->integer('numero_tarea')->unique();
        $table->date('fecha');
        $table->enum('estado', ['pendiente', 'en_proceso', 'completada'])->default('pendiente');
        $table->tinyInteger('provincia')->unsigned()->comment('Prefijo postal de la provincia');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
