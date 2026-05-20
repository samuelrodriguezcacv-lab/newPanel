<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('metacrilatos', function (Blueprint $table) {
            if (!Schema::hasColumn('metacrilatos', 'pedido_id')) {
                $table->foreignId('pedido_id')
                    ->nullable()
                    ->after('tarea_logistica_id')
                    ->constrained('pedidos')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('metacrilatos', function (Blueprint $table) {
            if (Schema::hasColumn('metacrilatos', 'pedido_id')) {
                $table->dropConstrainedForeignId('pedido_id');
            }
        });
    }
};
