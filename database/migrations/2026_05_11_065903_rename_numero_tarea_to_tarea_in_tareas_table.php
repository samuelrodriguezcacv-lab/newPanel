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
    Schema::table('tareas', function (Blueprint $table) {
        $table->renameColumn('numero_tarea', 'Tarea');
    });
}

public function down(): void
{
    Schema::table('tareas', function (Blueprint $table) {
        $table->renameColumn('Tarea', 'numero_tarea');
    });
}
};
