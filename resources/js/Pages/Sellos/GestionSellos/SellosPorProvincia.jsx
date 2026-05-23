import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect } from "react";
import { getSellosProvinciaApi } from "../../../Services/pedidoService";
import MicrochipLoadingIcon from "../../../Components/atoms/MicrochipLoadingIcon.jsx";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function SellosPorProvincia() {
    const [sellos, setSellos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [provinciaActiva, setProvinciaActiva] = useState(null);

    useEffect(() => {
        getSellosProvinciaApi().then((res) => {
            setSellos(res.data);
            setCargando(false);
        });
    }, []);

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Sellos por Provincia</h1>

                {cargando ? (
                    <p className="inline-flex items-center gap-2 text-gray-400">
                        <MicrochipLoadingIcon size={20} label="Cargando sellos por provincia" />
                        Cargando...
                    </p>
                ) : (
                    <>
                        {/* TARJETAS RESUMEN */}
                        <div className="grid grid-cols-4 gap-4">
                            {Object.entries(sellos).map(([prefijo, lista]) => (
                                <button
                                    key={prefijo}
                                    onClick={() => setProvinciaActiva(
                                        provinciaActiva == prefijo ? null : prefijo
                                    )}
                                    className={`bg-white border rounded-xl p-4 text-left transition hover:shadow-md ${
                                        provinciaActiva == prefijo
                                            ? "border-green-500 ring-2 ring-green-100"
                                            : ""
                                    }`}
                                >
                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                        {PROVINCIAS[prefijo] ?? `Prefijo ${prefijo}`}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {lista.length}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                            {lista.filter(s => s.tipo_sello === "manual").length} manual
                                        </span>
                                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                                            {lista.filter(s => s.tipo_sello === "automatico").length} auto
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* TABLA DETALLE */}
                        {provinciaActiva && (
                            <div className="bg-white border rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-gray-700">
                                        {PROVINCIAS[provinciaActiva] ?? `Prefijo ${provinciaActiva}`} — {sellos[provinciaActiva]?.length} sellos
                                    </h2>
                                    <button
                                        onClick={() => setProvinciaActiva(null)}
                                        className="text-xs text-gray-400 hover:text-gray-600"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                        <tr>
                                            <th className="text-left px-4 py-3">Código</th>
                                            <th className="text-left px-4 py-3">Colegiado</th>
                                            <th className="text-left px-4 py-3">Nombre</th>
                                            <th className="text-left px-4 py-3">Apellidos</th>
                                            <th className="text-left px-4 py-3">Tipo</th>
                                            <th className="text-left px-4 py-3">Veces</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {sellos[provinciaActiva]?.map((s) => (
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
                                                    {s.veces_generado > 0 ? (
                                                        <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                                                            {s.veces_generado + 1}x
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                                                            1ª vez
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
