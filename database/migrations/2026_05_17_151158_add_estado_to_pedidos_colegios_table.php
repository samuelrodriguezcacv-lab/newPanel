<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_colegios', function (Blueprint $table) {
            // Añadimos la columna estado si no existe
            if (!Schema::hasColumn('pedidos_colegios', 'estado')) {
                $table->string('estado')->default('pendiente')->after('colegio_veterinario_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pedidos_colegios', function (Blueprint $table) {
            if (Schema::hasColumn('pedidos_colegios', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};