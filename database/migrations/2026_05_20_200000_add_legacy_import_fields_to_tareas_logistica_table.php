<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tareas_logistica', function (Blueprint $table) {
            if (!Schema::hasColumn('tareas_logistica', 'pedido_id')) {
                $table->foreignId('pedido_id')
                    ->nullable()
                    ->after('provincia')
                    ->constrained('pedidos')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('tareas_logistica', 'fecha')) {
                $table->date('fecha')->nullable()->after('pedido_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tareas_logistica', function (Blueprint $table) {
            if (Schema::hasColumn('tareas_logistica', 'pedido_id')) {
                $table->dropConstrainedForeignId('pedido_id');
            }

            if (Schema::hasColumn('tareas_logistica', 'fecha')) {
                $table->dropColumn('fecha');
            }
        });
    }
};
