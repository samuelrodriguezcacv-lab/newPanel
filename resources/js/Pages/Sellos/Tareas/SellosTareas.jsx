import Layout from "../../../Template/LayaoutNav.jsx";
import Button from "../../../Components/atoms/button.jsx";
import Input from "../../../Components/atoms/Input.jsx";
import SelectorToggle from "../../../Components/atoms/SelectorToggle.jsx";
import { useState } from "react";

export default function SellosTarea() {
    const [tipoSello, setTipoSello] = useState('manual');
  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Tareas - Sellos
            </h1>
            <p className="text-gray-500 text-sm">
              Gestión de tareas, creación y asignación de sellos
            </p>
          </div>

        
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm text-gray-500">Nueva Tarea</h2>
            <Input> </Input>
              <Button variant="primary">
            Asignar Tarea
          </Button>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm text-gray-500">Crear o Agregar Sellos</h2>
            <p className="text-2xl font-bold">0</p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm text-gray-500">Pendientes</h2>
            <p className="text-2xl font-bold">0</p>
          </div>

        </div>


        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
     <div className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4">

  {/* TITULO (ocupa 2 columnas) */}
  <h2 className="text-sm text-gray-500 col-span-2">
    Crear o Agregar Sellos
  </h2>

  {/* INPUTS */}
  <Input placeholder="Prefijo Postal" />
  <Input placeholder="Número de Colegiado" />
  <Input placeholder="Nombre" />
  <Input placeholder="Apellido 1" />
  <Input placeholder="Apellido 2" />

  {/* SELECTOR (ocupa 2 columnas) */}
  <div className="col-span-2">
    <SelectorToggle
      value={tipoSello}
      onChange={setTipoSello}
      options={[
        { value: "manual", label: "Manual" },
        { value: "automatico", label: "Automático" },
      ]}
    />
  </div>

  {/* TEXTO INFO */}
  <p className="text-sm text-gray-500 col-span-2">
    Seleccionado: {tipoSello}
  </p>

</div>

                <div className="bg-white border rounded-xl p-6">

  <h2 className="text-lg font-semibold mb-4">
    Lista de Sellos
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">

      {/* CABECERA */}
      <thead className="text-gray-500 border-b">
        <tr>
          <th className="py-2">Código Generado</th>
          <th className="py-2">Nombre</th>
          <th className="py-2">Apellido 1</th>
          <th className="py-2">Apellido 2</th>
          <th className="py-2">Tipo de Sello</th>
          <th className="py-2">Cantidad</th>
        </tr>
      </thead>

      {/* CUERPO */}
      <tbody>

        <tr className="border-b hover:bg-gray-50">
          <td className="py-2 font-mono text-green-700">
            S-0001
          </td>
          <td className="py-2">Francisco Luis</td>
          <td className="py-2">Jurado</td>
          <td className="py-2">Martos</td>
          <td className="py-2">
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">
              Manual
            </span>
          </td>
          <td className="py-2 font-semibold">
            3
          </td>
        </tr>

        <tr className="border-b hover:bg-gray-50">
          <td className="py-2 font-mono text-green-700">
            S-0002
          </td>
          <td className="py-2">Ana María</td>
          <td className="py-2">López</td>
          <td className="py-2">García</td>
          <td className="py-2">
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg">
              Automático
            </span>
          </td>
          <td className="py-2 font-semibold">
            7
          </td>
        </tr>

      </tbody>

    </table>
  </div>

</div>
 

            
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">

  {/* HEADER */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">
      Pedido 203
    </h2>

    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
      Sellos agrupados por tarea
    </span>
  </div>

  {/* MANUAL */}
  <div className="space-y-3">

    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-blue-600">
        Manual
      </h3>
      <span className="text-xs text-gray-400">
        2 registros
      </span>
    </div>

    <div className="overflow-hidden rounded-xl border">

     <table className="w-full text-sm border-separate border-spacing-y-2 bg-[oklch(0.97_0.01_176.21)]">

        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Tarea</th>
            <th className="text-left px-4 py-3">Código</th>
            <th className="text-left px-4 py-3">Colegiado</th>
            <th className="text-left px-4 py-3">Nombre</th>
            <th className="text-left px-4 py-3">Apellidos</th>
          </tr>
        </thead>

        <tbody className="divide-y">

          <tr className="hover:bg-gray-50 transition bg-white">
            <td className="px-4 py-3 font-mono text-gray-700">T-001</td>
            <td className="px-4 py-3 font-mono text-green-700">S-1001</td>
            <td className="px-4 py-3">2591</td>
            <td className="px-4 py-3">Francisco</td>
            <td className="px-4 py-3">Jurado Martos</td>
          </tr>

          <tr className="hover:bg-gray-50 transition bg-white">
            <td className="px-4 py-3 font-mono text-gray-700">T-001</td>
            <td className="px-4 py-3 font-mono text-green-700">S-1002</td>
            <td className="px-4 py-3">2592</td>
            <td className="px-4 py-3">Ana</td>
            <td className="px-4 py-3">López García</td>
          </tr>

        </tbody>

      </table>

    </div>
  </div>

  {/* AUTOMÁTICO */}
  <div className="space-y-3">

    <h3 className="text-sm font-semibold text-purple-600">
      Automático
    </h3>

    <div className="overflow-hidden rounded-xl border">

     <table className="w-full text-sm border-separate border-spacing-y-2">

        <thead className="bg-gray-50 text-gray-500 text-xs uppercase gap-4"> 
          <tr>
            <th className="text-left px-4 py-3">Tarea</th>
            <th className="text-left px-4 py-3">Código</th>
            <th className="text-left px-4 py-3">Colegiado</th>
            <th className="text-left px-4 py-3">Nombre</th>
            <th className="text-left px-4 py-3">Apellidos</th>
          </tr>
        </thead>

        <tbody className="divide-y">

          <tr className="bg-white border rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200">
            <td className="px-4 py-3 font-mono text-gray-700">T-002</td>
            <td className="px-4 py-3 font-mono text-green-700">S-2001</td>
            <td className="px-4 py-3">3001</td>
            <td className="px-4 py-3">Carlos</td>
            <td className="px-4 py-3">Pérez Ruiz</td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>

</div>

      </div>


    </Layout>
  )
}