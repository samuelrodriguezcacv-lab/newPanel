import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';
import { useFeedbackModal } from '../../Hooks/useFeedbackModal';

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

export default function Pedidos() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const { pedidos = [] } = usePage().props;
    const [pedidoAbierto, setPedidoAbierto] = useState(null);
    const [estado, setEstado] = useState('');

    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((pedido) => estado ? pedido.estado === estado : true);
    }, [pedidos, estado]);

    const cerrarPedido = async (pedido) => {
        const ok = await confirm({
            title: 'Cerrar pedido',
            message: `Cerrar el pedido #${pedido.numero_pedido}? Los proximos metacrilatos entraran en un pedido nuevo.`,
            tone: 'warning',
            confirmText: 'Cerrar pedido',
        });
        if (!ok) return;

        router.post(`/metacrilatos/pedidos/${pedido.id}/cerrar`, {}, {
            preserveScroll: true,
            onSuccess: () => notify({
                title: 'Pedido cerrado',
                message: 'El pedido se cerro correctamente.',
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
                        <h1 className="text-2xl font-bold text-gray-900">Pedidos de metacrilatos</h1>
                        <p className="text-sm text-gray-500 mt-1">Consulta los pedidos y sus metacrilatos agrupados.</p>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                        {pedidosFiltrados.length} pedidos
                    </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Todos</option>
                        <option value="abierto">Abierto</option>
                        <option value="cerrado">Cerrado</option>
                        <option value="enviado">Enviado</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {pedidosFiltrados.length === 0 ? (
                        <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
                            No hay pedidos de metacrilatos.
                        </div>
                    ) : pedidosFiltrados.map((pedido) => {
                        const abierto = pedidoAbierto === pedido.id;

                        return (
                            <div key={pedido.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Pedido</p>
                                        <h2 className="font-bold text-gray-900">#{pedido.numero_pedido}</h2>
                                        <p className="text-xs text-gray-400">{pedido.fecha}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md px-2.5 py-1">
                                            {pedido.metacrilatos_count ?? pedido.metacrilatos?.length ?? 0} metacrilatos
                                        </span>
                                        <span className="text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-md px-2.5 py-1">
                                            {pedido.estado}
                                        </span>
                                        {pedido.estado === 'abierto' && (
                                            <button
                                                onClick={() => cerrarPedido(pedido)}
                                                className="text-xs bg-amber-600 text-white rounded-lg px-3 py-1.5"
                                            >
                                                Cerrar pedido
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setPedidoAbierto(abierto ? null : pedido.id)}
                                            className="text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5"
                                        >
                                            {abierto ? 'Ocultar' : 'Ver detalle'}
                                        </button>
                                    </div>
                                </div>

                                {abierto && (
                                    <div className="p-4 bg-gray-50">
                                        <table className="w-full text-xs text-left bg-white border border-gray-200 rounded-xl overflow-hidden">
                                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                                <tr>
                                                    <th className="px-3 py-2">Tarea</th>
                                                    <th className="px-3 py-2">Provincia</th>
                                                    <th className="px-3 py-2">Tipo</th>
                                                    <th className="px-3 py-2">Registro</th>
                                                    <th className="px-3 py-2 text-right">PDF</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {pedido.metacrilatos?.map((m) => (
                                                    <tr key={m.id}>
                                                        <td className="px-3 py-2 font-semibold">{m.tarea_logistica?.numero_tarea ?? 'Sin tarea'}</td>
                                                        <td className="px-3 py-2">{PROVINCIAS[m.tarea_logistica?.provincia] ?? m.tarea_logistica?.provincia ?? '-'}</td>
                                                        <td className="px-3 py-2">{m.tipo_centro}</td>
                                                        <td className="px-3 py-2 font-mono text-emerald-700 font-semibold">{m.codigo_registro}</td>
                                                        <td className="px-3 py-2 text-right">
                                                            <a href={`/metacrilatos/${m.id}/pdf`} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                                                                PDF
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
