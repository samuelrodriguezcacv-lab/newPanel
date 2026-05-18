import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect } from "react";
import { getSellosRepetidosApi } from "../../../Services/pedidoService";
import { Link } from "@inertiajs/react";

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

    // Cálculos rápidos para los paneles informativos
    const totalCargosExtra = sellosFiltrados.reduce((acc, s) => acc + (s.veces_generado || 0), 0);

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                
                {/* CABECERA E INDICADORES */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Auditoría de Sellos Repetidos</h1>
                        <p className="text-sm text-gray-500">Control de duplicidades generadas y costes de emisión adicionales.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                            <span className="block text-xs font-semibold text-red-500 uppercase tracking-wider">Casos</span>
                            <span className="text-xl font-bold text-red-700">{sellosFiltrados.length}</span>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                            <span className="block text-xs font-semibold text-amber-600 uppercase tracking-wider">Re-emisiones</span>
                            <span className="text-xl font-bold text-amber-700">+{totalCargosExtra}</span>
                        </div>
                    </div>
                </div>

                {/* AVISO DE COSTES */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
                    <span className="text-xl mt-0.5">⚠️</span>
                    <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-amber-900">Política de Facturación de Sellos</h4>
                        <p className="text-sm text-amber-800">
                            Estos sellos ya fueron generados anteriormente. El primer documento emitido fue <strong className="underline decoration-amber-500/50">gratuito</strong>. Cualquier copia o re-generación posterior listada aquí acumula un <strong className="text-amber-950 font-bold">coste adicional</strong> en cuenta.
                        </p>
                    </div>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase pl-1">Filtrar:</span>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100/50 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition cursor-pointer"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="manual">Manual</option>
                            <option value="automatico">Automático</option>
                        </select>
                    </div>
                    
                    {filtroTipo && (
                        <button
                            onClick={() => setFiltroTipo("")}
                            className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/60 rounded-lg px-3 py-1.5 transition"
                        >
                            Limpiar Filtro
                        </button>
                    )}
                </div>

                {/* CONTENEDOR DE LA TABLA */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3.5">Código Sello</th>
                                    <th className="px-4 py-3.5">Nº Colegiado</th>
                                    <th className="px-4 py-3.5">Profesional</th>
                                    <th className="px-4 py-3.5">Provincia</th>
                                    <th className="px-4 py-3.5">Tipo de Sello</th>
                                    <th className="px-4 py-3.5 text-center">Excesos</th>
                                    <th className="px-4 py-3.5 lg:w-[350px]">Historial de Trazabilidad (Pedido / Tarea)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400 font-medium bg-gray-50/30">
                                            <span className="inline-block animate-pulse">Cargando registros duplicados...</span>
                                        </td>
                                    </tr>
                                ) : sellosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400 font-medium bg-gray-50/30">
                                            No se han detectado sellos duplicados en este filtro. ✅
                                        </td>
                                    </tr>
                                ) : (
                                    sellosFiltrados.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                                            {/* CODIGO SELLO */}
                                            <td className="px-4 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                                                {s.codigo_sello}
                                            </td>
                                            
                                            {/* COLEGIADO */}
                                            <td className="px-4 py-4 text-gray-600 font-medium whitespace-nowrap">
                                                {s.numero_colegiado}
                                            </td>
                                            
                                            {/* PROFESIONAL */}
                                            <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {s.nombre} <span className="text-gray-500 font-normal">{s.apellido1} {s.apellido2}</span>
                                            </td>
                                            
                                            {/* PROVINCIA */}
                                            <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                                                {PROVINCIAS[s.prefijo_postal] ?? s.prefijo_postal}
                                            </td>
                                            
                                            {/* TIPO */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                                                    s.tipo_sello === "manual"
                                                        ? "bg-slate-50 text-slate-700 border-slate-200"
                                                        : "bg-purple-50 text-purple-700 border-purple-100"
                                                }`}>
                                                    {s.tipo_sello}
                                                </span>
                                            </td>
                                            
                                            {/* VECES EXCEDIDAS */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                                                    s.veces_generado >= 2 
                                                        ? "bg-red-100 text-red-700 ring-2 ring-red-500/10" 
                                                        : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {s.veces_generado + 1} generaciones
                                                </span>
                                            </td>
                                            
                                            {/* HISTORIAL HORIZONTAL */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-h-[76px] overflow-y-auto pr-1">
                                               {s.historial?.map((h, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/sellos/pedidos?resaltar=${h.pedido}`}
                                                    className="inline-flex items-center text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md hover:bg-blue-100 transition whitespace-nowrap"
                                                >
                                                    P{h.pedido} <span className="text-blue-400 mx-1">/</span> T{h.tarea}
                                                </Link>
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
            </div>
        </Layout>
    );
}