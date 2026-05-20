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
    Schema::table('tarea_sello', function (Blueprint $table) {
        $table->string('tipo_uso')->nullable();
        $table->timestamp('fecha_uso')->nullable();
    });
}

public function down(): void
{
    Schema::table('tarea_sello', function (Blueprint $table) {
        $table->dropColumn(['tipo_uso', 'fecha_uso']);
    });
}
};
