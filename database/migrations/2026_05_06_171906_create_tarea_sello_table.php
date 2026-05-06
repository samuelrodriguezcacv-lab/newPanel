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
    Schema::create('tarea_sello', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tarea_id')->constrained('tareas')->cascadeOnDelete();
        $table->foreignId('sello_id')->constrained('sellos')->cascadeOnDelete();
        $table->enum('tipo_uso', ['manual', 'automatico']);
        $table->timestamp('fecha_uso')->useCurrent();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarea_sello');
    }
};
