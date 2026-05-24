<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EnvioProveedores\ColegioVeterinarioModel;

class ColegiosVeterinariosSeeder extends Seeder
{
    public function run()
    {
        $items = [
            ['provincia' => 'Sevilla', 'nombre' => 'College of Veterinarians of Seville', 'direccion' => 'C. Tajo, 1, 41012 Sevilla', 'telefono' => '+34 954 41 03 58'],
            ['provincia' => 'Málaga', 'nombre' => 'Colegio Oficial de Veterinarios', 'direccion' => 'Pje. Esperanto, 1, Distrito Centro, 29007 Málaga', 'telefono' => '+34 952 39 17 90'],
            ['provincia' => 'Jaén', 'nombre' => 'Colegio Oficial de Veterinarios de Jaén', 'direccion' => 'C. Cruz Roja Española, 6, 23007 Jaén', 'telefono' => '+34 953 25 51 18'],
            ['provincia' => 'Granada', 'nombre' => 'College of Veterinarians', 'direccion' => 'Calle Dr. Jaime García Royo, s/n, Beiro, 18014 Granada', 'telefono' => '+34 958 27 84 74'],
            ['provincia' => 'Córdoba', 'nombre' => 'Colegio Oficial De Veterinarios', 'direccion' => 'Av. del Brillante, 69, Bajo, 14012 Córdoba', 'telefono' => '+34 957 76 78 55'],
            ['provincia' => 'Almería', 'nombre' => 'Colegio Oficial de Veterinarios de Almería', 'direccion' => 'C. Pamplona, 16, 04007 Almería', 'telefono' => '+34 950 25 06 66'],
            ['provincia' => 'Cádiz', 'nombre' => 'Colegio Oficial De Veterinarios', 'direccion' => 'Av. Ana de Viya, 5, 11009 Cádiz', 'telefono' => '+34 956 25 49 51'],
            ['provincia' => 'Huelva', 'nombre' => 'Colegio Oficial De Veterinarios De Huelva', 'direccion' => 'C. Arcipreste Manuel González García, 11, 21003 Huelva', 'telefono' => '+34 959 24 11 94'],
        ];

        foreach ($items as $data) {
            ColegioVeterinarioModel::updateOrCreate(
                ['nombre' => $data['nombre']],
                [
                    'provincia' => $data['provincia'],
                    'direccion' => $data['direccion'],
                    'telefono' => $data['telefono'],
                ]
            );
        }
    }
}
