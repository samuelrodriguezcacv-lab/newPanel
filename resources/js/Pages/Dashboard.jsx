import Layout from '../Template/LayaoutNav.jsx';
import { Head, Link } from '@inertiajs/react';

const CONFIG_ESTADOS = {
    total: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '📦' },
    pendiente: { bg: 'bg-amber-50', text: 'text-amber-600', icon: '⏳' },
    en_proceso: { bg: 'bg-sky-50', text: 'text-sky-600', icon: '⚡' },
    completada: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '✅' },
};

// Recibimos las estadísticas acumuladas desde Laravel
export default function Dashboard({ stats = { total: 0, pendiente: 0, en_proceso: 0, completada: 0 } }) {
    
    const tarjetas = [
        { id: 'total', label: 'Total Tareas', valor: stats.total },
        { id: 'pendiente', label: 'Tareas Pendientes', valor: stats.pendiente },
        { id: 'en_proceso', label: 'En Proceso', valor: stats.en_proceso },
        { id: 'completada', label: 'Completadas', valor: stats.completada },
    ];

    return (
        <Layout>
            <Head title="Dashboard Logística" />

            <div className="space-y-6">
                
                {/* CABECERA INTERNA DEL PANEL */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Panel de Control Logístico
                        </h2>
                        <p className="text-slate-500 text-sm mt-0.5">Monitoreo y rendimiento de la operativa</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                        Tiempo real
                    </span>
                </div>

                {/* TARJETA DE BIENVENIDA Y ACCESO RÁPIDO */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">¡Hola de nuevo! 👋</h3>
                        <p className="text-slate-500 text-sm mt-0.5">Aquí tienes la actividad actual de tus tareas logísticas.</p>
                    </div>
                    <Link 
                        href="/tareas-logistica" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
                    >
                        Ir a Gestión de Tareas →
                    </Link>
                </div>

                {/* REJILLA DE ESTADÍSTICAS (MÉTRICAS) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {tarjetas.map((tarjeta) => {
                        const config = CONFIG_ESTADOS[tarjeta.id];
                        return (
                            <div 
                                key={tarjeta.id} 
                                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all"
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {tarjeta.label}
                                    </p>
                                    <p className="text-3xl font-black text-slate-800 tracking-tight">
                                        {tarjeta.valor}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 ${config.bg} ${config.text} rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform`}>
                                    {config.icon}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SECCIÓN DE RESUMEN Y AVANCES DE RENDIMIENTO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Barra de Progreso */}
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Resumen de Operaciones</h4>
                        <div className="border-t border-slate-100 pt-3 space-y-2">
                            <p className="text-slate-600 text-sm">
                                El porcentaje de efectividad actual (tareas completadas) es del{' '}
                                <span className="font-bold text-emerald-600">
                                    {stats.total > 0 ? ((stats.completada / stats.total) * 100).toFixed(0) : 0}%
                                </span>.
                            </p>
                            
                            {/* Barra de progreso visual */}
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full transition-all duration-500" 
                                    style={{ width: `${stats.total > 0 ? (stats.completada / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Caja de Acción Invertida (Azul Oscuro) */}
                    <div className="bg-indigo-950 text-indigo-100 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-white text-base">¿Falta registrar algo?</h4>
                            <p className="text-indigo-200 text-xs mt-1">
                                Genera un nuevo lote de sellos, carnets o anulaciones directamente en tu panel principal.
                            </p>
                        </div>
                        <Link 
                            href="/tareas-logistica"
                            className="bg-white/10 hover:bg-white/20 text-white text-center font-semibold text-xs py-2.5 rounded-xl transition-colors block"
                        >
                            + Crear Tarea Nueva
                        </Link>
                    </div>

                </div>

            </div>
        </Layout>
    );
}