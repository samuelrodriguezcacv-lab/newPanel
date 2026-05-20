import axios from "axios";

/* =========================
   PEDIDOS
========================= */
export const getPedidosApi = () => {
    return axios.get('/pedidos');
};

export const crearPedidoApi = () => {
    return axios.post('/pedidos');
};

export const getPedidoApi = (id) => {
    return axios.get(`/pedidos/${id}`);
};
export const cerrarPedidoApi      = (id)       => axios.post(`/pedidos/${id}/cerrar`);
export const actualizarEstadoPedidoApi = (id, estado) =>
    axios.put(`/pedidos/${id}/estado`, { estado });

/* =========================
   TAREAS SELLOS
========================= */
export const getTareasApi         = ()         => axios.get("/tareas");
export const crearTareaApi = (data) => {
    console.log("crearTareaApi enviando:", data);

    return axios.post("/tareas", data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
};
export const updateTareaEstadoApi = (id, estado) =>
    axios.put(`/tareas/${id}`, { estado });
export const eliminarTareaApi     = (id)       => axios.delete(`/tareas/${id}`);
export const editarTareaApi       = (id, data) => axios.put(`/tareas/${id}`, data);
export const asignarSellosApi     = (tareaId, sellos) =>
    axios.post(`/tareas/${tareaId}/sellos`, { sellos });
export const eliminarSelloApi     = (tareaId, selloId) =>
    axios.delete(`/tareas/${tareaId}/sellos/${selloId}`);

/* =========================
   TAREAS LOGÍSTICAS
========================= */
export const getTareasLogisticaApi        = ()          => axios.get("/tareas-logistica");
export const crearTareaLogisticaApi       = (data)      => axios.post("/tareas-logistica", data);
export const updateEstadoTareaLogisticaApi = (id, estado) =>
    axios.put(`/tareas-logistica/${id}`, { estado });
export const actualizarEstadoTareaLogisticaApi = (id, estado) =>
    axios.put(`/tareas-logistica/${id}`, { estado });

/* =========================
   SELLOS
========================= */
export const crearSelloApi        = (data)     => axios.post("/sellos", data);


export const actualizarSelloApi   = (id, data) => axios.put(`/sellos/${id}`, data);
export const editarSelloApi       = (id, data) => axios.put(`/sellos/${id}`, data);
export const getSellosApi         = ()         => axios.get("/api-sellos/todos");
export const getSellosRepetidosApi = ()        => axios.get("/api-sellos/repetidos");
export const getSellosProvinciaApi = ()        => axios.get("/api-sellos/por-provincia");

/* =========================
   ASIGNACIÓN SELLOS ↔ TAREA
========================= */
export const asignarSellosATareaApi = (data) => {
    return axios.post('/tareas/asignar-sellos', data);
};

/* =========================
   MÉTRICAS
========================= */
export const getMetricasApi = () => axios.get("/dashboard/metricas");

