import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect } from "react";
import { getSellosRepetidosApi } from "../../../Services/pedidoService";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function SellosRepetidos() {
    const [sellos, setSellos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {
        getSellosRepetidosApi().then((res) => {
            setSellos(res.data);
            setCargando(false);
        });
    }, []);

    const sellosFiltrados = sellos.filter((s) =>
        filtroTipo ? s.tipo_sello === filtroTipo : true
    );

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Sellos Repetidos</h1>
                    <span className="bg-red-50 text-red-600 text-sm px-3 py-1 rounded-full font-medium">
                        {sellosFiltrados.length} repetidos
                    </span>
                </div>

                {/* AVISO */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                    ⚠️ Estos sellos ya fueron generados anteriormente. El primero fue <strong>gratuito</strong>, las siguientes generaciones tienen coste adicional.
                </div>

                {/* FILTRO */}
                <div className="flex gap-4 bg-white border rounded-xl p-4">
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="manual">Manual</option>
                        <option value="automatico">Automático</option>
                    </select>
                    {filtroTipo && (
                        <button
                            onClick={() => setFiltroTipo("")}
                            className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2"
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {/* TABLA */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="text-left px-4 py-3">Código</th>
                                <th className="text-left px-4 py-3">Colegiado</th>
                                <th className="text-left px-4 py-3">Nombre</th>
                                <th className="text-left px-4 py-3">Apellidos</th>
                                <th className="text-left px-4 py-3">Provincia</th>
                                <th className="text-left px-4 py-3">Tipo</th>
                                <th className="text-left px-4 py-3">Veces</th>
                                <th className="text-left px-4 py-3">Historial</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cargando ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : sellosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400">
                                        No hay sellos repetidos ✅
                                    </td>
                                </tr>
                            ) : (
                                sellosFiltrados.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 font-mono text-green-700">
                                            {s.codigo_sello}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {s.numero_colegiado}
                                        </td>
                                        <td className="px-4 py-3">{s.nombre}</td>
                                        <td className="px-4 py-3">
                                            {s.apellido1} {s.apellido2}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {PROVINCIAS[s.prefijo_postal] ?? s.prefijo_postal}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                s.tipo_sello === "manual"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-purple-50 text-purple-600"
                                            }`}>
                                                {s.tipo_sello}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                                {s.veces_generado + 1}x generado
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            {s.historial?.map((h, i) => (
                                                <div key={i} className="text-xs text-gray-500">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                        Pedido {h.pedido} — Tarea {h.tarea}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}