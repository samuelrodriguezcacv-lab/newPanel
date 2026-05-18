import { useState, useEffect } from "react";
import {
    getPedidosApi,
    crearPedidoApi,
    crearSelloApi,
    asignarSellosATareaApi,
    getPedidoApi,
} from "../Services/pedidoService";

export function usePedidoFlow() {

    const [pedidos, setPedidos]               = useState([]);
    const [pedido, setPedido]                 = useState(null);
    const [tareaCreada, setTareaCreada]       = useState(null);
    const [sellosAcumulados, setSellosAcumulados] = useState([]);
    const [cargando, setCargando]             = useState(false);
    const [cargandoSello, setCargandoSello]   = useState(false);
    const [erroresSello, setErroresSello]     = useState({});

    const [sello, setSello] = useState({
        prefijo_postal: "",
        numero_colegiado: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        tipo_sello: "manual"
    });

    // Leer parámetros de la URL
    const params             = new URLSearchParams(window.location.search);
    const tareaUrl           = params.get('tarea');
    const tareaLogisticaId   = params.get('tarea_logistica_id');
    const provinciaUrl       = params.get('provincia');

    /* =========================
       CARGA INICIAL
    ========================= */
useEffect(() => {
    const iniciar = async () => {
        setCargando(true);

        try {
            const res = await getPedidosApi();
            const listaPedidos = res.data;
            setPedidos(listaPedidos);

            const pedidoGuardado = localStorage.getItem('pedido_activo');

            if (pedidoGuardado) {
                const p = JSON.parse(pedidoGuardado);
                const actualizado = listaPedidos.find(lp => lp.id === p.id);

                if (actualizado && actualizado.estado !== 'cerrado') {
                    const detalle = await getPedidoApi(actualizado.id);
                    setPedido(detalle.data);
                    localStorage.setItem('pedido_activo', JSON.stringify(detalle.data));
                    return;
                } else {
                    localStorage.removeItem('pedido_activo');
                }
            }

            const abierto = listaPedidos.find(p => p.estado !== 'cerrado');

            if (abierto) {
                const detalle = await getPedidoApi(abierto.id);
                setPedido(detalle.data);
                localStorage.setItem('pedido_activo', JSON.stringify(detalle.data));
                return;
            }

            // Si no hay ningún pedido abierto, crear uno automáticamente
            const nuevo = await crearPedidoApi();
            const detalleNuevo = await getPedidoApi(nuevo.data.id);

            setPedido(detalleNuevo.data);
            localStorage.setItem('pedido_activo', JSON.stringify(detalleNuevo.data));

        } catch (err) {
            console.error("Error iniciando pedido:", err.response?.data || err);
        } finally {
            setCargando(false);
        }
    };

    iniciar();

    const sellosGuardados = localStorage.getItem('sellos_acumulados');
    if (sellosGuardados) {
        setSellosAcumulados(JSON.parse(sellosGuardados));
    }

}, []);

    /* =========================
       AUTO-CREAR TAREA DESDE URL
    ========================= */
    useEffect(() => {
        if (!pedido || !tareaUrl) return;

        const crearTareaDesdeUrl = async () => {
            // Buscar si ya existe en el pedido
            const tareaExistente = pedido.tareas?.find(
                t => String(t.numero_tarea) === String(tareaUrl)
            );

            if (tareaExistente) {
                setTareaCreada(tareaExistente);
                    console.log("La tarea ")
                localStorage.setItem('tarea_activa', JSON.stringify(tareaExistente));
                return;
            }

            // Crear la tarea automáticamente
           try {
    const tareaActiva = {
        id: Number(tareaLogisticaId),
        numero_tarea: tareaUrl,
        provincia: Number(provinciaUrl || 41),
        pedido_id: pedido.id,
        tareas_logistica_id: Number(tareaLogisticaId),
        estado: 'pendiente',
        fecha: new Date().toISOString().split('T')[0],
    };

    console.log("Tarea logística activa:", tareaActiva);

    setTareaCreada(tareaActiva);
    localStorage.setItem('tarea_activa', JSON.stringify(tareaActiva));
} catch (err) {
    console.error('Error preparando tarea logística:', err);
}
        };

        crearTareaDesdeUrl();
    }, [pedido?.id, tareaUrl]);

    /* =========================
       PEDIDO
    ========================= */
    const crearPedido = async () => {
        setCargando(true);
        try {
            const res = await crearPedidoApi();
            const detalle = await getPedidoApi(res.data.id);
            setPedido(detalle.data);
            localStorage.setItem('pedido_activo', JSON.stringify(detalle.data));
        } finally {
            setCargando(false);
        }
    };

    const seleccionarPedido = async (p) => {
        const detalle = await getPedidoApi(p.id);
        setPedido(detalle.data);
        localStorage.setItem('pedido_activo', JSON.stringify(detalle.data));
    };

    const cambiarPedido = () => {
        setPedido(null);
        setTareaCreada(null);
        setSellosAcumulados([]);
        localStorage.removeItem('pedido_activo');
        localStorage.removeItem('tarea_activa');
        localStorage.removeItem('sellos_acumulados');
    };

    const cerrarPedido = async () => {
        if (!pedido) return;
        try {
            await fetch(`/pedidos/${pedido.id}/cerrar`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } });
            const cerrado = { ...pedido, estado: 'cerrado' };
            setPedido(cerrado);
            localStorage.setItem('pedido_activo', JSON.stringify(cerrado));
        } catch (err) {
            console.error(err);
        }
    };

    /* =========================
       SELLO
    ========================= */
    const acumularSello = async () => {
        if (!tareaCreada) return;
        setCargandoSello(true);
        setErroresSello({});
        try {
            const res = await crearSelloApi(sello);
            const { sello: selloData } = res.data;

            const nuevos = [...sellosAcumulados, selloData];
            setSellosAcumulados(nuevos);
            localStorage.setItem('sellos_acumulados', JSON.stringify(nuevos));

            setSello({
                prefijo_postal: "", numero_colegiado: "", nombre: "",
                apellido1: "", apellido2: "", tipo_sello: "manual"
            });
        } catch (err) {
            if (err.response?.status === 422) {
                setErroresSello(err.response.data.errors);
            }
        } finally {
            setCargandoSello(false);
        }
    };

    const confirmarSellos = async () => {
        if (!tareaCreada || sellosAcumulados.length === 0) return;
        try {
                    await asignarSellosATareaApi({
                pedido_id: pedido.id,
                tareas_logistica_id: tareaCreada.id,
                sellos: sellosAcumulados.map(s => s.id),
            });
            setSellosAcumulados([]);
            localStorage.removeItem('sellos_acumulados');
            alert('✅ Sellos asignados correctamente');
            } catch (err) {
                console.error("Error asignando sellos:", err.response?.data || err);
            }
    };

    const nuevaTarea = () => {
        setTareaCreada(null);
        setSellosAcumulados([]);
        localStorage.removeItem('tarea_activa');
        localStorage.removeItem('sellos_acumulados');
    };

    return {
        pedidos, pedido, setPedido,
        tareaCreada, setTareaCreada,
        sello, setSello,
        sellosAcumulados,
        cargando, cargandoSello,
        erroresSello,
        crearPedido, seleccionarPedido, cambiarPedido, cerrarPedido,
        acumularSello, confirmarSellos, nuevaTarea,
        tareaUrl, tareaLogisticaId,
    };
}