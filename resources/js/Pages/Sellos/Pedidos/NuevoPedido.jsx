import { useEffect } from "react";
import Layout from "../../../Template/LayaoutNav.jsx";
import Button from "../../../Components/atoms/button.jsx";
import { usePedidoFlow } from "../../../Hooks/usePedidoFlow.jsx";

export default function NuevoPedido() {

    const tareaLogisticaId = new URLSearchParams(window.location.search)
        .get("tarea_logistica_id");

    const {
        pedidos,
        pedido,
        sellosAcumulados,
        crearPedido,
        seleccionarPedido,
        cerrarPedido,
        cambiarPedido,
        crearTareaLogistica,
        tareaLogistica,
        setTareaLogistica,
        acumularSello,
        confirmarSellos,
        sello,
        setSello,
    } = usePedidoFlow(tareaLogisticaId);

    const tareaDeUrl = new URLSearchParams(window.location.search)
        .get("tarea");

    const safeSellos = Array.isArray(sellosAcumulados)
        ? sellosAcumulados
        : [];

    /* =========================
       AUTO CARGA TAREA LOGISTICA
    ========================== */
    useEffect(() => {
        if (tareaLogisticaId && !tareaLogistica) {
            setTareaLogistica({ id: tareaLogisticaId });
        }
    }, [tareaLogisticaId]);

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6 space-y-4">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold">Nuevo Pedido</h1>
                    <p className="text-sm text-slate-500">
                        Pedido → TareaLogistica → Sellos
                    </p>
                </div>

                {/* PEDIDO */}
                <div className="bg-white border rounded-2xl">

                    {/* HEADER PEDIDO */}
                    <div className="px-6 py-4 border-b flex justify-between">
                        <div>
                            <p className="text-xs uppercase text-slate-400">
                                Pedido activo
                            </p>
                            <p className="font-bold">
                                {pedido?.numero_pedido ?? "Sin pedido"}
                            </p>
                        </div>

                        {pedido && (
                            <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 rounded bg-slate-100">
                                    {pedido.estado ?? "abierto"}
                                </span>

                                {pedido.estado !== "cerrado" && (
                                    <button
                                        onClick={cerrarPedido}
                                        className="text-red-500 text-xs"
                                    >
                                        Cerrar
                                    </button>
                                )}

                                <button
                                    onClick={cambiarPedido}
                                    className="text-slate-500 text-xs"
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CONTENIDO */}
                    <div className="p-6">

                        {!pedido ? (
                            <div className="space-y-3">

                                <Button onClick={crearPedido}>
                                    + Nuevo Pedido
                                </Button>

                                {(pedidos ?? []).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(pedidos ?? []).map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => seleccionarPedido(p)}
                                                className="border px-3 py-2 rounded"
                                            >
                                                {p.numero_pedido}{" "}
                                                ({p.tareas?.length ?? 0})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* TAREA LOGISTICA */}
                                <div className="border rounded-xl p-4">

                                    <p className="font-bold">
                                        Tarea logística #
                                        {tareaLogistica?.id ??
                                            tareaDeUrl ??
                                            "—"}
                                    </p>

                                    {/* SELLOS */}
                                    {(tareaLogistica || tareaDeUrl) && (
                                        <div className="mt-4 border rounded-xl p-4">

                                            <p className="text-xs mb-2">
                                                Sellos: {safeSellos.length}/18
                                            </p>

                                            {/* LISTA */}
                                            <div className="space-y-2 max-h-60 overflow-y-auto">

                                                {safeSellos.length === 0 ? (
                                                    <p className="text-xs text-slate-400">
                                                        Sin sellos
                                                    </p>
                                                ) : (
                                                    safeSellos.map((s, i) => (
                                                        <div
                                                            key={s.id || i}
                                                            className="border p-2 rounded flex justify-between"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-bold">
                                                                    {s.numero_colegiado}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {s.nombre}{" "}
                                                                    {s.apellido1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}

                                            </div>

                                            {/* BOTÓN CONFIRMAR */}
                                            {safeSellos.length > 0 && (
                                                <Button
                                                    onClick={confirmarSellos}
                                                >
                                                    Guardar en tarea logística
                                                </Button>
                                            )}

                                        </div>
                                    )}

                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Layout>
    );
}