<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Primero eliminamos la foreign key de tarea_sello
        Schema::table('tarea_sello', function (Blueprint $table) {
            $table->dropForeign(['tarea_id']);
        });

        Schema::dropIfExists('tareas');
    }

    public function down(): void
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->integer('Tarea');
            $table->date('fecha');
            $table->string('estado')->default('pendiente');
            $table->integer('provincia');
            $table->unsignedBigInteger('pedido_id')->nullable();
            $table->timestamps();
        });
    }
};