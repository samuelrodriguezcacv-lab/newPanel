import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';

export default function Index() {
    const { metacrilatos = [], tiposCentro = [] } = usePage().props;
    const { url } = usePage();
const params = new URLSearchParams(url.split('?')[1]);
const tareaLogisticaId = params.get('tarea_logistica_id');
console.log(tiposCentro);
    const [form, setForm] = useState({
        tipo_centro: '',
        codigo_registro: '',
        tarea_logistica_id: tareaLogisticaId,
    });
    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);




    const handleSubmit = (e) => {
        e.preventDefault();
        setGuardando(true);
        router.post('/metacrilatos', form, {
            onError: (err) => {
                setErrors(err);
                setGuardando(false);
            },
            onSuccess: () => {
                setForm({ tipo_centro: '', codigo_registro: '' });
                setErrors({});
                setGuardando(false);
            },
        });
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar este metacrilato?')) {
            router.delete(`/metacrilatos/${id}`);
        }
    };

    return (
        <Layout>
            <div className="p-6 max-w-5xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Metacrilatos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Certificados de centros veterinarios
                    </p>
                </div>

                {/* FORMULARIO */}
                <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                        Nuevo metacrilato
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">

                            {/* TIPO CENTRO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de centro
                                </label>
                                <select
                                    value={form.tipo_centro}
                                    onChange={e => setForm({ ...form, tipo_centro: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Selecciona un tipo...</option>
                                    {tiposCentro.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                                {errors.tipo_centro && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tipo_centro}</p>
                                )}
                            </div>

                            {/* CÓDIGO REGISTRO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nº de registro
                                </label>
                                <input
                                    type="text"
                                    value={form.codigo_registro}
                                    onChange={e => setForm({ ...form, codigo_registro: e.target.value })}
                                    placeholder="Ej: MA339"
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                {errors.codigo_registro && (
                                    <p className="text-red-500 text-xs mt-1">{errors.codigo_registro}</p>
                                )}
                            </div>
                        </div>

{/* PREVIEW */}
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
                                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {guardando ? 'Guardando...' : '✅ Guardar metacrilato'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* HISTORIAL */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Historial — {metacrilatos.length} registros
                    </h2>

                    {metacrilatos.length === 0 ? (
                        <div className="bg-white rounded-xl border p-10 text-center text-gray-400">
                            <p className="text-3xl mb-2">📋</p>
                            <p className="text-sm">No hay metacrilatos registrados todavía</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Tipo de centro</th>
                                        <th className="px-4 py-3 text-left">Nº Registro</th>
                                        <th className="px-4 py-3 text-left">Fecha</th>
                                        <th className="px-4 py-3 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {metacrilatos.map(m => (
                                        <tr key={m.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {m.tipo_centro}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-bold text-green-700">
                                                {m.codigo_registro}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {new Date(m.created_at).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => eliminar(m.id)}
                                                    className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1">
                                                    🗑️ Eliminar
                                                </button>
                                            </td>
                                                                                <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/metacrilatos/${m.id}/pdf`}
                                            target="_blank"
                                            className="text-xs text-green-600 hover:text-green-800 border border-green-200 rounded-lg px-3 py-1">
                                                📄 PDF
                                            </a>
                                            <button
                                                onClick={() => eliminar(m.id)}
                                                className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1">
                                                🗑️ Eliminar
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