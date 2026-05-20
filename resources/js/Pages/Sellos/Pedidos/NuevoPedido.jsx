import { useEffect } from "react";
import Layout from "../../../Template/LayaoutNav.jsx";
import Button from "../../../Components/atoms/button.jsx";
import Input from "../../../Components/atoms/input.jsx";
import SelectorToggle from "../../../Components/atoms/SelectorToggle.jsx";
import ErrorCampo from "../../../Components/atoms/ErrorCampo.jsx";
import { usePedidoFlow } from "../../../Hooks/usePedidoFlow.jsx";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export default function NuevoPedido() {

    const {
        pedidos, pedido, setPedido,
        tareaCreada, setTareaCreada,
        sello, setSello,
        sellosAcumulados,
        cargando, cargandoSello,editarSelloAcumulado,
        eliminarSellosAcumulados,erroresSello,editandoIndex,
        crearPedido, seleccionarPedido, cambiarPedido, cerrarPedido,
        acumularSello, confirmarSellos, nuevaTarea,
        tareaUrl, tareaLogisticaId,
        feedbackModal,
    } = usePedidoFlow();

    const safeSellos = Array.isArray(sellosAcumulados) ? sellosAcumulados : [];

    return (
        <Layout>
            {feedbackModal}
            <div className="max-w-5xl mx-auto p-6 space-y-4">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nuevo Pedido</h1>
                    <p className="text-sm text-slate-500 mt-1">Pedido → Tarea → Sellos</p>
                </div>

                {/* CAJA PEDIDO */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* CABECERA PEDIDO */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">P</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">Pedido activo</p>
                                <p className="font-bold text-slate-800">
                                    {pedido ? pedido.numero_pedido : 'Sin pedido seleccionado'}
                                </p>
                            </div>
                        </div>
                        {pedido && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                    pedido.estado === 'cerrado' ? 'bg-red-50 text-red-600' :
                                    pedido.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
                                    'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {pedido.estado ?? 'abierto'}
                                </span>
                                {pedido.estado !== 'cerrado' && (
                                    <button onClick={cerrarPedido}
                                        className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1.5">
                                        Cerrar
                                    </button>
                                )}
                                <button onClick={cambiarPedido}
                                    className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5">
                                    Cambiar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CONTENIDO PEDIDO */}
                    <div className="p-6">
                        {!pedido ? (
                            <div className="space-y-4">
                                <Button variant="primary" onClick={crearPedido} disabled={cargando}>
                                    {cargando ? "Creando..." : "+ Nuevo Pedido"}
                                </Button>
                                {pedidos.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase">O selecciona uno existente</p>
                                        <div className="flex flex-wrap gap-2">
                                            {pedidos.map(p => (
                                                <button key={p.id} onClick={() => seleccionarPedido(p)}
                                                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm flex gap-2 items-center">
                                                    <span className="font-semibold text-slate-700">{p.numero_pedido}</span>
                                                    <span className="text-slate-400">{p.tareas?.length ?? 0} tareas</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        p.estado === 'cerrado' ? 'bg-red-50 text-red-600' :
                                                        'bg-emerald-50 text-emerald-600'
                                                    }`}>{p.estado ?? 'abierto'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (

                            <div className="space-y-4">

                                {/* CAJA TAREA */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">

                                    {/* CABECERA TAREA */}
                                    <div className="px-5 py-3 border-b border-blue-200 flex justify-between items-center bg-blue-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">T</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-blue-400 uppercase">Tarea</p>
                                                {tareaCreada ? (
                                                    <p className="font-bold text-blue-800 text-lg">
                                                        #{tareaCreada.numero_tarea}
                                                        {tareaLogisticaId && (
                                                            <span className="ml-2 text-xs font-normal text-blue-500">desde logística</span>
                                                        )}
                                                    </p>
                                                ) : tareaUrl ? (
                                                    <p className="font-bold text-blue-600 text-sm">
                                                        Creando tarea #{tareaUrl}...
                                                    </p>
                                                ) : (
                                                    <p className="font-medium text-blue-600 text-sm">Sin tarea asignada</p>
                                                )}
                                            </div>
                                        </div>
                                        {tareaCreada && (
                                            <button onClick={nuevaTarea}
                                                className="text-xs text-blue-500 hover:text-blue-700 border border-blue-300 rounded-lg px-3 py-1.5 bg-white">
                                                + Nueva tarea
                                            </button>
                                        )}
                                    </div>

                                    {/* CONTENIDO TAREA */}
                                    <div className="p-5">

                                        {/* CAJA SELLOS */}
                                        {tareaCreada ? (
                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                                                {/* CABECERA SELLOS */}
                                                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">S</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-400 uppercase">Sellos</p>
                                                            <p className="text-xs text-slate-500">
                                                                Tarea <span className="font-bold text-slate-700">#{tareaCreada.numero_tarea}</span>
                                                                · {PROVINCIAS[tareaCreada.provincia] ?? tareaCreada.provincia}
                                                                · {safeSellos.length}/18 acumulados
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* FORMULARIO SELLOS */}
                                                <div className="p-5 grid grid-cols-2 gap-5">

                                                    {/* IZQUIERDA — Formulario */}
                                                    <div className="space-y-3">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase">Datos del colegiado</p>

                                                        <div className="grid grid-cols-3 gap-2">
                                                            <Input placeholder="Prefijo" value={sello.prefijo_postal}
                                                                onChange={e => setSello({...sello, prefijo_postal: e.target.value})}/>
                                                            <div className="col-span-2">
                                                                <Input placeholder="Nº colegiado" value={sello.numero_colegiado}
                                                                    onChange={e => setSello({...sello, numero_colegiado: e.target.value})}/>
                                                            </div>
                                                        </div>
                                                        <ErrorCampo errores={erroresSello} campo="prefijo_postal"/>
                                                        <ErrorCampo errores={erroresSello} campo="numero_colegiado"/>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <Input placeholder="Nombre" value={sello.nombre}
                                                                    onChange={e => setSello({...sello, nombre: e.target.value})}/>
                                                                <ErrorCampo errores={erroresSello} campo="nombre"/>
                                                            </div>
                                                            <div>
                                                                <Input placeholder="Apellido 1" value={sello.apellido1}
                                                                    onChange={e => setSello({...sello, apellido1: e.target.value})}/>
                                                                <ErrorCampo errores={erroresSello} campo="apellido1"/>
                                                            </div>
                                                        </div>

                                                        <Input placeholder="Apellido 2 (opcional)" value={sello.apellido2}
                                                            onChange={e => setSello({...sello, apellido2: e.target.value})}/>

                                                        <SelectorToggle
                                                            value={sello.tipo_sello}
                                                            onChange={val => setSello({...sello, tipo_sello: val})}
                                                            options={[
                                                                { value: "manual", label: "Manual" },
                                                                { value: "automatico", label: "Automático" },
                                                            ]}/>

<Button variant="primary" onClick={acumularSello} disabled={cargandoSello}>
    {cargandoSello 
        ? "Guardando..." 
        : editandoIndex !== null 
            ? "✏️ Actualizar sello" 
            : "Acumular Sello"}
</Button>

{/* Botón cancelar edición */}
{editandoIndex !== null && (
    <button
        type="button"
        onClick={() => {
            setEditandoIndex(null);
            setSello({
                prefijo_postal: "", numero_colegiado: "", nombre: "",
                apellido1: "", apellido2: "", tipo_sello: "manual"
            });
        }}
        className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 transition-colors">
        Cancelar edición
    </button>
)}
                                                    </div>

                                                    {/* DERECHA — Acumulados */}
                                                    <div className="space-y-3">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase">Acumulados</p>

                                                        {safeSellos.length === 0 ? (
                                                            <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                                <p className="text-xs text-slate-400">No hay sellos acumulados</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
{safeSellos.map((s, i) => (
    <div key={s.id ?? i}
        className={`flex justify-between items-center border rounded-xl px-3 py-2.5 transition-all ${
            editandoIndex === i
                ? 'bg-blue-50 border-blue-300'
                : 'bg-slate-50 border-slate-100'
        }`}>
        <div>
            <p className="font-semibold text-slate-700 text-sm">
                {s.nombre} {s.apellido1}
            </p>
            <p className="text-xs text-slate-400 font-mono">{s.codigo_sello}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                s.tipo_sello === "manual"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-purple-50 text-purple-600"
            }`}>
                {s.tipo_sello}
            </span>
            <button
                onClick={() => editarSelloAcumulado(i)}
                className="text-xs text-blue-400 hover:text-blue-600 border border-blue-200 rounded-lg px-2 py-1">
                ✏️
            </button>
            <button
                onClick={() => eliminarSellosAcumulados(i)}
                className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-2 py-1">
                🗑️
            </button>
        </div>
    </div>
))}
                                                            </div>
                                                        )}

                                                        {safeSellos.length > 0 && (
                                                            <Button variant="secondary" onClick={confirmarSellos}>
                                                                Añadir al pedido ✅
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-blue-400">
                                                <p className="text-sm">
                                                    {tareaUrl ? 'Preparando tarea...' : 'Sin tarea asignada'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
