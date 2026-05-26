import { useEffect, useMemo, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import { getPedidosApi, getPedidoApi, actualizarEstadoPedidoApi, eliminarSelloApi, eliminarTareaApi } from "../Services/pedidoService";
import {
    generarPdfEmpresaPedido,
    generarPdfHojaPedido,
    generarPdfRepetidosPedido,
    obtenerOpcionesHojasPedido,
} from "../Utils/generarPdfPedido";

export function usePedidosList({ notify, confirm }) {
    const [pedidos, setPedidos] = useState([]);
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [hojasSeleccionadas, setHojasSeleccionadas] = useState({});

    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1]);
    const resaltar = params.get("resaltar");
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
        setPedidos(pedidos.map((p) => (p.id === pedido.id ? { ...p, estado } : p)));
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
            title: "Quitar sello",
            message: "Se quitara este sello de la tarea. El sello seguira existiendo en el catalogo.",
            tone: "warning",
            confirmText: "Quitar",
        });
        if (!ok) return;

        await eliminarSelloApi(tareaId, selloId);
        const res = await getPedidoApi(pedidoDetalle.id);
        setPedidoDetalle(res.data);
        await notify({ title: "Sello quitado", message: "El sello se quito de la tarea correctamente.", tone: "success" });
    };

    const eliminarTarea = async (tareaId) => {
        const ok = await confirm({
            title: "Eliminar tarea",
            message: "Se eliminara esta tarea y todos sus sellos asignados.",
            tone: "danger",
            confirmText: "Eliminar",
        });
        if (!ok) return;

        await eliminarTareaApi(tareaId);
        const res = await getPedidoApi(pedidoDetalle.id);
        setPedidoDetalle(res.data);
        await notify({ title: "Tarea eliminada", message: "La tarea se elimino correctamente.", tone: "success" });
    };

    const descargarPdfEmpresa = async (pedido) => {
        const res = await getPedidoApi(pedido.id);
        await generarPdfEmpresaPedido(res.data);
    };

    const descargarPdfHoja = async (pedido) => {
        const seleccion = hojasSeleccionadas[pedido.id] ?? obtenerOpcionesHojasPedido(pedido)[0]?.value;

        if (!seleccion) {
            await notify({ title: "Sin sellos", message: "Este pedido no tiene hojas por provincia para descargar.", tone: "warning" });
            return;
        }

        const [provincia, tipo] = seleccion.split(":");
        const res = await getPedidoApi(pedido.id);
        await generarPdfHojaPedido(res.data, provincia, tipo);
    };

    const descargarPdfRepetidos = async (pedido) => {
        const res = await getPedidoApi(pedido.id);
        await generarPdfRepetidosPedido(res.data);
    };

    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((p) => {
            const coincideFecha = filtroFecha ? p.fecha === filtroFecha : true;
            const coincideProvincia = filtroProvincia
                ? p.tareas?.some((t) => (t.provincia ?? t.tarea_logistica?.provincia) == filtroProvincia)
                : true;
            return coincideFecha && coincideProvincia;
        });
    }, [pedidos, filtroFecha, filtroProvincia]);

    return {
        pedidos,
        filtroFecha,
        setFiltroFecha,
        filtroProvincia,
        setFiltroProvincia,
        pedidoDetalle,
        cargando,
        hojasSeleccionadas,
        setHojasSeleccionadas,
        resaltar,
        resaltadoRef,
        cambiarEstadoPedido,
        verDetalle,
        eliminarSello,
        eliminarTarea,
        descargarPdfEmpresa,
        descargarPdfHoja,
        descargarPdfRepetidos,
        pedidosFiltrados,
    };
}
