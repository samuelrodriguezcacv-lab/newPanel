import Layout from "../../Template/LayaoutNav.jsx";
import Card from "../../Components/atoms/Card.jsx";

export default function DashboardSellos() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Dashboard Sellos
          </h1>

          <p className="text-sm text-slate-500">
            Gestión y seguimiento de sellos registrados.
          </p>
        </div>

        <div className="grid grid-cols-4  md:grid-cols-2 xl:grid-cols-2">
          <Card
            type="primary"
            title="Total de Sellos"
            value="24"
            description="Sellos registrados"
          />

          <Card
            type="secondary"
            title="Total de Pedidos"
            value="203"
            description="Actualmente en uso"
          />

          <Card
            type="secondary"
            title="Ultima Tarea"
            value="#1485"
            description="Pendientes de revisión"
          />

          <Card
            type="secondary"
            title="Sellos Manuales"
            value="12"
            description="Fuera de uso"
          />
            <Card
            type="secondary"
            title="Sellos Automáticos"
            value="12"
            description="Fuera de uso"
          />
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Herramientas de Sellos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Aquí construiremos los formularios, filtros y tabla de sellos.
          </p>
        </div>
      </div>
    </Layout>
  );
}