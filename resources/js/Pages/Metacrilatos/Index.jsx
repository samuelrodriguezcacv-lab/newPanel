import React, { useState } from 'react';
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

export default function Index() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const { metacrilatos = [], pedidos = [], pedidoAbierto = null, tiposCentro = [] } = usePage().props;

    const params = new URLSearchParams(window.location.search);
    const tareaLogisticaId = params.get('tarea_logistica_id') || '';
    const pedidoMetacrilatoIdUrl = params.get('pedido_metacrilato_id') || pedidoAbierto?.id || '';

    const [form, setForm] = useState({
        tipo_centro: '',
        codigo_registro: '',
        tarea_logistica_id: tareaLogisticaId,
        pedido_metacrilato_id: pedidoMetacrilatoIdUrl,
    });
    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);

    const pedidoSeleccionado = pedidos.find((p) => String(p.id) === String(form.pedido_metacrilato_id))
        ?? pedidoAbierto;

    const metacrilatosDeTarea = tareaLogisticaId
        ? metacrilatos.filter((m) => String(m.tarea_logistica_id) === String(tareaLogisticaId))
        : metacrilatos;

    const metacrilatosDelPedido = pedidoSeleccionado
        ? metacrilatos.filter((m) => String(m.pedido_metacrilato_id) === String(pedidoSeleccionado.id))
        : [];

    const tareaActual = metacrilatosDeTarea.find((m) => m.tarea_logistica)?.tarea_logistica;

    const handleSubmit = (e) => {
        e.preventDefault();
        setGuardando(true);

        router.post('/metacrilatos', {
            ...form,
            tarea_logistica_id: tareaLogisticaId,
        }, {
            preserveScroll: true,
            onError: (err) => {
                setErrors(err);
                setGuardando(false);
            },
            onSuccess: () => {
                setForm((actual) => ({
                    ...actual,
                    tipo_centro: '',
                    codigo_registro: '',
                    tarea_logistica_id: tareaLogisticaId,
                    pedido_metacrilato_id: actual.pedido_metacrilato_id || pedidoAbierto?.id || '',
                }));
                setErrors({});
                setGuardando(false);
            },
        });
    };

    const cerrarPedido = async () => {
        if (!pedidoSeleccionado) return;

        const ok = await confirm({
            title: 'Cerrar pedido',
            message: `Cerrar el pedido #${pedidoSeleccionado.numero_pedido}? Los proximos metacrilatos entraran en un pedido nuevo.`,
            tone: 'warning',
            confirmText: 'Cerrar pedido',
        });
        if (!ok) return;

        router.post(`/metacrilatos/pedidos/${pedidoSeleccionado.id}/cerrar`, {}, {
            preserveScroll: true,
            onSuccess: () => notify({
                title: 'Pedido cerrado',
                message: 'El siguiente metacrilato entrara en un pedido abierto nuevo.',
                tone: 'success',
            }),
        });
    };

    const eliminar = async (id) => {
        const ok = await confirm({
            title: 'Eliminar metacrilato',
            message: 'Esta accion elimina el registro de metacrilato. No se borran otros datos del pedido.',
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
            <div className="max-w-5xl mx-auto p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nuevo Pedido Metacrilatos</h1>
                    <p className="text-sm text-slate-500 mt-1">Pedido abierto / Tarea / Metacrilatos</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">P</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">Pedido activo</p>
                                <p className="font-bold text-slate-800">
                                    {pedidoSeleccionado ? pedidoSeleccionado.numero_pedido : 'Sin pedido abierto'}
                                </p>
                            </div>
                        </div>

                        {pedidoSeleccionado && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                    pedidoSeleccionado.estado === 'cerrado' ? 'bg-red-50 text-red-600' :
                                    pedidoSeleccionado.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
                                    'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {pedidoSeleccionado.estado ?? 'abierto'}
                                </span>
                                {pedidoSeleccionado.estado === 'abierto' && (
                                    <button
                                        onClick={cerrarPedido}
                                        className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1.5"
                                    >
                                        Cerrar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-blue-200 flex justify-between items-center bg-blue-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">T</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-400 uppercase">Tarea</p>
                                        {tareaLogisticaId ? (
                                            <p className="font-bold text-blue-800 text-lg">
                                                #{tareaActual?.numero_tarea ?? tareaLogisticaId}
                                                <span className="ml-2 text-xs font-normal text-blue-500">desde logistica</span>
                                            </p>
                                        ) : (
                                            <p className="font-medium text-blue-600 text-sm">Sin tarea asignada</p>
                                        )}
                                    </div>
                                </div>

                                {tareaActual?.provincia && (
                                    <span className="text-xs text-blue-700 border border-blue-300 rounded-lg px-3 py-1.5 bg-white">
                                        {PROVINCIAS[tareaActual.provincia] ?? tareaActual.provincia}
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">M</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400 uppercase">Metacrilatos</p>
                                                <p className="text-xs text-slate-500">
                                                    Pedido <span className="font-bold text-slate-700">#{pedidoSeleccionado?.numero_pedido ?? '-'}</span>
                                                    {' '}· {metacrilatosDelPedido.length} acumulados en el pedido
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Datos del metacrilato</p>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Pedido
                                                </label>
                                                <select
                                                    value={form.pedido_metacrilato_id}
                                                    onChange={(e) => setForm({ ...form, pedido_metacrilato_id: e.target.value })}
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Usar pedido abierto automaticamente</option>
                                                    {pedidos.map((pedido) => (
                                                        <option key={pedido.id} value={pedido.id}>
                                                            Pedido {pedido.numero_pedido} - {pedido.estado} ({pedido.metacrilatos_count ?? 0})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.pedido_metacrilato_id && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.pedido_metacrilato_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Tipo de centro
                                                </label>
                                                <select
                                                    value={form.tipo_centro}
                                                    onChange={(e) => setForm({ ...form, tipo_centro: e.target.value })}
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Selecciona un tipo...</option>
                                                    {tiposCentro.map((tipo) => (
                                                        <option key={tipo} value={tipo}>{tipo}</option>
                                                    ))}
                                                </select>
                                                {errors.tipo_centro && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.tipo_centro}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Numero de registro
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.codigo_registro}
                                                    onChange={(e) => setForm({ ...form, codigo_registro: e.target.value })}
                                                    placeholder="Ej: MA339"
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.codigo_registro && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.codigo_registro}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={guardando || !form.tipo_centro || !form.codigo_registro}
                                                className="w-full px-4 py-3 font-semibold rounded-3xl transition-all active:scale-[0.98] text-white bg-gradient-to-r from-[#166534] to-[#15803d] hover:from-[#15803d] hover:to-[#14532d] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {guardando ? 'Guardando...' : 'Anadir al pedido'}
                                            </button>
                                        </form>

                                        <div className="space-y-3">
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Vista previa</p>

                                            {form.tipo_centro && form.codigo_registro ? (
                                                <iframe
                                                    src={`/metacrilatos/preview?tipo_centro=${encodeURIComponent(form.tipo_centro)}&codigo_registro=${encodeURIComponent(form.codigo_registro)}`}
                                                    className="w-full h-80 rounded-xl border border-slate-200 shadow-sm"
                                                    title="Vista previa del metacrilato"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-80 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <p className="text-xs text-slate-400">Introduce los datos para ver la previsualizacion</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Historial</p>
                                    <p className="text-sm text-slate-600">
                                        {metacrilatosDeTarea.length} registros {tareaLogisticaId ? 'de esta tarea' : 'registrados'}
                                    </p>
                                </div>
                            </div>

                            {metacrilatosDeTarea.length === 0 ? (
                                <div className="p-10 text-center text-slate-400">
                                    <p className="text-sm">No hay metacrilatos registrados todavia</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Pedido</th>
                                                <th className="px-4 py-3 text-left">Tarea</th>
                                                <th className="px-4 py-3 text-left">Tipo</th>
                                                <th className="px-4 py-3 text-left">Registro</th>
                                                <th className="px-4 py-3 text-left">Fecha</th>
                                                <th className="px-4 py-3 text-left">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {metacrilatosDeTarea.map((m) => (
                                                <tr key={m.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-4 py-3 font-medium text-slate-800">
                                                        {m.pedido_metacrilato?.numero_pedido ?? 'Sin pedido'}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-800">
                                                        {m.tarea_logistica?.numero_tarea ?? 'Sin tarea'}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-700">
                                                        {m.tipo_centro}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-bold text-green-700">
                                                        {m.codigo_registro}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-400 text-xs">
                                                        {new Date(m.created_at).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <a
                                                                href={`/metacrilatos/${m.id}/pdf`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-xs text-green-600 hover:text-green-800 border border-green-200 rounded-lg px-3 py-1"
                                                            >
                                                                PDF
                                                            </a>

                                                            <button
                                                                onClick={() => eliminar(m.id)}
                                                                className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
