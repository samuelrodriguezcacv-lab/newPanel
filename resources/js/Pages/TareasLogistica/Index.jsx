import React, { useState } from 'react';
import Layout from '../../Template/LayaoutNav';
import { router } from '@inertiajs/react'; // Importamos el router nativo de Inertia

const COLORES = {
    sellos:      { bg: 'bg-blue-600',   border: 'border-blue-100',   badge: 'bg-blue-50 text-blue-700',     icon: '🔵' },
    metacrilato: { bg: 'bg-purple-600', border: 'border-purple-100', badge: 'bg-purple-50 text-purple-700', icon: '🟣' },
    anulacion:   { bg: 'bg-red-600',    border: 'border-red-100',    badge: 'bg-red-50 text-red-700',       icon: '🔴' },
    devolucion:  { bg: 'bg-orange-500', border: 'border-orange-100', badge: 'bg-orange-50 text-orange-700', icon: '🟠' },
    carnets:     { bg: 'bg-green-600',  border: 'border-green-100',  badge: 'bg-green-50 text-green-700',   icon: '🟢' },
    otro:        { bg: 'bg-gray-600',   border: 'border-gray-100',   badge: 'bg-gray-50 text-gray-700',     icon: '⚪' },
};

const ESTADOS = {
    pendiente: 'Pendiente', en_proceso: 'En proceso', completada: 'Completada',
};

const ESTADO_ESTILOS = {
    pendiente:  'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-200',
    en_proceso: 'bg-sky-50 text-sky-800 border-sky-200 focus:ring-sky-200',
    completada: 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-200',
};

