import Layout from "../../../Template/LayaoutNav.jsx";
import Card from "../../../Components/atoms/Card.jsx";
import MicrochipLoadingIcon from "../../../Components/atoms/MicrochipLoadingIcon.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDashboardSellos } from "../../../Hooks/useDashboardSellos.jsx";

const COLORES = ["#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

export default function DashboardSellos() {
    const { metricas, cargando, tareaActiva, setTareaActiva, datosGrafico } = useDashboardSellos();

    return (
        <Layout title="Dashboard Sellos" subtitle="Metricas en tiempo real del circuito de sellos">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    {tareaActiva && (
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                            <div>
                                <p className="text-xs text-blue-500 font-semibold uppercase">Tarea activa</p>
                                <p className="text-lg font-bold text-blue-700">#{tareaActiva}</p>
                            </div>

                            <a href="/sellos/pedidos/nuevo-pedido" className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 font-medium">
                                + Anadir sellos
                            </a>
                            <button onClick={() => setTareaActiva(null)} className="text-blue-300 hover:text-blue-500 text-lg">x</button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                    <Card type="primary" title="Total de Sellos" value={cargando ? <MicrochipLoadingIcon size={34} label="Cargando total de sellos" /> : metricas.total_sellos} description="Sellos registrados"/>
                    <Card type="secondary" title="Pedidos este mes" value={cargando ? <MicrochipLoadingIcon size={34} label="Cargando pedidos del mes" /> : metricas.total_pedidos} description="Pedidos del mes actual"/>
                    <Card type="secondary" title="Sellos Repetidos" value={cargando ? <MicrochipLoadingIcon size={34} label="Cargando sellos repetidos" /> : metricas.sellos_repetidos} description="Con coste adicional"/>
                    <Card type="secondary" title="Sellos Manuales" value={cargando ? <MicrochipLoadingIcon size={34} label="Cargando sellos manuales" /> : metricas.total_manuales} description="Tipo manual"/>
                    <Card type="secondary" title="Sellos Automaticos" value={cargando ? <MicrochipLoadingIcon size={34} label="Cargando sellos automaticos" /> : metricas.total_automaticos} description="Tipo automatico"/>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs text-green-600 uppercase font-semibold">Pedidos Abiertos</p>
                        <p className="text-3xl font-bold text-green-700">{cargando ? <MicrochipLoadingIcon size={26} label="Cargando pedidos abiertos" /> : metricas.pedidos_abiertos}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-xs text-red-600 uppercase font-semibold">Pedidos Cerrados</p>
                        <p className="text-3xl font-bold text-red-700">{cargando ? <MicrochipLoadingIcon size={26} label="Cargando pedidos cerrados" /> : metricas.pedidos_cerrados}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-blue-600 uppercase font-semibold">Pedidos Enviados</p>
                        <p className="text-3xl font-bold text-blue-700">{cargando ? <MicrochipLoadingIcon size={26} label="Cargando pedidos enviados" /> : metricas.pedidos_enviados}</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-slate-950">
                        Sellos por provincia
                        {tareaActiva && <span className="ml-2 text-sm font-normal text-blue-500">- Tarea #{tareaActiva}</span>}
                    </h2>
                    {cargando ? (
                        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                            <MicrochipLoadingIcon size={20} label="Cargando grafico" />
                            Cargando grafico...
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={datosGrafico} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <XAxis dataKey="provincia" tick={{ fontSize: 11 }}/>
                                <YAxis tick={{ fontSize: 11 }}/>
                                <Tooltip/>
                                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                    {datosGrafico.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]}/>) }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </Layout>
    );
}
