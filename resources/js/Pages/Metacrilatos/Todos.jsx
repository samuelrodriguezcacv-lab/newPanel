import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';
import { useFeedbackModal } from '../../Hooks/useFeedbackModal';

export default function Todos() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const { metacrilatos = [], tiposCentro = [] } = usePage().props;
    const [busqueda, setBusqueda] = useState('');
    const [tipo, setTipo] = useState('');

    const filtrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();

        return metacrilatos.filter((m) => {
            const coincideTipo = tipo ? m.tipo_centro === tipo : true;
            const texto = [
                m.codigo_registro,
                m.tipo_centro,
                m.tarea_logistica?.numero_tarea,
                m.pedido_metacrilato?.numero_pedido,
            ].filter(Boolean).join(' ').toLowerCase();

            return coincideTipo && (termino ? texto.includes(termino) : true);
        });
    }, [metacrilatos, busqueda, tipo]);

    const eliminar = async (id) => {
        const ok = await confirm({
            title: 'Eliminar metacrilato',
            message: 'Esta accion elimina el registro seleccionado. El resto del pedido se conserva.',
            tone: 'danger',
            confirmText: 'Eliminar',
        });
        if (!ok) return;

        router.delete(`/metacrilatos/${id}`, {
            preserveScroll: true,
            onSuccess: () => notify({
                title: 'Metacrilato eliminado',
                message: 'El registro se elimino correctamente.',
                tone: 'success',
            }),
        });
    };

    return (
        <Layout>
            {feedbackModal}
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Todos los metacrilatos</h1>
                        <p className="text-sm text-gray-500 mt-1">Busca por registro, tarea, pedido o tipo.</p>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                        {filtrados.length} registros
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Buscar</label>
                        <input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Registro, tarea o pedido"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">Todos</option>
                            {tiposCentro.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Pedido</th>
                                <th className="px-4 py-3 text-left">Tarea</th>
                                <th className="px-4 py-3 text-left">Tipo</th>
                                <th className="px-4 py-3 text-left">Registro</th>
                                <th className="px-4 py-3 text-left">Fecha</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">No hay resultados.</td>
                                </tr>
                            ) : filtrados.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{m.pedido_metacrilato?.numero_pedido ? `#${m.pedido_metacrilato.numero_pedido}` : 'Sin pedido'}</td>
                                    <td className="px-4 py-3">{m.tarea_logistica?.numero_tarea ?? 'Sin tarea'}</td>
                                    <td className="px-4 py-3">{m.tipo_centro}</td>
                                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">{m.codigo_registro}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(m.created_at).toLocaleDateString('es-ES')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <a href={`/metacrilatos/${m.id}/pdf`} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1">
                                                PDF
                                            </a>
                                            <button onClick={() => eliminar(m.id)} className="text-xs text-red-600 border border-red-200 rounded-lg px-3 py-1">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
