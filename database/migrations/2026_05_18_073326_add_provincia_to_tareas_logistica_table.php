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
            Schema::table('tareas_logistica', function (Blueprint $table) {
                    $table->string('provincia')->nullable()->after('tarea_sellos');
                });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tareas_logistica', function (Blueprint $table) {
            $table->dropColumn('provincia');
        });
    }
};
