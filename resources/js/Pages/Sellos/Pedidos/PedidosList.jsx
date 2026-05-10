import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect } from "react";
import { getPedidosApi, getPedidoApi, actualizarEstadoPedidoApi,eliminarSelloApi,eliminarTareaApi    } from "../../../Services/pedidoService";
import { generarPdfPedido } from "../../../Utils/generarPdfPedido.js";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const cambiarEstadoPedido = async (pedido, estado) => {
    await actualizarEstadoPedidoApi(pedido.id, estado);
    setPedidos(pedidos.map((p) =>
        p.id === pedido.id ? { ...p, estado } : p
    ));
};

    useEffect(() => {
        getPedidosApi().then((res) => {
            setPedidos(res.data);
            setCargando(false);
        });
    }, []);

    const verDetalle = async (p) => {
        if (pedidoDetalle?.id === p.id) {
            setPedidoDetalle(null);
            return;
        }
        const res = await getPedidoApi(p.id);
        setPedidoDetalle(res.data);
    };

    const pedidosFiltrados = pedidos.filter((p) => {
        const coincideFecha = filtroFecha ? p.fecha === filtroFecha : true;
        const coincideProvincia = filtroProvincia
            ? p.tareas?.some((t) => t.provincia == filtroProvincia)
            : true;
        return coincideFecha && coincideProvincia;
    });

    const eliminarSello = async (tareaId, selloId) => {
    if (!confirm("¿Eliminar este sello de la tarea?")) return;
    await eliminarSelloApi(tareaId, selloId);
    const res = await getPedidoApi(pedidoDetalle.id);
    setPedidoDetalle(res.data);
};


const eliminarTarea = async (tareaId) => {
    if (!confirm("¿Eliminar esta tarea y todos sus sellos?")) return;
    await eliminarTareaApi(tareaId);
    const res = await getPedidoApi(pedidoDetalle.id);
    setPedidoDetalle(res.data);
};

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Lista de Pedidos</h1>

                {/* FILTROS */}
                <div className="flex gap-4 bg-white border rounded-xl p-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Fecha</label>
                        <input
                            type="date"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Provincia</label>
                        <select
                            value={filtroProvincia}
                            onChange={(e) => setFiltroProvincia(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                        >
                            <option value="">Todas</option>
                            {Object.entries(PROVINCIAS).map(([key, val]) => (
                                <option key={key} value={key}>{val}</option>
                            ))}
                        </select>
                    </div>
                    {(filtroFecha || filtroProvincia) && (
                        <button
                            onClick={() => { setFiltroFecha(""); setFiltroProvincia(""); }}
                            className="self-end text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* TABLA PEDIDOS */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="text-left px-4 py-3">Pedido</th>
                                <th className="text-left px-4 py-3">Fecha</th>
                                <th className="text-left px-4 py-3">Tareas</th>
                                <th className="text-left px-4 py-3">Sellos</th>
                                <th className="text-left px-4 py-3">Acciones</th>
                                <th className="text-left px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : pedidosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        No hay pedidos
                                    </td>
                                </tr>
                            ) : (
                                pedidosFiltrados.map((p) => (
                                    <>
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-semibold text-gray-700">
                                                Pedido {p.numero_pedido}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{p.fecha}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                                                    {p.tareas?.length ?? 0} tareas
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                                                    {p.tareas?.reduce((acc, t) => acc + (t.sellos?.length ?? 0), 0)} sellos
                                                </span>
                                            </td>
                                         <td className="px-4 py-3">
    <div className="flex gap-2">
        <button
            onClick={() => verDetalle(p)}
            className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-1"
        >
            {pedidoDetalle?.id === p.id ? "Ocultar" : "Ver detalle"}
        </button>
        <button
            onClick={async () => {
                const res = await getPedidoApi(p.id);
                generarPdfPedido(res.data);
            }}
            className="text-xs text-green-600 hover:text-green-800 border border-green-200 rounded-lg px-3 py-1"
        >
            PDF
        </button>
    </div>
</td>
                                      <td className="px-4 py-3">
                                                <select
                                                    value={p.estado ?? 'abierto'}
                                                    onChange={(e) => cambiarEstadoPedido(p, e.target.value)}
                                                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${
                                                        p.estado === 'cerrado' ? 'bg-red-50 text-red-600' :
                                                        p.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-green-50 text-green-600'
                                                    }`}
                                                >
                                                    <option value="abierto">abierto</option>
                                                    <option value="cerrado">cerrado</option>
                                                    <option value="enviado">enviado</option>
                                                </select>
                                            </td>
                                                                                    </tr>

                                        {/* DETALLE DEL PEDIDO */}
                               {pedidoDetalle?.id === p.id && (
    <tr key={`detalle-${p.id}`}>
        <td colSpan={6} className="px-4 py-4 bg-gray-50">
            <div className="space-y-4">
                {pedidoDetalle.tareas?.map((t) => (
                    <div key={t.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">
                                Tarea {t.Tarea}
                            </span>
                            <span className="text-xs text-gray-400">
                                {PROVINCIAS[t.provincia]}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                t.estado === "pendiente"
                                    ? "bg-yellow-50 text-yellow-600"
                                    : t.estado === "en_proceso"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-green-50 text-green-600"
                            }`}>
                                {t.estado}
                            </span>
                            <button
                                onClick={() => eliminarTarea(t.id)}
                                className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-2 py-1 ml-auto"
                            >
                                Eliminar tarea
                            </button>
                        </div>

                        {t.sellos?.length > 0 ? (
                            <table className="w-full text-sm border rounded-xl overflow-hidden">
                                <thead className="bg-white text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="text-left px-4 py-2">Código</th>
                                        <th className="text-left px-4 py-2">Colegiado</th>
                                        <th className="text-left px-4 py-2">Nombre</th>
                                        <th className="text-left px-4 py-2">Apellidos</th>
                                        <th className="text-left px-4 py-2">Tipo</th>
                                        <th className="text-left px-4 py-2">Acción</th> 
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
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    s.tipo_sello === "manual"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-purple-50 text-purple-600"
                                                }`}>
                                                    {s.tipo_sello}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                            <button
                                                onClick={() => eliminarSello(t.id, s.id)}
                                                className="text-xs text-red-400 hover:text-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-xs text-gray-400 px-4">Sin sellos</p>
                        )}
                    </div>
                ))}
            </div>
        </td>
    </tr>
)}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}