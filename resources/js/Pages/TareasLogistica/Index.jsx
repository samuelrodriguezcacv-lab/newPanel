import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';

const COLORES = {
    sellos:      { bg: 'bg-blue-600',  border: 'border-blue-200',  badge: 'bg-blue-50 text-blue-700',     icon: '🔵' },
    metacrilato: { bg: 'bg-purple-600', border: 'border-purple-200', badge: 'bg-purple-50 text-purple-700', icon: '🟣' },
    anulacion:   { bg: 'bg-red-600',    border: 'border-red-200',    badge: 'bg-red-50 text-red-700',       icon: '🔴' },
    devolucion:  { bg: 'bg-orange-500', border: 'border-orange-200', badge: 'bg-orange-50 text-orange-700', icon: '🟠' },
    carnets:     { bg: 'bg-green-600',  border: 'border-green-200',  badge: 'bg-green-50 text-green-700',   icon: '🟢' },
    otro:        { bg: 'bg-gray-600',   border: 'border-gray-200',   badge: 'bg-gray-50 text-gray-700',     icon: '⚪' },
};

const ESTADOS = {
    pendiente: 'Pendiente', en_proceso: 'En proceso', completada: 'Completada',
};

const ESTADO_ESTILOS = {
    pendiente:   'bg-amber-50 text-amber-700 border-amber-200',
    en_proceso:  'bg-sky-50 text-sky-700 border-sky-200',
    completada:  'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function Index() {
    const { tareas } = usePage().props;
    const [modalAbierto, setModalAbierto] = useState(false);
    const [seccionesAbiertas, setSeccionesAbiertas] = useState(Object.keys(tareas));
    const [form, setForm] = useState({ numero_tarea: '', tipo: 'sellos', descripcion: '', tarea_sellos: '' });
    const [errors, setErrors] = useState({});

    const todasLasTareas = Object.values(tareas).flat();
    
    const toggleSeccion = (tipo) => {
        setSeccionesAbiertas(prev => 
            prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/tareas-logistica', form, {
            onSuccess: () => {
                setModalAbierto(false);
                setForm({ numero_tarea: '', tipo: 'sellos', descripcion: '', tarea_sellos: '' });
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-4 lg:p-8 bg-gray-50 min-h-screen">
                
                {/* HEADER & STATS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Logística</h1>
                        <p className="text-gray-500 text-sm">Monitoreo y control de tareas operativas</p>
                    </div>
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium"
                    >
                        <span>+</span> Nueva Tarea
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total', val: todasLasTareas.length, color: 'bg-white' },
                        { label: 'Pendientes', val: todasLasTareas.filter(t => t.estado === 'pendiente').length, color: 'border-l-4 border-amber-400 bg-white' },
                        { label: 'En Proceso', val: todasLasTareas.filter(t => t.estado === 'en_proceso').length, color: 'border-l-4 border-sky-400 bg-white' },
                        { label: 'Completadas', val: todasLasTareas.filter(t => t.estado === 'completada').length, color: 'border-l-4 border-emerald-400 bg-white' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} p-4 rounded-2xl shadow-sm border border-gray-100`}>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.val}</p>
                        </div>
                    ))}
                </div>

                {/* LISTADO */}
                {Object.keys(tareas).length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900">No hay tareas pendientes</h3>
                        <p className="text-gray-500">Todo está al día por aquí.</p>
                    </div>
                ) : (
                    Object.entries(tareas).map(([tipo, listaTareas]) => {
                        const config = COLORES[tipo] || COLORES.otro;
                        const estaAbierto = seccionesAbiertas.includes(tipo);

                        return (
                            <div key={tipo} className="mb-6 overflow-hidden">
                                <button 
                                    onClick={() => toggleSeccion(tipo)}
                                    className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{config.icon}</span>
                                        <h3 className="font-bold text-gray-700 uppercase tracking-tight text-sm">
                                            {tipo.replace('_', ' ')}
                                        </h3>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${config.badge}`}>
                                            {listaTareas.length}
                                        </span>
                                    </div>
                                    <span className={`transform transition-transform ${estaAbierto ? 'rotate-180' : ''}`}>▼</span>
                                </button>

                                {estaAbierto && (
                                    <div className="mt-3 grid gap-3">
                                        <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-semibold text-gray-400 uppercase">
                                            <div className="col-span-2">Nº Tarea</div>
                                            <div className="col-span-5">Descripción</div>
                                            <div className="col-span-3">Estado</div>
                                            <div className="col-span-2 text-right">Acciones</div>
                                        </div>
                                        {listaTareas.map(tarea => (
                                            <div key={tarea.id} className="bg-white border border-gray-100 rounded-2xl p-4 md:px-6 md:py-3 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                                                <div className="md:col-span-2 flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">#{tarea.numero_tarea}</span>
                                                    {tarea.tipo === 'sellos' && (
                                                        <a href="/sellos" className="p-1 hover:bg-blue-50 rounded text-blue-500" title="Ver detalles">🔗</a>
                                                    )}
                                                </div>
                                                <div className="md:col-span-5 text-gray-600 text-sm italic">
                                                    {tarea.descripcion || <span className="text-gray-300">Sin descripción</span>}
                                                </div>
                                                <div className="md:col-span-3">
                                                    <select 
                                                        value={tarea.estado}
                                                        onChange={e => router.put(`/tareas-logistica/${tarea.id}`, { estado: e.target.value })}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 appearance-none cursor-pointer focus:outline-none transition-colors ${ESTADO_ESTILOS[tarea.estado]}`}
                                                    >
                                                        {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2 flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => confirm('¿Eliminar?') && router.delete(`/tareas-logistica/${tarea.id}`)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {/* MODAL (Simplificado visualmente) */}
                {modalAbierto && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-800">Crear Nueva Tarea</h3>
                                <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Número de Tarea</label>
                                    <input type="text" value={form.numero_tarea} onChange={e => setForm({...form, numero_tarea: e.target.value})} className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 text-sm transition-all" placeholder="Ej: 8842"/>
                                    {errors.numero_tarea && <p className="text-red-500 text-xs mt-1">{errors.numero_tarea}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tipo</label>
                                        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 text-sm">
                                            {Object.entries(COLORES).map(([k]) => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    {form.tipo === 'sellos' && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">ID Sellos</label>
                                            <input type="text" value={form.tarea_sellos} onChange={e => setForm({...form, tarea_sellos: e.target.value})} className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 text-sm" placeholder="Opcional"/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Descripción</label>
                                    <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 text-sm" rows="3" placeholder="Detalles de la tarea..."></textarea>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Guardar Tarea</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}