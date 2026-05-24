import { useMemo, useState } from 'react';
import axios from 'axios';
import Layout from '../../Template/LayaoutNav';
import MicrochipLoadingIcon from '../../Components/atoms/MicrochipLoadingIcon.jsx';
import { CheckSquare, Download, FileText, Search, Square } from 'lucide-react';

const valoresDefecto = {
    express: 1,
    caja_3kg: 1,
    caja_5kg: 0,
    caja_10kg: 0,
    caja_15kg: 0,
    kg_adicional: 0,
};

const camposCajas = [
    ['express', 'Express'],
    ['caja_3kg', 'Caja 3kg'],
    ['caja_5kg', 'Caja 5kg'],
    ['caja_10kg', 'Caja 10kg'],
    ['caja_15kg', 'Caja 15kg'],
    ['kg_adicional', 'Kg adicional'],
];

export default function PlantillaEnvioIndex({ colegios = [], provincias = [] }) {
    const [busqueda, setBusqueda] = useState('');
    const [provincia, setProvincia] = useState('');
    const [seleccionados, setSeleccionados] = useState({});
    const [valores, setValores] = useState({});
    const [bulk, setBulk] = useState(valoresDefecto);
    const [descargando, setDescargando] = useState(false);
    const [error, setError] = useState('');

    const colegiosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return colegios.filter((colegio) => {
            const provinciaColegio = colegio.provincia || colegio.ciudad || '';
            const coincideProvincia = provincia ? provinciaColegio === provincia : true;
            const coincideBusqueda = texto
                ? [
                    colegio.nombre,
                    colegio.direccion,
                    colegio.ciudad,
                    colegio.provincia,
                    colegio.codigo_postal,
                    colegio.telefono,
                ].some((campo) => String(campo || '').toLowerCase().includes(texto))
                : true;

            return coincideProvincia && coincideBusqueda;
        });
    }, [busqueda, colegios, provincia]);

    const idsSeleccionados = Object.entries(seleccionados)
        .filter(([, activo]) => activo)
        .map(([id]) => Number(id));

    const toggleColegio = (colegio) => {
        setSeleccionados((actual) => ({
            ...actual,
            [colegio.id]: !actual[colegio.id],
        }));

        setValores((actual) => ({
            ...actual,
            [colegio.id]: actual[colegio.id] || valoresDefecto,
        }));
    };

    const seleccionarFiltrados = () => {
        const nuevosSeleccionados = { ...seleccionados };
        const nuevosValores = { ...valores };

        colegiosFiltrados.forEach((colegio) => {
            nuevosSeleccionados[colegio.id] = true;
            nuevosValores[colegio.id] = nuevosValores[colegio.id] || valoresDefecto;
        });

        setSeleccionados(nuevosSeleccionados);
        setValores(nuevosValores);
    };

    const limpiarSeleccion = () => {
        setSeleccionados({});
        setValores({});
    };

    const cambiarValor = (colegioId, campo, valor) => {
        setValores((actual) => ({
            ...actual,
            [colegioId]: {
                ...(actual[colegioId] || valoresDefecto),
                [campo]: normalizarNumero(valor),
            },
        }));
    };

    const aplicarBulk = () => {
        const nuevosValores = { ...valores };

        idsSeleccionados.forEach((id) => {
            nuevosValores[id] = { ...bulk };
        });

        setValores(nuevosValores);
    };

    const descargarExcel = async () => {
        setError('');

        if (idsSeleccionados.length === 0) {
            setError('Selecciona al menos un colegio para generar la plantilla.');
            return;
        }

        setDescargando(true);

        try {
            const lineas = idsSeleccionados.map((colegioId) => ({
                colegio_id: colegioId,
                ...(valores[colegioId] || valoresDefecto),
            }));

            const response = await axios.post('/plantilla-envio/exportar', { lineas }, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivoDesdeHeaders(response.headers['content-disposition']) || 'plantilla-envio.xlsx';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            setError('No se pudo generar el Excel. Revisa que los colegios seleccionados tengan datos validos.');
        } finally {
            setDescargando(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Excel de etiquetas</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Plantilla de Envio</h1>
                        <p className="mt-2 max-w-3xl text-sm text-slate-500">
                            Selecciona colegios de una provincia o mezcla varios colegios en una sola plantilla. El archivo se descarga con las columnas listas para enviar.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={descargarExcel}
                        disabled={descargando || idsSeleccionados.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {descargando ? (
                            <>
                                <MicrochipLoadingIcon size={18} label="Generando Excel" />
                                Generando Excel...
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Descargar Excel
                            </>
                        )}
                    </button>
                </div>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 xl:grid-cols-[1fr_220px_auto_auto]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar colegio, poblacion, telefono..."
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <select
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="">Todas las provincias</option>
                            {provincias.map((nombre) => (
                                <option key={nombre} value={nombre}>{nombre}</option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={seleccionarFiltrados}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <CheckSquare className="h-4 w-4" />
                            Seleccionar vista
                        </button>

                        <button
                            type="button"
                            onClick={limpiarSeleccion}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
                        >
                            Limpiar
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
                            {camposCajas.map(([campo, label]) => (
                                <label key={campo} className="block">
                                    <span className="mb-1 block text-xs font-bold uppercase text-slate-500">{label}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={bulk[campo]}
                                        onChange={(e) => setBulk({ ...bulk, [campo]: normalizarNumero(e.target.value) })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </label>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={aplicarBulk}
                            disabled={idsSeleccionados.length === 0}
                            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Aplicar a seleccionados
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
                            <FileText className="h-4 w-4" />
                            {idsSeleccionados.length} seleccionados
                        </span>
                        <span>{colegiosFiltrados.length} colegios en la vista actual</span>
                        {error && <span className="font-semibold text-red-600">{error}</span>}
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="w-12 px-4 py-3"></th>
                                    <th className="px-4 py-3">Colegio</th>
                                    <th className="px-4 py-3">Direccion</th>
                                    <th className="px-4 py-3">CP</th>
                                    <th className="px-4 py-3">Poblacion</th>
                                    <th className="px-4 py-3">Provincia</th>
                                    <th className="px-4 py-3">Telefono</th>
                                    {camposCajas.map(([, label]) => (
                                        <th key={label} className="px-2 py-3 text-center">{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {colegiosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="px-4 py-12 text-center text-slate-400">
                                            No hay colegios con esos filtros.
                                        </td>
                                    </tr>
                                ) : colegiosFiltrados.map((colegio) => {
                                    const activo = !!seleccionados[colegio.id];
                                    const config = valores[colegio.id] || valoresDefecto;

                                    return (
                                        <tr key={colegio.id} className={`transition ${activo ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleColegio(colegio)}
                                                    className={`rounded-md p-1 ${activo ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
                                                    aria-label={activo ? 'Quitar colegio' : 'Seleccionar colegio'}
                                                >
                                                    {activo ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                                                </button>
                                            </td>
                                            <td className="min-w-64 px-4 py-3 font-semibold text-slate-900">{colegio.nombre}</td>
                                            <td className="min-w-56 px-4 py-3 text-slate-500">{colegio.direccion || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{colegio.codigo_postal || '-'}</td>
                                            <td className="px-4 py-3">{colegio.ciudad || '-'}</td>
                                            <td className="px-4 py-3">{colegio.provincia || colegio.ciudad || '-'}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{colegio.telefono || '-'}</td>
                                            {camposCajas.map(([campo, label]) => (
                                                <td key={`${colegio.id}-${campo}`} className="px-2 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={config[campo]}
                                                        disabled={!activo}
                                                        aria-label={`${label} ${colegio.nombre}`}
                                                        onChange={(e) => cambiarValor(colegio.id, campo, e.target.value)}
                                                        className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-300"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

function normalizarNumero(valor) {
    if (valor === '') return 0;
    return Number(valor) < 0 ? 0 : Number(valor);
}

function nombreArchivoDesdeHeaders(header) {
    if (!header) return null;
    const match = header.match(/filename="?([^"]+)"?/);
    return match?.[1] || null;
}
