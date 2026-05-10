import Layout from "../../../Template/LayaoutNav.jsx";
import { useState, useEffect } from "react";
import { getSellosApi, editarSelloApi, eliminarSelloApi } from "../../../Services/pedidoService";
import Input from "../../../Components/atoms/input.jsx";
import Button from "../../../Components/atoms/button.jsx";
import SelectorToggle from "../../../Components/atoms/SelectorToggle.jsx";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function TodosSellos() {
    const [sellos, setSellos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");

    useEffect(() => {
        getSellosApi().then((res) => {
            setSellos(res.data);
            setCargando(false);
        });
    }, []);

    const eliminarSello = async (id) => {
    if (!confirm("¿Eliminar este sello?")) return;
    await eliminarSelloApi(id);
    setSellos(sellos.filter((s) => s.id !== id));
};

    const sellosFiltrados = sellos.filter((s) => {
        const coincideBusqueda = busqueda
            ? s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
              s.apellido1.toLowerCase().includes(busqueda.toLowerCase()) ||
              s.codigo_sello.includes(busqueda) ||
              String(s.numero_colegiado).includes(busqueda)
            : true;
        const coincideTipo = filtroTipo ? s.tipo_sello === filtroTipo : true;
        const coincideProvincia = filtroProvincia ? s.prefijo_postal == filtroProvincia : true;
        return coincideBusqueda && coincideTipo && coincideProvincia;
    });
    const [selloEditando, setSelloEditando] = useState(null);
    const [formEdit, setFormEdit] = useState({});

    const guardarEdicion = async () => {
    await editarSelloApi(selloEditando.id, formEdit);
    const res = await getSellosApi();
    setSellos(res.data);
    setSelloEditando(null);
};

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Todos los Sellos</h1>

                {/* FILTROS */}
                <div className="flex gap-4 bg-white border rounded-xl p-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, colegiado o código..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm text-gray-700 w-72"
                    />
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="manual">Manual</option>
                        <option value="automatico">Automático</option>
                    </select>
                    <select
                        value={filtroProvincia}
                        onChange={(e) => setFiltroProvincia(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Todas las provincias</option>
                        {Object.entries(PROVINCIAS).map(([key, val]) => (
                            <option key={key} value={key}>{val}</option>
                        ))}
                    </select>
                    {(busqueda || filtroTipo || filtroProvincia) && (
                        <button
                            onClick={() => { setBusqueda(""); setFiltroTipo(""); setFiltroProvincia(""); }}
                            className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2"
                        >
                            Limpiar filtros
                        </button>
                    )}
                    <span className="self-center text-xs text-gray-400 ml-auto">
                        {sellosFiltrados.length} sellos
                    </span>
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
                                <th className="text-left px-4 py-3">Acción</th>
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
                                        No hay sellos
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
                                            {s.veces_generado > 0 ? (
                                                <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                                    {s.veces_generado}x
                                                </span>
                                            ) : (
                                                <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                                    1ª vez
                                                </span>
                                            )}
                                        </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelloEditando(s);
                                                                setFormEdit({
                                                                    prefijo_postal:   s.prefijo_postal,
                                                                    numero_colegiado: s.numero_colegiado,
                                                                    nombre:           s.nombre,
                                                                    apellido1:        s.apellido1,
                                                                    apellido2:        s.apellido2 ?? "",
                                                                    tipo_sello:       s.tipo_sello,
                                                                });
                                                            }}
                                                            className="text-xs text-blue-400 hover:text-blue-600 border border-blue-200 rounded-lg px-3 py-1"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => eliminarSello(s.id)}
                                                            className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1"
                                                        >
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
            </div>
            {selloEditando && (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 space-y-4 w-96">
            <h2 className="text-sm font-semibold text-gray-700">
                Editar Sello — {selloEditando.codigo_sello}
            </h2>

            <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Prefijo postal" value={formEdit.prefijo_postal}
                    onChange={(e) => setFormEdit({ ...formEdit, prefijo_postal: e.target.value })} />
                <Input placeholder="Número colegiado" value={formEdit.numero_colegiado}
                    onChange={(e) => setFormEdit({ ...formEdit, numero_colegiado: e.target.value })} />
                <Input placeholder="Nombre" value={formEdit.nombre}
                    onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} />
                <Input placeholder="Apellido 1" value={formEdit.apellido1}
                    onChange={(e) => setFormEdit({ ...formEdit, apellido1: e.target.value })} />
            </div>
            <Input placeholder="Apellido 2 (opcional)" value={formEdit.apellido2}
                onChange={(e) => setFormEdit({ ...formEdit, apellido2: e.target.value })} />

            <SelectorToggle
                value={formEdit.tipo_sello}
                onChange={(val) => setFormEdit({ ...formEdit, tipo_sello: val })}
                options={[
                    { value: "manual", label: "Manual" },
                    { value: "automatico", label: "Automático" },
                ]}
            />

            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => setSelloEditando(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-2"
                >
                    Cancelar
                </button>
                <Button variant="primary" onClick={guardarEdicion}>
                    Guardar
                </Button>
            </div>
        </div>
    </div>
)}
        </Layout>
    );
}