<?php

use App\Http\Controllers\PlantillaEnvioController;
use Illuminate\Support\Facades\Route;

Route::prefix('plantilla-envio')->name('plantilla-envio.')->group(function () {
    Route::get('/', [PlantillaEnvioController::class, 'index'])->name('index');
    Route::post('/exportar', [PlantillaEnvioController::class, 'export'])->name('exportar');
});
