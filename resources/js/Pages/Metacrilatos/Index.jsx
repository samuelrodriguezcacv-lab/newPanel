import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';

export default function Index() {
    const { metacrilatos = [], pedidos = [], tiposCentro = [] } = usePage().props;

    const params = new URLSearchParams(window.location.search);
    const tareaLogisticaId = params.get('tarea_logistica_id') || '';
    const pedidoMetacrilatoIdUrl = params.get('pedido_metacrilato_id') || '';

    const [form, setForm] = useState({
        tipo_centro: '',
        codigo_registro: '',
        tarea_logistica_id: tareaLogisticaId,
        pedido_metacrilato_id: pedidoMetacrilatoIdUrl,
    });
    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);

    const metacrilatosDeTarea = tareaLogisticaId
        ? metacrilatos.filter((m) => String(m.tarea_logistica_id) === String(tareaLogisticaId))
        : metacrilatos;

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
                }));
                setErrors({});
                setGuardando(false);
            },
        });
    };

    const eliminar = (id) => {
        if (confirm('Eliminar este metacrilato?')) {
            router.delete(`/metacrilatos/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Layout>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Metacrilatos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Agrupa varios metacrilatos por tarea logistica y pedido.
                    </p>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Nuevo metacrilato
                            </h2>
                            {tareaLogisticaId && (
                                <p className="mt-2 text-sm text-blue-700">
                                    Tarea logistica ID: {tareaLogisticaId}
                                </p>
                            )}
                        </div>

                        <div className="min-w-56">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Pedido
                            </label>
                            <select
                                value={form.pedido_metacrilato_id}
                                onChange={(e) => setForm({ ...form, pedido_metacrilato_id: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Crear pedido nuevo</option>
                                {pedidos.map((pedido) => (
                                    <option key={pedido.id} value={pedido.id}>
                                        Pedido {pedido.numero_pedido} ({pedido.metacrilatos_count ?? 0})
                                    </option>
                                ))}
                            </select>
                            {errors.pedido_metacrilato_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.pedido_metacrilato_id}</p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de centro
                                </label>
                                <select
                                    value={form.tipo_centro}
                                    onChange={(e) => setForm({ ...form, tipo_centro: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Numero de registro
                                </label>
                                <input
                                    type="text"
                                    value={form.codigo_registro}
                                    onChange={(e) => setForm({ ...form, codigo_registro: e.target.value })}
                                    placeholder="Ej: MA339"
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.codigo_registro && (
                                    <p className="text-red-500 text-xs mt-1">{errors.codigo_registro}</p>
                                )}
                            </div>
                        </div>

                        {form.tipo_centro && form.codigo_registro && (
                            <div className="mb-4 space-y-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Vista previa</p>
                                <iframe
                                    src={`/metacrilatos/preview?tipo_centro=${encodeURIComponent(form.tipo_centro)}&codigo_registro=${encodeURIComponent(form.codigo_registro)}`}
                                    className="w-full h-96 rounded-xl border border-gray-200 shadow-sm"
                                    title="Vista previa del metacrilato"
                                />
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={guardando || !form.tipo_centro || !form.codigo_registro}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {guardando ? 'Guardando...' : 'Guardar metacrilato'}
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Historial - {metacrilatosDeTarea.length} registros
                    </h2>

                    {metacrilatosDeTarea.length === 0 ? (
                        <div className="bg-white rounded-xl border p-10 text-center text-gray-400">
                            <p className="text-sm">No hay metacrilatos registrados todavia</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Pedido</th>
                                        <th className="px-4 py-3 text-left">Tarea</th>
                                        <th className="px-4 py-3 text-left">Tipo de centro</th>
                                        <th className="px-4 py-3 text-left">Registro</th>
                                        <th className="px-4 py-3 text-left">Fecha</th>
                                        <th className="px-4 py-3 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {metacrilatosDeTarea.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {m.pedido_metacrilato?.numero_pedido ?? 'Sin pedido'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {m.tarea_logistica?.numero_tarea ?? 'Sin tarea'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {m.tipo_centro}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-bold text-green-700">
                                                {m.codigo_registro}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
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
        </Layout>
    );
}
