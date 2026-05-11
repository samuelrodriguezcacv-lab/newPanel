<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
 public function up(): void
{
    Schema::table('pedido_lineas', function (Blueprint $table) {
        if (!Schema::hasColumn('pedido_lineas', 'pedido_id')) {
            $table->unsignedBigInteger('pedido_id')->after('id');
        }
    });
}

    public function down(): void
    {
        Schema::table('pedido_lineas', function (Blueprint $table) {
            $table->dropForeign(['pedido_id']);
            $table->dropColumn([
                'pedido_id',
                'producto_id',
                'descripcion',
                'unidades',
                'precio_unitario',
                'importe'
            ]);
        });
    }
};