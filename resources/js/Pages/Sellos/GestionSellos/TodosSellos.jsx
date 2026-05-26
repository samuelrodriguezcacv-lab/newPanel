import Layout from "../../../Template/LayaoutNav.jsx";
import Input from "../../../Components/atoms/input.jsx";
import Button from "../../../Components/atoms/button.jsx";
import { useFeedbackModal } from "../../../Hooks/useFeedbackModal.jsx";
import MicrochipLoadingIcon from "../../../Components/atoms/MicrochipLoadingIcon.jsx";
import { useTodosSellos } from "../../../Hooks/useTodosSellos.jsx";

const PROVINCIAS = {
    4: "Almeria", 11: "Cadiz", 14: "Cordoba", 18: "Granada",
    21: "Huelva", 23: "Jaen", 29: "Malaga", 41: "Sevilla"
};

export default function TodosSellos() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const {
        sellos,
        page,
        setPage,
        lastPage,
        cargando,
        busqueda,
        setBusqueda,
        filtroTipo,
        setFiltroTipo,
        filtroProvincia,
        setFiltroProvincia,
        selloSeleccionado,
        formEdit,
        setFormEdit,
        seleccionarSello,
        eliminarSello,
        guardarEdicion,
        sellosFiltrados,
    } = useTodosSellos({ notify, confirm });

    return (
        <Layout title="Todos los Sellos" subtitle="Catalogo completo con filtros, paginacion y edicion rapida">
            {feedbackModal}
            <div className="flex h-[calc(100vh-4rem)] bg-[#f8fafc]">
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                    <div className="flex justify-end items-center">
                        <button className="bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-xs">
                            <span className="text-lg leading-none">+</span> Nuevo Sello
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, cody o codigo..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="flex-1 min-w-[200px] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition"
                        />
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="manual">Manual</option>
                            <option value="automatico">Automatico</option>
                        </select>
                        <select
                            value={filtroProvincia}
                            onChange={(e) => setFiltroProvincia(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none"
                        >
                            <option value="">Todas las provincias</option>
                            {Object.entries(PROVINCIAS).map(([key, val]) => (
                                <option key={key} value={key}>{val}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Codigo</th>
                                    <th className="py-3 px-4">Colegiado</th>
                                    <th className="py-3 px-4">Nombre</th>
                                    <th className="py-3 px-4">Apellidos</th>
                                    <th className="py-3 px-4">Provincia</th>
                                    <th className="py-3 px-4">Tipo</th>
                                    <th className="py-3 px-4">Veces</th>
                                    <th className="py-3 px-4 text-center">Accion</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12 text-slate-400">
                                            <span className="inline-flex items-center gap-2">
                                                <MicrochipLoadingIcon size={22} label="Cargando registros" />
                                                Cargando registros...
                                            </span>
                                        </td>
                                    </tr>
                                ) : sellosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12 text-slate-400">No se encontraron resultados</td>
                                    </tr>
                                ) : (
                                    sellosFiltrados.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() => seleccionarSello(s)}
                                            className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${selloSeleccionado?.id === s.id ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}`}
                                        >
                                            <td className="py-3.5 px-4 font-medium text-slate-900">{s.codigo_sello}</td>
                                            <td className="py-3.5 px-4 text-slate-500">{s.numero_colegiado}</td>
                                            <td className="py-3.5 px-4">{s.nombre}</td>
                                            <td className="py-3.5 px-4">{s.apellido1} {s.apellido2}</td>
                                            <td className="py-3.5 px-4 text-slate-500">{PROVINCIAS[s.prefijo_postal] || s.prefijo_postal}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                                    s.tipo_sello === "complete" || s.tipo_sello === "automatico"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}>
                                                    {s.tipo_sello === "manual" ? "en proceso" : "completo"}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-medium">{s.veces_generado || 1}</td>
                                            <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => seleccionarSello(s)} className="text-slate-400 hover:text-slate-600 transition">
                                                        Ver
                                                    </button>
                                                    <button onClick={() => eliminarSello(s.id)} className="text-rose-400 hover:text-rose-600 transition">
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                        <p className="text-xs text-slate-500">
                            Pagina {page} de {lastPage}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1 || cargando}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Anterior
                            </button>

                            {Array.from({ length: lastPage }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                                .map((p, index, arr) => (
                                    <span key={p} className="flex items-center">
                                        {index > 0 && arr[index - 1] !== p - 1 && (
                                            <span className="px-1 text-slate-400">...</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setPage(p)}
                                            disabled={cargando}
                                            className={`min-w-9 px-2 py-1.5 text-sm rounded-lg border transition ${
                                                page === p
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                                        >
                                            {p}
                                        </button>
                                    </span>
                                ))}

                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                                disabled={page === lastPage || cargando}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-96 bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                    {selloSeleccionado ? (
                        <div className="space-y-6 overflow-y-auto pr-1">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Editar Sello</h2>
                                <p className="text-xs text-slate-400 mt-0.5">ID Registro: #{selloSeleccionado.id}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Codigo de Sello</label>
                                    <Input
                                        value={selloSeleccionado.codigo_sello}
                                        disabled
                                        className="bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Colegiado</label>
                                    <Input
                                        value={formEdit.numero_colegiado || ""}
                                        onChange={(e) => setFormEdit({ ...formEdit, numero_colegiado: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Nombre</label>
                                    <Input
                                        value={formEdit.nombre || ""}
                                        onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Apellidos</label>
                                    <Input
                                        value={`${formEdit.apellido1 || ""} ${formEdit.apellido2 || ""}`.trim()}
                                        onChange={(e) => {
                                            const [ap1, ...ap2] = e.target.value.split(" ");
                                            setFormEdit({ ...formEdit, apellido1: ap1, apellido2: ap2.join(" ") });
                                        }}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Provincia</label>
                                    <select
                                        value={formEdit.prefijo_postal || ""}
                                        onChange={(e) => setFormEdit({ ...formEdit, prefijo_postal: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 transition"
                                    >
                                        <option value="">Select</option>
                                        {Object.entries(PROVINCIAS).map(([key, val]) => (
                                            <option key={key} value={key}>{val}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 block">Tipo</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipo_sello"
                                                value="manual"
                                                checked={formEdit.tipo_sello === "manual"}
                                                onChange={() => setFormEdit({ ...formEdit, tipo_sello: "manual" })}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            Manual
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipo_sello"
                                                value="automatico"
                                                checked={formEdit.tipo_sello === "automatico" || formEdit.tipo_sello === "complete"}
                                                onChange={() => setFormEdit({ ...formEdit, tipo_sello: "automatico" })}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            Automatico
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2">
                                <Button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition" onClick={guardarEdicion}>
                                    Guardar Sello
                                </Button>
                                <button
                                    onClick={() => seleccionarSello(sellos[0])}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            Selecciona un sello para editarlo
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}
