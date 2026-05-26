import Layout from "../../../Template/LayaoutNav.jsx";
import Input from "../../../Components/atoms/input.jsx";
import Button from "../../../Components/atoms/button.jsx";
import React from "react";
import { useFeedbackModal } from "../../../Hooks/useFeedbackModal.jsx";
import { useTareasList } from "../../../Hooks/useTareasList.jsx";
import MicrochipLoadingIcon from "../../../Components/atoms/MicrochipLoadingIcon.jsx";

const PROVINCIAS = {
    4: "Almeria", 11: "Cadiz", 14: "Cordoba", 18: "Granada",
    21: "Huelva", 23: "Jaen", 29: "Malaga", 41: "Sevilla"
};

const ESTADOS = ["pendiente", "en_proceso", "completada"];

const estadoStyles = {
    pendiente: "bg-yellow-50 text-yellow-600",
    en_proceso: "bg-blue-50 text-blue-600",
    completada: "bg-green-50 text-green-600",
};

export default function TareasList() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const {
        filtroEstado,
        setFiltroEstado,
        filtroProvincia,
        setFiltroProvincia,
        tareaDetalle,
        setTareaDetalle,
        tareaEditando,
        setTareaEditando,
        formEditTarea,
        setFormEditTarea,
        cargando,
        cambiarEstado,
        eliminarTarea,
        abrirEditorTarea,
        guardarEdicionTarea,
        tareasFiltradas,
    } = useTareasList({ notify, confirm });

    return (
        <Layout title="Lista de Tareas" subtitle="Consulta, filtra y actualiza el estado de tareas y sellos">
            {feedbackModal}
            <div className="p-6 space-y-6">
                <div className="flex gap-4 bg-white border rounded-xl p-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Estado</label>
                        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border rounded-lg px-3 py-2 text-sm text-gray-700">
                            <option value="">Todos</option>
                            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Provincia</label>
                        <select value={filtroProvincia} onChange={(e) => setFiltroProvincia(e.target.value)} className="border rounded-lg px-3 py-2 text-sm text-gray-700">
                            <option value="">Todas</option>
                            {Object.entries(PROVINCIAS).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                        </select>
                    </div>
                    {(filtroEstado || filtroProvincia) && (
                        <button onClick={() => { setFiltroEstado(""); setFiltroProvincia(""); }} className="self-end text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2">
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="text-left px-4 py-3">Tarea</th>
                                <th className="text-left px-4 py-3">Pedido</th>
                                <th className="text-left px-4 py-3">Provincia</th>
                                <th className="text-left px-4 py-3">Fecha</th>
                                <th className="text-left px-4 py-3">Sellos</th>
                                <th className="text-left px-4 py-3">Estado</th>
                                <th className="text-left px-4 py-3">Detalle</th>
                                <th className="text-left px-4 py-3">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cargando ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-8 text-gray-400">
                                        <span className="inline-flex items-center gap-2">
                                            <MicrochipLoadingIcon size={22} label="Cargando tareas" />
                                            Cargando...
                                        </span>
                                    </td>
                                </tr>
                            ) : tareasFiltradas.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No hay tareas</td></tr>
                            ) : (
                                tareasFiltradas.map((t) => (
                                    <React.Fragment key={t.id}>
                                        <tr id={`tarea-${t.id}`} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-semibold text-gray-700">T-{t.Tarea}</td>
                                            <td className="px-4 py-3 text-gray-500">{t.pedido_id ?? "-"}</td>
                                            <td className="px-4 py-3 text-gray-500">{PROVINCIAS[t.provincia] ?? t.provincia}</td>
                                            <td className="px-4 py-3 text-gray-500">{t.fecha}</td>
                                            <td className="px-4 py-3"><span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">{t.sellos?.length ?? 0} sellos</span></td>
                                            <td className="px-4 py-3">
                                                <select value={t.estado} onChange={(e) => cambiarEstado(t, e.target.value)} className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${estadoStyles[t.estado]}`}>
                                                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setTareaDetalle(tareaDetalle?.id === t.id ? null : t)} className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-1">
                                                    {tareaDetalle?.id === t.id ? "Ocultar" : "Ver sellos"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => abrirEditorTarea(t)} className="text-xs text-blue-400 hover:text-blue-600 border border-blue-200 rounded-lg px-3 py-1">Editar</button>
                                                    <button onClick={() => eliminarTarea(t.id)} className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>

                                        {tareaDetalle?.id === t.id && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-4 bg-gray-50">
                                                    {t.sellos?.length > 0 ? (
                                                        <table className="w-full text-sm border rounded-xl overflow-hidden">
                                                            <thead className="bg-white text-gray-500 text-xs uppercase">
                                                                <tr>
                                                                    <th className="text-left px-4 py-2">Codigo</th>
                                                                    <th className="text-left px-4 py-2">Colegiado</th>
                                                                    <th className="text-left px-4 py-2">Nombre</th>
                                                                    <th className="text-left px-4 py-2">Apellidos</th>
                                                                    <th className="text-left px-4 py-2">Tipo</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y">
                                                                {t.sellos.map((s) => (
                                                                    <tr key={s.id} className="bg-white hover:bg-gray-50">
                                                                        <td className="px-4 py-2 font-mono text-green-700">{s.codigo_sello}</td>
                                                                        <td className="px-4 py-2">{s.numero_colegiado}</td>
                                                                        <td className="px-4 py-2">{s.nombre}</td>
                                                                        <td className="px-4 py-2">{s.apellido1} {s.apellido2}</td>
                                                                        <td className="px-4 py-2">
                                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.tipo_sello === "manual" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>{s.tipo_sello}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-xs text-gray-400">Sin sellos asignados</p>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {tareaEditando && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 space-y-4 w-96">
                        <h2 className="text-sm font-semibold text-gray-700">Editar Tarea {tareaEditando.Tarea}</h2>
                        <Input placeholder="Numero de tarea" value={formEditTarea.Tarea} onChange={(e) => setFormEditTarea({ ...formEditTarea, Tarea: e.target.value })} />
                        <select className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700" value={formEditTarea.provincia} onChange={(e) => setFormEditTarea({ ...formEditTarea, provincia: e.target.value })}>
                            <option value="">Selecciona provincia</option>
                            <option value="4">Almeria</option><option value="11">Cadiz</option><option value="14">Cordoba</option><option value="18">Granada</option>
                            <option value="21">Huelva</option><option value="23">Jaen</option><option value="29">Malaga</option><option value="41">Sevilla</option>
                        </select>
                        <Input type="date" value={formEditTarea.fecha} onChange={(e) => setFormEditTarea({ ...formEditTarea, fecha: e.target.value })} />
                        <select className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700" value={formEditTarea.estado} onChange={(e) => setFormEditTarea({ ...formEditTarea, estado: e.target.value })}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en_proceso">En proceso</option>
                            <option value="completada">Completada</option>
                        </select>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setTareaEditando(null)} className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2">Cancelar</button>
                            <Button variant="primary" onClick={guardarEdicionTarea}>Guardar</Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
