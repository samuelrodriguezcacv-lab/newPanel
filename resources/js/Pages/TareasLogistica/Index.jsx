import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';

const COLORES = {
    sellos:      { bg: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-700',     icon: '🔵' },
    metacrilato: { bg: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700', icon: '🟣' },
    anulacion:   { bg: 'bg-red-600',    badge: 'bg-red-100 text-red-700',       icon: '🔴' },
    devolucion:  { bg: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', icon: '🟠' },
    carnets:     { bg: 'bg-green-600',  badge: 'bg-green-100 text-green-700',   icon: '🟢' },
    otro:        { bg: 'bg-gray-600',   badge: 'bg-gray-100 text-gray-700',     icon: '⚪' },
};

const TIPOS = {
    sellos: 'Sellos', metacrilato: 'Metacrilato', anulacion: 'Anulación',
    devolucion: 'Devolución', carnets: 'Carnets', otro: 'Otro',
};

const ESTADOS = {
    pendiente: 'Pendiente', en_proceso: 'En proceso', completada: 'Completada',
};

const ESTADO_COLORES = {
    pendiente:  'bg-yellow-100 text-yellow-700',
    en_proceso: 'bg-blue-100 text-blue-700',
    completada: 'bg-green-100 text-green-700',
};

const ESTADO_ICONOS = {
    pendiente: '⏳', en_proceso: '🔄', completada: '✅',
};

export default function Index() {
    const { tareas } = usePage().props;

    const [modalAbierto, setModalAbierto] = useState(false);
    const [form, setForm] = useState({
        numero_tarea: '', tipo: 'sellos', descripcion: '', tarea_sellos: ''
    });
    const [errors, setErrors] = useState({});

    // Aplanar tareas para estadísticas
    const todasLasTareas = Object.values(tareas).flat();
    const total      = todasLasTareas.length;
    const pendientes = todasLasTareas.filter(t => t.estado === 'pendiente').length;
    const enProceso  = todasLasTareas.filter(t => t.estado === 'en_proceso').length;
    const completadas = todasLasTareas.filter(t => t.estado === 'completada').length;

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/tareas-logistica', form, {
            onError: (err) => setErrors(err),
            onSuccess: () => {
                setModalAbierto(false);
                setForm({ numero_tarea: '', tipo: 'sellos', descripcion: '', tarea_sellos: '' });
                setErrors({});
            },
        });
    };

    const cambiarEstado = (id, estado) => {
        router.put(`/tareas-logistica/${id}`, { estado });
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar esta tarea?')) {
            router.delete(`/tareas-logistica/${id}`);
        }
    };

    return (
        <Layout>
            <div className="p-6">

                {/* RESUMEN */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total tareas',  valor: total,      color: 'text-gray-800' },
                        { label: 'Pendientes',    valor: pendientes,  color: 'text-yellow-500' },
                        { label: 'En proceso',    valor: enProceso,   color: 'text-blue-500' },
                        { label: 'Completadas',   valor: completadas, color: 'text-green-500' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className={`text-3xl font-bold ${item.color}`}>{item.valor}</p>
                        </div>
                    ))}
                </div>

                {/* BOTÓN NUEVA TAREA */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                        + Nueva tarea
                    </button>
                </div>

                {/* TAREAS AGRUPADAS */}
                {Object.keys(tareas).length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center text-gray-400 shadow">
                        <p className="text-4xl mb-3">📋</p>
                        <p>No hay tareas registradas todavía</p>
                        <p className="text-sm mt-1">Pulsa "+ Nueva tarea" para empezar</p>
                    </div>
                ) : (
                    Object.entries(tareas).map(([tipo, listaTareas]) => {
                        const color = COLORES[tipo] ?? COLORES['otro'];
                        return (
                            <div key={tipo} className="mb-6">
                                {/* CABECERA GRUPO */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">{color.icon}</span>
                                    <h3 className="font-bold text-gray-700">{TIPOS[tipo] ?? tipo}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color.badge}`}>
                                        {listaTareas.length} tareas
                                    </span>
                                </div>

                                {/* TABLA */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className={`${color.bg} text-white`}>
                                            <tr>
                                                <th className="px-4 py-3 text-left">Nº Tarea</th>
                                                <th className="px-4 py-3 text-left">Descripción</th>
                                                <th className="px-4 py-3 text-left">Estado</th>
                                                <th className="px-4 py-3 text-left">Fecha</th>
                                                <th className="px-4 py-3 text-left">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaTareas.map(tarea => (
                                                <tr key={tarea.id} className="border-t hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-bold text-gray-800">
                                                        # {tarea.numero_tarea}
                                                      {tarea.tipo === 'sellos' && tarea.tarea_sellos && (
    <a href={`/sellos/tareas?tarea=${tarea.tarea_sellos}`}
       className="ml-2 text-xs text-blue-500 hover:underline">
        Ver sellos →
    </a>
)}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{tarea.descripcion ?? '—'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_COLORES[tarea.estado]}`}>
                                                            {ESTADO_ICONOS[tarea.estado]} {ESTADOS[tarea.estado]}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-400 text-xs">
                                                        {new Date(tarea.created_at).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2 items-center">
                                                            {/* CAMBIAR ESTADO */}
                                                            <select
                                                                value={tarea.estado}
                                                                onChange={e => cambiarEstado(tarea.id, e.target.value)}
                                                                className="border rounded p-1 text-xs text-gray-600">
                                                                {Object.entries(ESTADOS).map(([valor, label]) => (
                                                                    <option key={valor} value={valor}>{label}</option>
                                                                ))}
                                                            </select>

                                                            {/* ELIMINAR */}
                                                            <button
                                                                onClick={() => eliminar(tarea.id)}
                                                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* MODAL NUEVA TAREA */}
                {modalAbierto && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Nueva tarea</h3>
                                <button onClick={() => setModalAbierto(false)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Número de tarea</label>
                                    <input
                                        type="text"
                                        value={form.numero_tarea}
                                        onChange={e => setForm({...form, numero_tarea: e.target.value})}
                                        placeholder="Ej: 7693"
                                        className="border p-2 w-full rounded text-sm"/>
                                    {errors.numero_tarea && <p className="text-red-500 text-xs mt-1">{errors.numero_tarea}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Tipo</label>
                                    <select
                                        value={form.tipo}
                                        onChange={e => setForm({...form, tipo: e.target.value})}
                                        className="border p-2 w-full rounded text-sm">
                                        {Object.entries(TIPOS).map(([valor, label]) => (
                                            <option key={valor} value={valor}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Descripción</label>
                                    <input
                                        type="text"
                                        value={form.descripcion}
                                        onChange={e => setForm({...form, descripcion: e.target.value})}
                                        placeholder="Ej: 10 sellos para Sevilla"
                                        className="border p-2 w-full rounded text-sm"/>
                                </div>

                                {form.tipo === 'sellos' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Vincular con tarea de sellos</label>
                                        <input
                                            type="text"
                                            value={form.tarea_sellos}
                                            onChange={e => setForm({...form, tarea_sellos: e.target.value})}
                                            placeholder="Ej: 7693"
                                            className="border p-2 w-full rounded text-sm"/>
                                        <p className="text-xs text-gray-400 mt-1">Número de tarea del módulo de Sellos</p>
                                    </div>
                                )}

                                <div className="flex gap-3 justify-end mt-6">
                                    <button type="button"
                                            onClick={() => setModalAbierto(false)}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                                        Cancelar
                                    </button>
                                    <button type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700">
                                        Guardar
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