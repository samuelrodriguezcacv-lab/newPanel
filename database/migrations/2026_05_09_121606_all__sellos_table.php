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

    Schema::create('All_sellos', function (Blueprint $table) {
        //
        $table->id();
        $table->string('codigo_sello', 20)->unique();
        $table->tinyInteger('prefijo_postal')->unsigned()->length(2);
        $table->integer('numero_colegiado');
        $table->string('nombre');
        $table->string('apellido1');
        $table->string('apellido2');
        $table->enum('tipo_sello', ['manual', 'automatico']);
        $table->integer('veces_generado')->default(0);
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
