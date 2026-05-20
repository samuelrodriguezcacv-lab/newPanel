// PedidosList.jsx
import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect, useRef } from "react";
import { getPedidosApi, getPedidoApi, actualizarEstadoPedidoApi, eliminarSelloApi, eliminarTareaApi } from "../../../Services/pedidoService";
import {
    generarPdfEmpresaPedido,
    generarPdfHojaPedido,
    generarPdfRepetidosPedido,
    obtenerOpcionesHojasPedido,
} from "../../../Utils/generarPdfPedido.js";
import { usePage } from "@inertiajs/react";
import { useFeedbackModal } from "../../../Hooks/useFeedbackModal.jsx";
import { Download, FileText, Printer } from "lucide-react";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function PedidosList() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    const [pedidos, setPedidos] = useState([]);
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [hojasSeleccionadas, setHojasSeleccionadas] = useState({});

    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const resaltar = params.get('resaltar');
    const resaltadoRef = useRef(null);

    useEffect(() => {
        getPedidosApi().then((res) => {
            setPedidos(res.data);
            setCargando(false);
        });
    }, []);

    useEffect(() => {
        if (resaltadoRef.current) {
            resaltadoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [pedidos]);

    const cambiarEstadoPedido = async (pedido, estado) => {
        await actualizarEstadoPedidoApi(pedido.id, estado);
        setPedidos(pedidos.map((p) =>
            p.id === pedido.id ? { ...p, estado } : p
        ));
    };

    const verDetalle = async (p) => {
        if (pedidoDetalle?.id === p.id) {
            setPedidoDetalle(null);
            return;
        }
        const res = await getPedidoApi(p.id);
        setPedidoDetalle(res.data);
    };

    const eliminarSello = async (tareaId, selloId) => {
        const ok = await confirm({
            title: 'Quitar sello',
            message: 'Se quitara este sello de la tarea. El sello seguira existiendo en el catalogo.',
            tone: 'warning',
            confirmText: 'Quitar',
        });
        if (!ok) return;

        await eliminarSelloApi(tareaId, selloId);
        const res = await getPedidoApi(pedidoDetalle.id);
        setPedidoDetalle(res.data);
        await notify({
            title: 'Sello quitado',
            message: 'El sello se quito de la tarea correctamente.',
            tone: 'success',
        });
    };

    const eliminarTarea = async (tareaId) => {
        const ok = await confirm({
            title: 'Eliminar tarea',
            message: 'Se eliminara esta tarea y todos sus sellos asignados.',
            tone: 'danger',
            confirmText: 'Eliminar',
        });
        if (!ok) return;

        await eliminarTareaApi(tareaId);
        const res = await getPedidoApi(pedidoDetalle.id);
        setPedidoDetalle(res.data);
        await notify({
            title: 'Tarea eliminada',
            message: 'La tarea se elimino correctamente.',
            tone: 'success',
        });
    };

    const descargarPdfEmpresa = async (pedido) => {
        const res = await getPedidoApi(pedido.id);
        await generarPdfEmpresaPedido(res.data);
    };

    const descargarPdfHoja = async (pedido) => {
        const seleccion = hojasSeleccionadas[pedido.id] ?? obtenerOpcionesHojasPedido(pedido)[0]?.value;

        if (!seleccion) {
            await notify({
                title: 'Sin sellos',
                message: 'Este pedido no tiene hojas por provincia para descargar.',
                tone: 'warning',
            });
            return;
        }

        const [provincia, tipo] = seleccion.split(':');
        const res = await getPedidoApi(pedido.id);
        await generarPdfHojaPedido(res.data, provincia, tipo);
    };

    const descargarPdfRepetidos = async (pedido) => {
        const res = await getPedidoApi(pedido.id);
        await generarPdfRepetidosPedido(res.data);
    };

    const pedidosFiltrados = pedidos.filter((p) => {
        const coincideFecha = filtroFecha ? p.fecha === filtroFecha : true;
        const coincideProvincia = filtroProvincia
            ? p.tareas?.some((t) => (t.provincia ?? t.tarea_logistica?.provincia) == filtroProvincia)
            : true;
        return coincideFecha && coincideProvincia;
    });

    return (
        <Layout>
            {feedbackModal}
            <div className="p-6 max-w-5xl mx-auto space-y-6">

                {/* CABECERA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Pedidos</h1>
                        <p className="text-sm text-gray-500">Visualiza, filtra y administra las tareas y sellos de cada pedido.</p>
                    </div>
                    <span className="self-start sm:self-center text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                        {pedidosFiltrados.length} pedidos en total
                    </span>
                </div>

                {/* FILTROS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Filtrar por Fecha</label>
                        <input type="date" value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Filtrar por Provincia</label>
                        <select value={filtroProvincia} onChange={(e) => setFiltroProvincia(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition">
                            <option value="">Todas las provincias</option>
                            {Object.entries(PROVINCIAS).map(([key, val]) => (
                                <option key={key} value={key}>{val}</option>
                            ))}
                        </select>
                    </div>
                    {(filtroFecha || filtroProvincia) && (
                        <button onClick={() => { setFiltroFecha(""); setFiltroProvincia(""); }}
                            className="w-full text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-200 rounded-lg py-2 transition">
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* LISTA DE PEDIDOS */}
                <div className="space-y-4">
                    {cargando ? (
                        <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <span className="inline-block animate-pulse font-medium">Cargando listado de pedidos...</span>
                        </div>
                    ) : pedidosFiltrados.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <p className="font-medium">No se encontraron pedidos con los filtros aplicados.</p>
                        </div>
                    ) : (
                        pedidosFiltrados.map((p) => {
                            const esAbierto = pedidoDetalle?.id === p.id;
                            const totalSellos = p.tareas?.filter((t) => t.sello).length ?? 0;
                            const totalRepetidos = p.tareas?.filter((t) => Number(t.sello?.veces_generado ?? 0) > 0).length ?? 0;
                            const esResaltado = String(p.numero_pedido) === String(resaltar);
                            const opcionesHojas = obtenerOpcionesHojasPedido(p);
                            const hojaSeleccionada = hojasSeleccionadas[p.id] ?? opcionesHojas[0]?.value ?? "";

                            return (
                                <div
                                    key={p.id}
                                    ref={esResaltado ? resaltadoRef : null}
                                    className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                                        esAbierto ? 'ring-2 ring-blue-500/30 border-blue-400' : 'hover:border-gray-300'
                                    } ${
                                        esResaltado ? 'ring-2 ring-yellow-400 border-yellow-300 bg-yellow-50/40' : ''
                                    }`}
                                >
                                    {/* CABECERA TARJETA */}
                                    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                esResaltado ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' : 'bg-gray-50 border border-gray-200 text-gray-700'
                                            }`}>
                                                #{p.numero_pedido}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pedido corporativo</h3>
                                                <p className="text-xs text-gray-400">{p.fecha}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-100">
                                                {p.tareas?.length ?? 0} tareas
                                            </span>
                                            <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md border border-purple-100">
                                                {totalSellos} sellos
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-end gap-2 ml-auto sm:ml-0">
                                            <select value={p.estado ?? 'abierto'}
                                                onChange={(e) => cambiarEstadoPedido(p, e.target.value)}
                                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border shadow-sm cursor-pointer transition outline-none ${
                                                    p.estado === 'cerrado' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    p.estado === 'enviado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-green-50 text-green-700 border-green-200'
                                                }`}>
                                                <option value="abierto">Abierto</option>
                                                <option value="cerrado">Cerrado</option>
                                                <option value="enviado">Enviado</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => descargarPdfEmpresa(p)}
                                                title="Descargar PDF completo para la empresa"
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm hover:bg-gray-50 transition">
                                                <FileText className="h-3.5 w-3.5" />
                                                PDF empresa
                                            </button>

                                            <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
                                                <select
                                                    value={hojaSeleccionada}
                                                    onChange={(e) => setHojasSeleccionadas((actuales) => ({
                                                        ...actuales,
                                                        [p.id]: e.target.value,
                                                    }))}
                                                    className="min-w-44 border-0 bg-transparent px-2 py-1 text-xs text-gray-700 focus:ring-0"
                                                >
                                                    {opcionesHojas.length === 0 ? (
                                                        <option value="">Sin hojas</option>
                                                    ) : (
                                                        opcionesHojas.map((opcion) => (
                                                            <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                                                        ))
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => descargarPdfHoja(p)}
                                                    title="Descargar PDF individual por provincia y tipo"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
                                                    disabled={opcionesHojas.length === 0}
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => descargarPdfRepetidos(p)}
                                                title="Descargar PDF de sellos repetidos"
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-red-100/70 transition">
                                                <Printer className="h-3.5 w-3.5" />
                                                Repetidos
                                                {totalRepetidos > 0 && (
                                                    <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-red-700">{totalRepetidos}</span>
                                                )}
                                            </button>

                                            <button onClick={() => verDetalle(p)}
                                                className={`text-xs font-medium rounded-lg px-3 py-1.5 transition ${
                                                    esAbierto
                                                        ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                                }`}>
                                                {esAbierto ? "Ocultar" : "Ver detalles"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* DETALLE DESPLEGABLE */}
                                    {esAbierto && pedidoDetalle && (
                                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 space-y-6">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Desglose del pedido</h4>
                                                <div className="flex gap-2">
                                                    <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-md px-2.5 py-1">
                                                        {pedidoDetalle.tareas?.filter((t) => t.sello).length ?? 0} sellos
                                                    </span>
                                                </div>
                                            </div>

                                            {pedidoDetalle.tareas?.length > 0 && (
                                                <div className="space-y-4">
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase">Sellos</h5>
                                                    {pedidoDetalle.tareas.map((t) => (
                                                <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-800 text-sm">
                                                                Tarea: {t.tarea_logistica?.numero_tarea ?? t.numero_tarea ?? t.tareas_logistica_id}
                                                            </span>
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                                               {PROVINCIAS[t.provincia ?? t.tarea_logistica?.provincia] 
                                                                            ?? t.provincia 
                                                                            ?? t.tarea_logistica?.provincia 
                                                                            ?? "Sin provincia"}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                                                                t.estado === "pendiente" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                                t.estado === "en_proceso" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                "bg-green-50 text-green-700 border-green-200"
                                                            }`}>
                                                                {t.estado}
                                                            </span>
                                                        </div>
                                                        <button onClick={() => eliminarTarea(t.id)}
                                                            className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/50 border border-red-100 rounded-lg px-2.5 py-1 transition">
                                                            Eliminar Tarea
                                                        </button>
                                                    </div>

                                                {t.sello ? (
                                                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                                                        <table className="w-full text-left text-xs text-gray-600">
                                                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase border-b border-gray-100">
                                                                <tr>
                                                                    <th className="px-3 py-2">Código</th>
                                                                    <th className="px-3 py-2">Colegiado</th>
                                                                    <th className="px-3 py-2">Profesional</th>
                                                                    <th className="px-3 py-2">Tipo</th>
                                                                    <th className="px-3 py-2 text-right">Acción</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-gray-100">
                                                                <tr key={t.sello.id} className="hover:bg-gray-50/80 transition">
                                                                    <td className="px-3 py-2.5 font-mono font-medium text-blue-700">
                                                                        {t.sello.codigo_sello}
                                                                    </td>

                                                                    <td className="px-3 py-2.5 text-gray-700">
                                                                        {t.sello.numero_colegiado}
                                                                    </td>

                                                                    <td className="px-3 py-2.5">
                                                                        {t.sello.nombre} {t.sello.apellido1} {t.sello.apellido2}
                                                                    </td>

                                                                    <td className="px-3 py-2.5">
                                                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                                                            t.sello.tipo_sello === "manual"
                                                                                ? "bg-gray-100 text-gray-700"
                                                                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                                                        }`}>
                                                                            {t.sello.tipo_sello}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-3 py-2.5 text-right">
                                                                        <button
                                                                            onClick={() => eliminarSello(t.id, t.sello.id)}
                                                                            className="text-red-500 hover:text-red-700 font-medium hover:underline"
                                                                        >
                                                                            Quitar
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">
                                                        No hay sellos asociados a esta tarea.
                                                    </p>
                                                )}
                                                </div>
                                                    ))}
                                                </div>
                                            )}

                                            {!pedidoDetalle.tareas?.length && (
                                                <p className="text-xs text-gray-400 italic">
                                                    Este pedido no tiene sellos asociados.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}
