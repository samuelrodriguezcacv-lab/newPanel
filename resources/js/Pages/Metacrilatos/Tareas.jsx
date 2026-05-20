import React, { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';

const PROVINCIAS = {
    4: 'Almeria',
    11: 'Cadiz',
    14: 'Cordoba',
    18: 'Granada',
    21: 'Huelva',
    23: 'Jaen',
    29: 'Malaga',
    41: 'Sevilla',
};

export default function Tareas() {
    const { tareas = [] } = usePage().props;
    const [estado, setEstado] = useState('');
    const [provincia, setProvincia] = useState('');

    const tareasFiltradas = useMemo(() => {
        return tareas.filter((tarea) => {
            const coincideEstado = estado ? tarea.estado === estado : true;
            const coincideProvincia = provincia ? String(tarea.provincia) === String(provincia) : true;

            return coincideEstado && coincideProvincia;
        });
    }, [tareas, estado, provincia]);

    return (
        <Layout>
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tareas de metacrilatos</h1>
                    <p className="text-sm text-gray-500 mt-1">Revisa las tareas logisticas y sus metacrilatos asociados.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="en_proceso">En proceso</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Provincia</label>
                        <select value={provincia} onChange={(e) => setProvincia(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">Todas</option>
                            {Object.entries(PROVINCIAS).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Tarea</th>
                                <th className="px-4 py-3 text-left">Provincia</th>
                                <th className="px-4 py-3 text-left">Estado</th>
                                <th className="px-4 py-3 text-left">Metacrilatos</th>
                                <th className="px-4 py-3 text-left">Pedidos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tareasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-8">No hay tareas de metacrilatos.</td>
                                </tr>
                            ) : tareasFiltradas.map((tarea) => {
                                const pedidos = [...new Set((tarea.metacrilatos ?? []).map((m) => m.pedido_metacrilato?.numero_pedido).filter(Boolean))];

                                return (
                                    <tr key={tarea.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold">{tarea.numero_tarea}</td>
                                        <td className="px-4 py-3">{PROVINCIAS[tarea.provincia] ?? tarea.provincia ?? '-'}</td>
                                        <td className="px-4 py-3">{tarea.estado}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-emerald-50 text-emerald-700 rounded-md px-2.5 py-1 text-xs">
                                                {tarea.metacrilatos?.length ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {pedidos.length ? pedidos.map((p) => `#${p}`).join(', ') : 'Sin pedido'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
