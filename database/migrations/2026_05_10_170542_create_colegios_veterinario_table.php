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
        Schema::create('colegios_veterinarios', function (Blueprint $table) {
            $table->id();

            $table->string('nombre');
            $table->string('direccion')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('codigo_postal', 10)->nullable();

            $table->string('cif')->nullable();

            $table->string('telefono')->nullable();
            $table->string('email')->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colegios_veterinario');
    }
};
