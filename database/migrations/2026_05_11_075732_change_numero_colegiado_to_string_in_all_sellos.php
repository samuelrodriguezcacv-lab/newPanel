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
    Schema::table('All_sellos', function (Blueprint $table) {
        $table->string('numero_colegiado', 4)->change();
    });
}

public function down(): void
{
    Schema::table('All_sellos', function (Blueprint $table) {
        $table->integer('numero_colegiado')->change();
    });
}
};
