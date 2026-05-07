import Button from '../Components/atoms/Button.jsx';
import Layout from "../Template/LayaoutNav.jsx";
import Card from "../Components/atoms/Card.jsx"
import Input from '../Components/atoms/Input.jsx';
import { TaskHeader } from '../Components/molecules/TaskHeader.jsx';
export default function Test() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Test Atomic Design</h1>

      <Button variant="primary">
        Primary Button
      </Button>

      <Button variant="secondary">
        Secondary Button
      </Button>

        {/* <Layout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </Layout> */}


     {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              type="primary"
              title="Total de Tareas"
              value="24"
              description="↗ Aumentó desde el mes pasado"
            />

            <Card
              type="secondary"
              title="Tareas Pendientes"
              value="8"
              description="En revisión"
            />

            <Card
              type="secondary"
              title="Tareas Completadas"
              value="16"
              description="Finalizadas correctamente"
            />

            <Card
              type="secondary"
              title="Tareas en Proceso"
              value="5"
              description="Actualmente activas"
            />
          </div>

           <section className="space-y-3">
          <h2 className="text-xl font-semibold">Inputs</h2>

          <div className="max-w-sm space-y-4">
            <Input
              name="nombre"
              placeholder="Nombre de la tarea"
            />

            <Input
              type="date"
              name="fecha"
            />

            <Input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
            />

            <Input
              name="disabled"
              placeholder="Input deshabilitado"
              disabled
            />
          </div>
        </section> */}

        <TaskHeader/>
    </div>
  )
}