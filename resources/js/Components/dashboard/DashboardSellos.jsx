import Layout from "../Template/LayaoutNav.jsx";
import Card from "../Components/atoms/Card.jsx";

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Resumen general del sistema.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            description="Finalizadas"
          />

          <Card
            type="secondary"
            title="Tareas en Proceso"
            value="5"
            description="Actualmente activas"
          />
        </div>
      </div>
    </Layout>
  );
}