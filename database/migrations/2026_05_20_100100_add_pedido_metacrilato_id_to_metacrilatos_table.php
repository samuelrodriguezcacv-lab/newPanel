<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('metacrilatos', function (Blueprint $table) {
            if (!Schema::hasColumn('metacrilatos', 'pedido_metacrilato_id')) {
                $table->foreignId('pedido_metacrilato_id')
                    ->nullable()
                    ->after('pedido_id')
                    ->constrained('pedidos_metacrilatos')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('metacrilatos', function (Blueprint $table) {
            if (Schema::hasColumn('metacrilatos', 'pedido_metacrilato_id')) {
                $table->dropConstrainedForeignId('pedido_metacrilato_id');
            }
        });
    }
};
