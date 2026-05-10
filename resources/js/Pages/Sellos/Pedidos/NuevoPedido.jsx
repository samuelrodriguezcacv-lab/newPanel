import Layout from "../../../Template/LayaoutNav.jsx";
import Button from "../../../Components/atoms/button.jsx";
import Input from "../../../Components/atoms/input.jsx";
import SelectorToggle from "../../../Components/atoms/SelectorToggle.jsx";
import ErrorCampo from "../../../Components/atoms/ErrorCampo.jsx";
import { usePedidoFlow } from "../../../Hooks/usePedidoFlow.jsx";

export default function NuevoPedido() {

    const {
        pedidos, pedido, setPedido,
        tarea, setTarea, tareaCreada,
        sello, setSello, sellosAcumulados,
        cargando, cargandoTarea, cargandoSello,
        crearPedido, crearTarea, acumularSello,
        confirmarSellos, cambiarPedido, nuevaTarea,
        seleccionarPedido, cerrarPedido, erroresTarea, erroresSello,
    } = usePedidoFlow();

    return (
        <Layout>
            <div className="p-6 space-y-6">

                {/* TITULO */}
                <h1 className="text-2xl font-bold text-gray-900">
                    Nuevo Pedido
                </h1>

                {/* PASO 1 — SELECCIÓN DE PEDIDO */}
                {!pedido ? (
                    <div className="space-y-3">
                        <Button variant="primary" onClick={crearPedido} disabled={cargando}>
                            {cargando ? "Creando..." : "Nuevo Pedido"}
                        </Button>

                        {pedidos.length > 0 && (
                            <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-2">
                                <p className="text-sm text-gray-500 font-medium">
                                    O selecciona un pedido existente:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {pedidos.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => seleccionarPedido(p)}
                                            className="text-left px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm flex gap-2 items-center"
                                        >
                                            <span className="font-semibold text-gray-700">
                                                Pedido {p.numero_pedido}
                                            </span>
                                            <span className="text-gray-400">
                                                {p.tareas?.length ?? 0} tareas
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                p.estado === 'cerrado' ? 'bg-red-50 text-red-600' :
                                                p.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
                                                'bg-green-50 text-green-600'
                                            }`}>
                                                {p.estado ?? 'abierto'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                ) : (

                    // PASO 2 — PEDIDO ACTIVO
                    <div className="space-y-6">

                        {/* CABECERA PEDIDO */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                            <div>
                                <p className="text-green-700 font-semibold">
                                    ✅ Pedido {pedido.numero_pedido}
                                </p>
                                <p className="text-sm">
                                    Estado: <span className={`font-medium ${
                                        pedido.estado === 'cerrado' ? 'text-red-500' :
                                        pedido.estado === 'enviado' ? 'text-blue-500' :
                                        'text-green-500'
                                    }`}>{pedido.estado ?? 'abierto'}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {pedido.estado !== 'cerrado' && (
                                    <button
                                        onClick={cerrarPedido}
                                        className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1"
                                    >
                                        Cerrar pedido
                                    </button>
                                )}
                                <button
                                    onClick={cambiarPedido}
                                    className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-1"
                                >
                                    Cambiar pedido
                                </button>
                            </div>
                        </div>

                        {/* PASO 3 — FORMULARIO TAREA */}
                        {!tareaCreada && pedido.estado !== 'cerrado' && (
                            <div className="bg-white border rounded-xl p-4 space-y-3">
                                <h2 className="text-sm font-semibold text-gray-700">Nueva Tarea</h2>
                                <Input
                                    placeholder="Número de tarea"
                                    value={tarea.Tarea}
                                    onChange={(e) => setTarea({ ...tarea, Tarea: e.target.value })}
                                />
                                <ErrorCampo errores={erroresTarea} campo="Tarea" />
                                <select
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700"
                                    value={tarea.provincia}
                                    onChange={(e) => setTarea({ ...tarea, provincia: e.target.value })}
                                >
                                    <option value="">Selecciona provincia</option>
                                    <option value="4">Almería</option>
                                    <option value="11">Cádiz</option>
                                    <option value="14">Córdoba</option>
                                    <option value="18">Granada</option>
                                    <option value="21">Huelva</option>
                                    <option value="23">Jaén</option>
                                    <option value="29">Málaga</option>
                                    <option value="41">Sevilla</option>
                                </select>
                                <ErrorCampo errores={erroresTarea} campo="provincia" />
                                <Input
                                    type="date"
                                    value={tarea.fecha}
                                    onChange={(e) => setTarea({ ...tarea, fecha: e.target.value })}
                                />
                                <ErrorCampo errores={erroresTarea} campo="fecha" />
                                <Button variant="primary" onClick={crearTarea} disabled={cargandoTarea}>
                                    {cargandoTarea ? "Creando..." : "Asignar Tarea"}
                                </Button>
                            </div>
                        )}

                        {/* MENSAJE PEDIDO CERRADO */}
                        {pedido.estado === 'cerrado' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                                🔒 Este pedido está cerrado. No se pueden añadir más tareas.
                            </div>
                        )}

                        {/* PASO 4 — FORMULARIO SELLOS */}
                        {tareaCreada && (
                            <div className="grid grid-cols-2 gap-4">

                                {/* IZQUIERDA — Formulario sello */}
                                <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-semibold text-gray-700">
                                            Añadir Sellos — Tarea {tareaCreada.Tarea}
                                        </h2>
                                        <button
                                            onClick={nuevaTarea}
                                            className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-1"
                                        >
                                            + Nueva Tarea
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input placeholder="Prefijo postal" value={sello.prefijo_postal}
                                                onChange={(e) => setSello({ ...sello, prefijo_postal: e.target.value })} />
                                                <ErrorCampo errores={erroresSello} campo="prefijo_postal" />

                                            <Input placeholder="Número colegiado" value={sello.numero_colegiado}
                                                onChange={(e) => setSello({ ...sello, numero_colegiado: e.target.value })} className="col-span-2" />
                                                <ErrorCampo errores={erroresSello} campo="numero_colegiado" />

                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Nombre" value={sello.nombre}
                                                onChange={(e) => setSello({ ...sello, nombre: e.target.value })} />
                                                <ErrorCampo errores={erroresSello} campo="nombre" />
                                            <Input placeholder="Apellido 1" value={sello.apellido1}
                                                onChange={(e) => setSello({ ...sello, apellido1: e.target.value })} />
                                                <ErrorCampo errores={erroresSello} campo="apellido1" />
                                        </div>
                                        <Input placeholder="Apellido 2 (opcional)" value={sello.apellido2}
                                            onChange={(e) => setSello({ ...sello, apellido2: e.target.value })} />
                                            <ErrorCampo errores={erroresSello} campo="apellido2" />
                                    </div>

                                    <SelectorToggle
                                        value={sello.tipo_sello}
                                        onChange={(val) => setSello({ ...sello, tipo_sello: val })}
                                        options={[
                                            { value: "manual", label: "Manual" },
                                            { value: "automatico", label: "Automático" },
                                        ]}
                                    />

                                    <Button variant="primary" onClick={acumularSello} disabled={cargandoSello}>
                                        {cargandoSello ? "Añadiendo..." : "Acumular Sello"}
                                    </Button>
                                </div>

                                {/* DERECHA — Sellos acumulados */}
                                <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-semibold text-gray-700">
                                            Sellos acumulados
                                        </h2>
                                        <span className="text-xs text-gray-400">
                                            {sellosAcumulados.length}/18
                                        </span>
                                    </div>

                                    {sellosAcumulados.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-8">
                                            No hay sellos acumulados aún
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {sellosAcumulados.map((s, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-sm">
                                                    <div>
                                                        <p className="font-medium text-gray-700">{s.nombre} {s.apellido1}</p>
                                                        <p className="text-xs text-gray-400">{s.codigo_sello}</p>
                                                    </div>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        s.tipo_sello === "manual"
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "bg-purple-50 text-purple-600"
                                                    }`}>
                                                        {s.tipo_sello}
                                                    </span>
                                                </div>
                                            ))}
                                            <Button variant="secondary" onClick={confirmarSellos}>
                                                Añadir al pedido ✅
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}