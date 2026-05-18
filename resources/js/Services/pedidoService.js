import axios from "axios";

/* =========================
   PEDIDOS
========================= */
export const getPedidosApi = () => axios.get("/pedidos");
export const crearPedidoApi = () => axios.post("/pedidos");

/* =========================
   TAREAS LOGÍSTICAS
========================= */
export const crearTareaLogisticaApi = (data) =>
    axios.post("/tareas-logistica", data);

export const getTareasLogisticaApi = () =>
    axios.get("/tareas-logistica");

export const updateEstadoTareaLogisticaApi = (id, estado) =>
    axios.put(`/tareas-logistica/${id}/estado`, { estado });

/* =========================
   SELLLOS
========================= */
export const crearSelloApi = (data) =>
    axios.post("/sellos", data);

export const actualizarSelloApi = (id, data) =>
    axios.put(`/sellos/${id}`, data);

/* =========================
   ASIGNACIÓN SELLLOS ↔ TAREA
========================= */
export const asignarSellosATareaApi = (tareaId, sellos) =>
    axios.post(`/tareas-logistica/${tareaId}/sellos`, {
        sellos
    });