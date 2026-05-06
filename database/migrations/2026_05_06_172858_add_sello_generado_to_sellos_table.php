<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sellos', function (Blueprint $table) {
            $table->string('sello_generado')->index();
        });
    }

    public function down(): void
    {
        Schema::table('sellos', function (Blueprint $table) {
            $table->dropColumn('sello_generado');
        });
    }
};