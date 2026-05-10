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
            Schema::create('pedido_lineas', function (Blueprint $table) {
                $table->id();

                $table->foreignId('pedido_id')
                    ->constrained('pedidos')
                    ->onDelete('cascade');

                $table->foreignId('producto_id')
                    ->nullable()
                    ->constrained('productos')
                    ->nullOnDelete();

                $table->text('descripcion');
                $table->integer('unidades');
                $table->decimal('precio_unitario', 10, 2);
                $table->decimal('importe', 10, 2);

                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_lineas');
    }
};
