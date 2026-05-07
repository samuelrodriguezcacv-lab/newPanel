<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sellos', function (Blueprint $table) {
            $table->renameColumn('codigo_postal', 'numero_colegiado');
        });
    }

    public function down(): void
    {
        Schema::table('sellos', function (Blueprint $table) {
            $table->renameColumn('numero_colegiado', 'codigo_postal');
        });
    }
};
