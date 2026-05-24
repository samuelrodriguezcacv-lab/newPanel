<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('colegios_veterinarios', function (Blueprint $table) {
            $table->string('provincia')->nullable()->after('codigo_postal');
        });
    }

    public function down(): void
    {
        Schema::table('colegios_veterinarios', function (Blueprint $table) {
            $table->dropColumn('provincia');
        });
    }
};
