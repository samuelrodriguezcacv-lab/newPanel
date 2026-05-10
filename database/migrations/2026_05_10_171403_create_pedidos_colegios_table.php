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
        Schema::create('pedidos_colegios', function (Blueprint $table) {
            $table->id();
            $table->string('numero_pedido')->unique();
            $table->date('fecha');

            $table->foreignId('colegio_veterinario_id')
                ->constrained('colegios_veterinarios');

            $table->foreignId('proveedor_id')
                ->constrained('proveedores');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('iva_total', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            $table->string('estado')->default('borrador');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_colegios');
    }
};
