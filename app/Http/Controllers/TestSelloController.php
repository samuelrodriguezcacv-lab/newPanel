<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SellosService;
use App\Services\SelloDataSanitizer;

class TestSelloController extends Controller
{
    public function test(Request $request, SellosService $service)
    {
        $datos = [
            'prefijo_postal' => '41',
            'codigo_postal'  => '2591',
            'nombre'         => 'ss ssLuis',
            'apellido1'      => 'Jurado',
            'apellido2'      => 'Martos',
            'tipo_sello'     => 'manual',
        ];

        // 🧹 LIMPIEZA CENTRALIZADA
        $datos = SelloDataSanitizer::sanitize($datos);

        $sello = $service->resolverSello($datos);

        return response()->json($sello);
    }
}