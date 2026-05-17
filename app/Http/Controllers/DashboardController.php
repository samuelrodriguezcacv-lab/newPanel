<?php

namespace App\Http\Controllers;

use App\Models\TareaLogistica;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $total = TareaLogistica::count();
        $pendiente = TareaLogistica::where('estado', 'pendiente')->count();
        $enProceso = TareaLogistica::where('estado', 'en_proceso')->count();
        $completada = TareaLogistica::where('estado', 'completada')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total'      => $total,
                'pendiente'  => $pendiente,
                'en_proceso' => $enProceso,
                'completada' => $completada,
            ]
        ]);
    }
}