<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tarea_sello', function (Blueprint $table) {
            $table->unsignedBigInteger('pedido_id')->nullable()->after('id');
            $table->unsignedBigInteger('tareas_logistica_id')->nullable()->after('pedido_id');
            $table->string('numero_tarea')->nullable()->after('tareas_logistica_id');
            $table->string('provincia')->nullable()->after('numero_tarea');
            $table->date('fecha')->nullable()->after('provincia');
            $table->enum('estado', ['pendiente', 'en_proceso', 'completada'])->default('pendiente')->after('fecha');

            $table->foreign('pedido_id')->references('id')->on('pedidos')->onDelete('set null');
            $table->foreign('tareas_logistica_id')->references('id')->on('tareas_logistica')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tarea_sello', function (Blueprint $table) {
            $table->dropForeign(['pedido_id']);
            $table->dropForeign(['tareas_logistica_id']);
            $table->dropColumn(['pedido_id', 'tareas_logistica_id', 'numero_tarea', 'provincia', 'fecha', 'estado']);
        });
    }
};