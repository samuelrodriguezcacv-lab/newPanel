import { useState, useEffect } from "react";
import {
    getPedidosApi,
    crearPedidoApi,
    crearTareaLogisticaApi,
    crearSelloApi,
    asignarSellosATareaApi
} from "../Services/pedidoService";

export function usePedidoFlow(tareaLogisticaId = null) {

    const [pedidos, setPedidos] = useState([]);
    const [pedido, setPedido] = useState(null);

    const [tareaLogistica, setTareaLogistica] = useState(null);

    const [sellosAcumulados, setSellosAcumulados] = useState([]);

    const [sello, setSello] = useState({
        prefijo_postal: "",
        numero_colegiado: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        tipo_sello: "manual"
    });

    /* =========================
       LOAD PEDIDOS
    ========================= */
    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        const res = await getPedidosApi();
        setPedidos(res.data);
    };

    /* =========================
       PEDIDO
    ========================= */
    const crearPedido = async () => {
        const res = await crearPedidoApi();
        setPedido(res.data);
    };

    const seleccionarPedido = (p) => {
        setPedido(p);
    };

    /* =========================
       TAREA LOGÍSTICA
    ========================= */
    const crearTareaLogistica = async (data) => {
        const res = await crearTareaLogisticaApi(data);
        setTareaLogistica(res.data);
        return res.data;
    };

    /* =========================
       SELLLO INDIVIDUAL
    ========================= */
    const acumularSello = async () => {
        const res = await crearSelloApi(sello);

        setSellosAcumulados(prev => [...prev, res.data.sello]);

        setSello({
            prefijo_postal: "",
            numero_colegiado: "",
            nombre: "",
            apellido1: "",
            apellido2: "",
            tipo_sello: "manual"
        });
    };

    /* =========================
       CONFIRMAR SELLLOS → TAREA
    ========================= */
    const confirmarSellos = async () => {
        if (!tareaLogistica) {
            throw new Error("No hay tarea logística creada");
        }

        await asignarSellosATareaApi(
            tareaLogistica.id,
            sellosAcumulados.map(s => s.id)
        );

        setSellosAcumulados([]);
    };

    return {
        pedidos,
        pedido,
        setPedido,
        crearPedido,
        seleccionarPedido,

        tareaLogistica,
        setTareaLogistica,
        crearTareaLogistica,

        sello,
        setSello,

        sellosAcumulados,
        acumularSello,
        confirmarSellos
    };
}