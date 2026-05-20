import { useState, useEffect } from "react";
import {
    getPedidosApi,
    crearPedidoApi,
    crearSelloApi,
    actualizarSelloApi,
    asignarSellosATareaApi,
    getPedidoApi,
} from "../Services/pedidoService";
import axios from "axios";
import { useFeedbackModal } from "./useFeedbackModal.jsx";

export function usePedidoFlow() {
    const { feedbackModal, notify, confirm } = useFeedbackModal();

    const [pedidos, setPedidos]               = useState([]);
    const [pedido, setPedido]                 = useState(null);
    const [tareaCreada, setTareaCreada]       = useState(null);
    const [sellosAcumulados, setSellosAcumulados] = useState([]);
    const [cargando, setCargando]             = useState(false);
    const [cargandoSello, setCargandoSello]   = useState(false);
    const [erroresSello, setErroresSello]     = useState({});
    const [editandoIndex, setEditandoIndex] = useState(null);

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
        const ok = await confirm({
            title: 'Cerrar pedido',
            message: `Vas a cerrar el pedido #${pedido.numero_pedido}. Los proximos sellos entraran en un pedido nuevo.`,
            tone: 'warning',
            confirmText: 'Cerrar pedido',
        });
        if (!ok) return;

        try {
            await fetch(`/pedidos/${pedido.id}/cerrar`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } });
            localStorage.removeItem('pedido_activo');

            const nuevo = await crearPedidoApi();
            const detalleNuevo = await getPedidoApi(nuevo.data.id);

            setPedido(detalleNuevo.data);
            localStorage.setItem('pedido_activo', JSON.stringify(detalleNuevo.data));
        } catch (err) {
            console.error(err);
        }
    };

    /* =========================
       SELLO
    ========================= */


 const eliminarSellosAcumulados = (index) =>{
    const nuevos = sellosAcumulados.filter((_,i)=> i !==index);
    setSellosAcumulados(nuevos);
    localStorage.setItem('sellos_acumulados', JSON.stringify(nuevos));

    if(editandoIndex ===index){
        setEditandoIndex(null);
        setSello({
            prefijo_postal:"", numero_colegiado: "", nombre: "",
            apellido1:"", apellido2:"", tipo_sello:"manual"
        });
    }

 };

const editarSelloAcumulado = (index) =>{
    setEditandoIndex(index);
    setSello(sellosAcumulados[index]);
}


const acumularSello = async () => {
    if (!tareaCreada) return;
    setCargandoSello(true);
    setErroresSello({});
    try {
        let selloData;

        if (editandoIndex !== null) {
            // EDITAR — actualizar el sello existente en la BD
            const selloExistente = sellosAcumulados[editandoIndex];
            const res = await actualizarSelloApi(selloExistente.id, sello);
            selloData = res.data.sello ?? res.data;

            const nuevos = [...sellosAcumulados];
            nuevos[editandoIndex] = selloData;
            setSellosAcumulados(nuevos);
            localStorage.setItem('sellos_acumulados', JSON.stringify(nuevos));
            setEditandoIndex(null);
        } else {
           // CREAR — sello nuevo
    const res = await crearSelloApi({
        ...sello,
        numero_colegiado: String(sello.numero_colegiado),
        prefijo_postal:   String(sello.prefijo_postal),
    });

    console.log('res.data completo:', res.data);        // ← AÑADE ESTO
    console.log('repetido:', res.data.repetido);        // ← AÑADE ESTO
    console.log('sello:', res.data.sello);              // ← AÑADE ESTO

    selloData = res.data.sello ?? res.data;

    // Aviso si es repetido
    if (res.data.repetido) {
        const pedidosTexto = res.data.pedidos?.length > 0
            ? `\nApareció en los pedidos: ${res.data.pedidos.join(', ')}`
            : '';
        await notify({
            title: 'Sello repetido',
            message: `${res.data.mensaje}${pedidosTexto}\n\nSe anadira igualmente a la lista.`,
            tone: 'warning',
        });
    }

    const nuevos = [...sellosAcumulados, selloData];
    setSellosAcumulados(nuevos);
    localStorage.setItem('sellos_acumulados', JSON.stringify(nuevos));
        }

        setSello({
            prefijo_postal: "", numero_colegiado: "", nombre: "",
            apellido1: "", apellido2: "", tipo_sello: "manual",
        });

    } catch (err) {
        if (err.response?.status === 422) {
            setErroresSello(err.response.data.errors);
        }
        console.error(err);
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

        // Marcar tarea logística como completada
        if (tareaLogisticaId) {
            await axios.put(`/tareas-logistica/${tareaLogisticaId}`, {
                estado: 'completada'
            });
        }

        setSellosAcumulados([]);
        localStorage.removeItem('sellos_acumulados');
        await notify({
            title: 'Sellos asignados',
            message: 'Los sellos se han anadido al pedido activo correctamente.',
            tone: 'success',
        });
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
        cargando, cargandoSello,editarSelloAcumulado,eliminarSellosAcumulados,
        erroresSello,editandoIndex,
        crearPedido, seleccionarPedido, cambiarPedido, cerrarPedido,
        acumularSello, confirmarSellos, nuevaTarea,
        tareaUrl, tareaLogisticaId,
        feedbackModal,
    };
}
