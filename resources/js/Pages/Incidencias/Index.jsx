import { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../../Template/LayaoutNav';
import MicrochipLoadingIcon from '../../Components/atoms/MicrochipLoadingIcon.jsx';
import { AlertCircle, Building2, CheckCircle2, Clock, Layers3, Plus } from 'lucide-react';

const estadoStyles = {
    abierta: 'bg-red-50 text-red-700 border-red-200',
    en_proceso: 'bg-blue-50 text-blue-700 border-blue-200',
    solucionada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cerrada: 'bg-slate-100 text-slate-700 border-slate-200',
};

const estadoLabels = {
    abierta: 'Abierta',
    en_proceso: 'En proceso',
    solucionada: 'Solucionada',
    cerrada: 'Cerrada',
};

export default function IncidenciasIndex({ incidencias = [], colegios = [], estados = [] }) {
    const { errors = {} } = usePage().props;
    const [guardando, setGuardando] = useState(false);
    const [actualizandoId, setActualizandoId] = useState(null);
    const [form, setForm] = useState({
        fecha: new Date().toISOString().slice(0, 10),
        alcance: 'todos',
        colegio_veterinario_id: '',
        descripcion: '',
    });

    const resumen = useMemo(() => ({
        abiertas: incidencias.filter((i) => i.estado === 'abierta').length,
        enProceso: incidencias.filter((i) => i.estado === 'en_proceso').length,
        solucionadas: incidencias.filter((i) => i.estado === 'solucionada').length,
        cerradas: incidencias.filter((i) => i.estado === 'cerrada').length,
    }), [incidencias]);

    const enviar = (e) => {
        e.preventDefault();
        setGuardando(true);

        router.post('/incidencias', {
            ...form,
            colegio_veterinario_id: form.alcance === 'colegio' ? form.colegio_veterinario_id : null,
        }, {
            preserveScroll: true,
            onSuccess: () => setForm((actual) => ({
                ...actual,
                alcance: 'todos',
                colegio_veterinario_id: '',
                descripcion: '',
            })),
            onFinish: () => setGuardando(false),
        });
    };

    const cambiarEstado = (incidencia, estado) => {
        setActualizandoId(incidencia.id);

        router.put(`/incidencias/${incidencia.id}/estado`, { estado }, {
            preserveScroll: true,
            onFinish: () => setActualizandoId(null),
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Control interno</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Incidencias</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                            Registra avisos por fecha, para un colegio concreto o para todos, y sigue su estado hasta la solucion.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <ResumenCard icon={AlertCircle} label="Abiertas" value={resumen.abiertas} className="text-red-700 bg-red-50 border-red-100" />
                        <ResumenCard icon={Clock} label="En proceso" value={resumen.enProceso} className="text-blue-700 bg-blue-50 border-blue-100" />
                        <ResumenCard icon={CheckCircle2} label="Solucionadas" value={resumen.solucionadas} className="text-emerald-700 bg-emerald-50 border-emerald-100" />
                        <ResumenCard icon={Layers3} label="Cerradas" value={resumen.cerradas} className="text-slate-700 bg-slate-50 border-slate-200" />
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <Plus className="h-5 w-5" />
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-slate-950">Nueva incidencia</h2>
                                <p className="text-xs text-slate-500">El numero se genera al guardar.</p>
                            </div>
                        </div>

                        <form onSubmit={enviar} className="space-y-4">
                            <Field label="Fecha" error={errors.fecha}>
                                <input
                                    type="date"
                                    value={form.fecha}
                                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </Field>

                            <Field label="Alcance" error={errors.alcance}>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, alcance: 'todos', colegio_veterinario_id: '' })}
                                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                            form.alcance === 'todos'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, alcance: 'colegio' })}
                                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                            form.alcance === 'colegio'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        Colegio
                                    </button>
                                </div>
                            </Field>

                            {form.alcance === 'colegio' && (
                                <Field label="Colegio" error={errors.colegio_veterinario_id}>
                                    <select
                                        value={form.colegio_veterinario_id}
                                        onChange={(e) => setForm({ ...form, colegio_veterinario_id: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    >
                                        <option value="">Selecciona un colegio</option>
                                        {colegios.map((colegio) => (
                                            <option key={colegio.id} value={colegio.id}>{colegio.nombre}</option>
                                        ))}
                                    </select>
                                </Field>
                            )}

                            <Field label="Descripcion" error={errors.descripcion}>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    rows={5}
                                    placeholder="Describe que ha ocurrido, a quien afecta y cualquier detalle util..."
                                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={guardando}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {guardando ? (
                                    <>
                                        <MicrochipLoadingIcon size={18} label="Guardando incidencia" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Crear incidencia
                                    </>
                                )}
                            </button>
                        </form>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-950">Listado de incidencias</h2>
                                <p className="text-xs text-slate-500">{incidencias.length} incidencias registradas</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Numero</th>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3">Colegio</th>
                                        <th className="px-4 py-3">Descripcion</th>
                                        <th className="px-4 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {incidencias.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                                                Todavia no hay incidencias registradas.
                                            </td>
                                        </tr>
                                    ) : incidencias.map((incidencia) => (
                                        <tr key={incidencia.id} className="align-top hover:bg-slate-50/70">
                                            <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-bold text-emerald-700">
                                                {incidencia.numero_incidencia}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                                                {incidencia.fecha}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    {incidencia.alcance === 'todos' ? 'Todos los colegios' : incidencia.colegio?.nombre ?? 'Colegio no disponible'}
                                                </span>
                                            </td>
                                            <td className="max-w-md px-4 py-4 leading-6 text-slate-700">
                                                {incidencia.descripcion}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {actualizandoId === incidencia.id && (
                                                        <MicrochipLoadingIcon size={18} label="Actualizando estado" />
                                                    )}
                                                    <select
                                                        value={incidencia.estado}
                                                        onChange={(e) => cambiarEstado(incidencia, e.target.value)}
                                                        disabled={actualizandoId === incidencia.id}
                                                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold outline-none transition disabled:opacity-60 ${estadoStyles[incidencia.estado] ?? estadoStyles.abierta}`}
                                                    >
                                                        {estados.map((estado) => (
                                                            <option key={estado} value={estado}>{estadoLabels[estado] ?? estado}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

function ResumenCard({ icon: Icon, label, value, className }) {
    return (
        <div className={`min-w-32 rounded-xl border p-3 ${className}`}>
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
            {children}
            {error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}
        </label>
    );
}
