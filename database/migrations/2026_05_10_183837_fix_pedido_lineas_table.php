<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pedido_lineas', function (Blueprint $table) {
            $table->unsignedBigInteger('pedido_id')->after('id');
            $table->unsignedBigInteger('producto_id')->nullable()->after('pedido_id');

            $table->text('descripcion')->nullable();
            $table->integer('unidades')->default(1);
            $table->decimal('precio_unitario', 10, 2)->default(0);
            $table->decimal('importe', 10, 2)->default(0);

            $table->foreign('pedido_id')
                ->references('id')
                ->on('pedidos_colegios')
                ->onDelete('cascade');
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