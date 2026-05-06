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
    Schema::create('sellos', function (Blueprint $table) {
        $table->id();
        $table->string('prefijo_postal', 2);   // 41, 11, 28...
        $table->string('codigo_postal', 10);
        $table->string('nombre');
        $table->string('apellido1');
        $table->string('apellido2')->nullable();
        $table->enum('tipo_sello', ['manual', 'automatico']);
        $table->unsignedInteger('orden')->default(1); // versión/reintento
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sellos');
    }
};
