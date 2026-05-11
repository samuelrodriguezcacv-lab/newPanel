import { useState, useEffect } from "react";
import {
    crearPedidoApi, getPedidosApi, crearTareaApi,
    crearSelloApi, asignarSellosApi, cerrarPedidoApi, getPedidoApi, actualizarEstadoPedidoApi
} from "../Services/pedidoService";

export function usePedidoFlow() {
    const [pedidos, setPedidos] = useState([]);
    const [pedido, setPedido] = useState(null);
    const [tarea, setTarea] = useState({ Tarea: "", provincia: "", fecha: "" });
    const [tareaCreada, setTareaCreada] = useState(null);
    const [sello, setSello] = useState({
        prefijo_postal: "", numero_colegiado: "", nombre: "",
        apellido1: "", apellido2: "", tipo_sello: "manual",
    });
    const [sellosAcumulados, setSellosAcumulados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [cargandoTarea, setCargandoTarea] = useState(false);
    const [cargandoSello, setCargandoSello] = useState(false);
    const [erroresTarea, setErroresTarea] = useState({});
    const [erroresSello, setErroresSello] = useState({});

    useEffect(() => {
        const pedidoGuardado = localStorage.getItem("pedido_activo");
        const tareaGuardada = localStorage.getItem("tarea_activa");
        const sellosGuardados = localStorage.getItem("sellos_acumulados");

        if (tareaGuardada) setTareaCreada(JSON.parse(tareaGuardada));
        if (sellosGuardados) setSellosAcumulados(JSON.parse(sellosGuardados));

        // Siempre refresca el pedido desde la API para tener las tareas actualizadas
        if (pedidoGuardado) {
            const p = JSON.parse(pedidoGuardado);
            getPedidoApi(p.id).then((res) => {
                setPedido(res.data);
                localStorage.setItem("pedido_activo", JSON.stringify(res.data));
            });
        }

        getPedidosApi().then((res) => setPedidos(res.data));
    }, []);

    const crearPedido = async () => {
        setCargando(true);
        try {
            const res = await crearPedidoApi();
            setPedido(res.data);
            setPedidos([res.data, ...pedidos]);
            localStorage.setItem("pedido_activo", JSON.stringify(res.data));
        } finally {
            setCargando(false);
        }
    };

    const seleccionarTarea = (t) => {
        setTareaCreada(t);
        localStorage.setItem("tarea_activa", JSON.stringify(t));
    };

    const crearTarea = async () => {
        setCargandoTarea(true);
        setErroresTarea({});
        try {
            const res = await crearTareaApi({
                ...tarea, estado: "pendiente", pedido_id: pedido.id,
            });
            setTareaCreada(res.data);
            localStorage.setItem("tarea_activa", JSON.stringify(res.data));

            // Refresca el pedido para que aparezca la nueva tarea en la lista
            const pedidoRes = await getPedidoApi(pedido.id);
            setPedido(pedidoRes.data);
            localStorage.setItem("pedido_activo", JSON.stringify(pedidoRes.data));

        } catch (err) {
            if (err.response?.status === 422) {
                setErroresTarea(err.response.data.errors);
            }
        } finally {
            setCargandoTarea(false);
        }
    };

    const cerrarPedido = async () => {
        try {
            await cerrarPedidoApi(pedido.id);
            const pedidoCerrado = { ...pedido, estado: 'cerrado' };
            setPedido(pedidoCerrado);
            localStorage.setItem("pedido_activo", JSON.stringify(pedidoCerrado));
        } catch (err) {
            console.error(err.response?.data);
        }
    };

    const confirmarSellos = async () => {
        await asignarSellosApi(tareaCreada.id, sellosAcumulados.map((s) => s.id));
        setSellosAcumulados([]);
        setTareaCreada(null);
        setTarea({ Tarea: "", provincia: "", fecha: "" });
        localStorage.removeItem("tarea_activa");
        localStorage.removeItem("sellos_acumulados");

        // Refresca el pedido para actualizar el contador de sellos por tarea
        const pedidoRes = await getPedidoApi(pedido.id);
        setPedido(pedidoRes.data);
        localStorage.setItem("pedido_activo", JSON.stringify(pedidoRes.data));
    };

    const cambiarPedido = () => {
        setPedido(null);
        setTareaCreada(null);
        setSellosAcumulados([]);
        setTarea({ Tarea: "", provincia: "", fecha: "" });
        localStorage.removeItem("pedido_activo");
        localStorage.removeItem("tarea_activa");
        localStorage.removeItem("sellos_acumulados");
    };

    const nuevaTarea = () => {
        setTareaCreada(null);
        setSellosAcumulados([]);
        setTarea({ Tarea: "", provincia: "", fecha: "" });
        localStorage.removeItem("tarea_activa");
        localStorage.removeItem("sellos_acumulados");
    };

    const seleccionarPedido = async (p) => {
        const res = await getPedidoApi(p.id);
        setPedido(res.data);
        localStorage.setItem("pedido_activo", JSON.stringify(res.data));
    };

    const acumularSello = async () => {
        setCargandoSello(true);
        setErroresSello({});
        try {
            const res = await crearSelloApi(sello);
            const { sello: selloData, repetido, mensaje, pedidos } = res.data;
            if (repetido) {
                const pedidosTexto = pedidos.length > 0
                    ? `Apareció en los pedidos: ${pedidos.join(', ')}`
                    : '';
                alert(`⚠️ ${mensaje}\n${pedidosTexto}`);
            }
            const nuevos = [...sellosAcumulados, selloData];
            setSellosAcumulados(nuevos);
            localStorage.setItem("sellos_acumulados", JSON.stringify(nuevos));
            setSello({
                prefijo_postal: "", numero_colegiado: "", nombre: "",
                apellido1: "", apellido2: "", tipo_sello: "manual",
            });
        } catch (err) {
            if (err.response?.status === 422) {
                setErroresSello(err.response.data.errors);
            }
        } finally {
            setCargandoSello(false);
        }
    };

    return {
        pedidos, pedido, setPedido,
        tarea, setTarea, tareaCreada,
        sello, setSello, sellosAcumulados,
        cargando, cargandoTarea, cargandoSello,
        crearPedido, crearTarea, acumularSello,
        confirmarSellos, cambiarPedido, nuevaTarea,
        seleccionarPedido, cerrarPedido, erroresTarea, erroresSello, seleccionarTarea,
    };
}