// Recibimos "tareas" directamente como Prop desde Laravel
export default function TareasLogistica({ tareas = {} }) {
    
    // Aseguramos que todas las llaves existan por defecto para evitar errores de renderizado
    const tareasSeguras = {
        sellos: tareas.sellos ?? [],
        metacrilato: tareas.metacrilato ?? [],
        anulacion: tareas.anulacion ?? [],
        devolucion: tareas.devolucion ?? [],
        carnets: tareas.carnets ?? [],
        otro: tareas.otro ?? []
    };

    const [modalAbierto, setModalAbierto] = useState(false);
    const [seccionesAbiertas, setSeccionesAbiertas] = useState(Object.keys(COLORES));
    
    const estadoInicialForm = { numero_tarea: '', tipo: 'sellos', descripcion: '', tarea_sellos: '', provincia: '' };
    const [form, setForm] = useState(estadoInicialForm);
    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);

    const todasLasTareas = Object.values(tareasSeguras).flat();

    const toggleSeccion = (tipo) =>
        setSeccionesAbiertas(prev =>
            prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
        );

    // Cambio de estado usando Inertia router
    const handleCambioEstado = (tareaId, nuevoEstado) => {
        router.put(`/tareas-logistica/${tareaId}`, { estado: nuevoEstado }, {
            preserveScroll: true, // Evita que la pantalla salte al recargar
        });
    };

    // Eliminar usando Inertia router
    const handleEliminar = (tareaId) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        router.delete(`/tareas-logistica/${tareaId}`, {
            preserveScroll: true,
        });
    };

    // Crear usando Inertia router
    const handleSubmit = (e) => {
        e.preventDefault();
        setGuardando(true);
        setErrors({});

        router.post('/tareas-logistica', form, {
            preserveScroll: true,
            onSuccess: () => {
                setModalAbierto(false);
                setForm(estadoInicialForm);
            },
            onError: (err) => {
                setErrors(err);
            },
            onFinish: () => {
                setGuardando(false);
            }
        });
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-[1600px] mx-auto p-2">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Logística</h1>
                        <p className="text-slate-500 text-sm mt-1">Panel operativo de monitoreo y control de flujos</p>
                    </div>
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-sm">
                        <span className="text-base">+</span> Nueva Tarea
                    </button>
                </div>

                {/* MÉTRICAS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total asignadas', val: todasLasTareas.length,                       estilo: 'border-slate-200 bg-white' },
                        { label: 'Tareas pendientes',  val: todasLasTareas.filter(t => t.estado === 'pendiente').length,  estilo: 'border-l-4 border-amber-500 bg-white' },
                        { label: 'En Proceso operativo',  val: todasLasTareas.filter(t => t.estado === 'en_proceso').length, estilo: 'border-l-4 border-sky-500 bg-white' },
                        { label: 'Entregadas / Completadas', val: todasLasTareas.filter(t => t.estado === 'completada').length, estilo: 'border-l-4 border-emerald-500 bg-white' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.estilo} p-5 rounded-2xl shadow-sm border`}>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{stat.val}</p>
                        </div>
                    ))}
                </div>

                {/* LISTADO */}
                {todasLasTareas.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200 shadow-sm max-w-xl mx-auto my-10">
                        <div className="text-6xl mb-4 bg-slate-50 w-20 h-20 flex items-center justify-center rounded-2xl mx-auto shadow-inner">📦</div>
                        <h3 className="text-lg font-bold text-slate-900 mt-4">No hay tareas pendientes</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">La bandeja logística está limpia. Todo se encuentra al día por aquí.</p>
                    </div>
                ) : (
                    Object.entries(tareasSeguras).map(([tipo, listaTareas]) => {
                        if (listaTareas.length === 0) return null;
                        const config = COLORES[tipo] || COLORES.otro;
                        const estaAbierto = seccionesAbiertas.includes(tipo);

                        return (
                            <div key={tipo} className={`bg-white rounded-2xl border ${config.border} shadow-sm overflow-hidden transition-all duration-200`}>
                                
                                {/* CABECERA SECCIÓN */}
                                <div 
                                    onClick={() => toggleSeccion(tipo)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 border-b border-inherit cursor-pointer select-none transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">{config.icon}</span>
                                        <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs md:text-sm">
                                            {tipo.replace('_', ' ')}
                                        </h3>
                                        <span className={`text-xs px-3 py-1 rounded-full font-black tracking-wide ${config.badge} shadow-sm border border-inherit`}>
                                            {listaTareas.length}
                                        </span>
                                    </div>
                                    <span className={`text-slate-400 font-bold transition-transform duration-200 p-1 ${estaAbierto ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>

                                {/* CONTENEDOR DE TARJETAS */}
                                {estaAbierto && (
                                    <div className="p-4 bg-slate-50/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {listaTareas.map(tarea => (
<div 
    key={tarea.id}
    className={`border rounded-xl p-4 flex flex-col justify-between gap-4 shadow-sm hover:shadow transition-all group ${
        tarea.estado === 'completada'
            ? 'bg-emerald-50 border-emerald-200 opacity-75'
            : 'bg-white border-slate-100 hover:border-slate-200'
    }`}>
    
    {/* ID Tarea & Enlace Dinámico */}
    <div className="flex justify-between items-start">
        <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg shadow-sm ${
            tarea.estado === 'completada'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white'
        }`}>
            #{tarea.numero_tarea}
        </span>

        {/* ENLACE SELLOS */}
{tarea.tipo === 'sellos' && tarea.estado !== 'completada' && (
    <a 
        href={`/sellos/pedidos/nuevo-pedido?tarea=${tarea.numero_tarea}&provincia=${tarea.provincia || ''}&tarea_logistica_id=${tarea.id}`}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
    >
        Ir a Sellos <span>→</span>
    </a>
)}

        {/* ENLACE METACRILATOS */}
            {tarea.tipo === 'metacrilato' && tarea.estado !== 'completada' && (
                <a 
                    href={`/metacrilatos?tarea_logistica_id=${tarea.id}`}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    Ir a Metacrilatos <span>→</span>
                </a>
            )}

        {/* COMPLETADA */}
        {tarea.estado === 'completada' && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg">
                ✅ Completada
            </span>
        )}
    </div>

    {/* Descripción */}
    <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {tarea.descripcion || <span className="text-slate-300 italic">Sin descripción adjunta</span>}
    </p>

    {/* Barra de Acciones */}
    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 gap-2">
        <div className="w-40">
            <select
                value={tarea.estado}
                onChange={e => handleCambioEstado(tarea.id, e.target.value)}
                className={`text-xs font-bold w-full px-2.5 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all cursor-pointer ${ESTADO_ESTILOS[tarea.estado]}`}>
                {Object.entries(ESTADOS).map(([k, v]) =>
                    <option key={k} value={k} className="bg-white text-slate-800 font-medium">{v}</option>
                )}
            </select>
        </div>

        <button
            onClick={() => handleEliminar(tarea.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Eliminar tarea">
            🗑️
        </button>
    </div>
</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {/* MODAL NUEVA TAREA */}
                {modalAbierto && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-extrabold text-slate-900 tracking-tight">Crear Nueva Tarea</h3>
                                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">Número de Tarea</label>
                                    <input
                                        type="text"
                                        value={form.numero_tarea}
                                        onChange={e => setForm({...form, numero_tarea: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-sm outline-none transition-all"
                                        placeholder="Ej: 8842"/>
                                    {errors.numero_tarea && <p className="text-red-500 text-xs font-semibold mt-1 ml-1">⚠️ {errors.numero_tarea}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">Tipo de Flujo</label>
                                        <select
                                            value={form.tipo}
                                            onChange={e => setForm({...form, tipo: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-sm outline-none transition-all font-semibold text-slate-700 cursor-pointer">
                                            {Object.entries(COLORES).map(([k]) =>
                                                <option key={k} value={k}>{k.toUpperCase()}</option>
                                            )}
                                        </select>
                                    </div>
                                    
                                    {form.tipo === 'sellos' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">ID Referente</label>
                                            <input
                                                type="text"
                                                value={form.tarea_sellos}
                                                onChange={e => setForm({...form, tarea_sellos: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-sm outline-none transition-all"
                                                placeholder="Opcional"/>
                                        </div>
                                    )}
                                </div>

                                {form.tipo === 'sellos' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">Provincia Destino</label>
                                        <select
                                            value={form.provincia}
                                            onChange={e => setForm({...form, provincia: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-sm outline-none transition-all font-semibold text-slate-700 cursor-pointer">
                                            <option value="">Selecciona provincia</option>
                                            <option value="4">Almería</option>
                                            <option value="11">Cádiz</option>
                                            <option value="14">Córdoba</option>
                                            <option value="18">Granada</option>
                                            <option value="21">Huelva</option>
                                            <option value="23">Jaén</option>
                                            <option value="29">Málaga</option>
                                            <option value="41">Sevilla</option>
                                        </select>
                                        {errors.provincia && <p className="text-red-500 text-xs font-semibold mt-1 ml-1">⚠️ {errors.provincia}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">Descripción Operativa</label>
                                    <textarea
                                        value={form.descripcion}
                                        onChange={e => setForm({...form, descripcion: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-sm outline-none transition-all resize-none"
                                        rows="3"
                                        placeholder="Escribe aquí los detalles o comentarios de la tarea..."/>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                                    <button type="button" onClick={() => setModalAbierto(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={guardando}
                                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-xl transition-all text-sm disabled:opacity-50">
                                        {guardando ? 'Guardando...' : 'Guardar Tarea'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}