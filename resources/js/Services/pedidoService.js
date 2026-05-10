import axios from "axios";

export const crearPedidoApi = () => axios.post("/pedidos");
export const getPedidosApi = () => axios.get("/pedidos");
export const crearTareaApi = (data) => axios.post("/tareas", data);
export const crearSelloApi = (data) => axios.post("/sellos", data);
export const getPedidoApi = (id) => axios.get(`/pedidos/${id}`);
export const asignarSellosApi = (tareaId, sellos) =>
    axios.post(`/tareas/${tareaId}/sellos`, { sellos });

export const getTareasApi = () => axios.get("/tareas");
export const updateTareaEstadoApi = (id, estado) => 
    axios.put(`/tareas/${id}`, { estado });
export const getSellosApi = () => axios.get("/api-sellos/todos");
export const getSellosRepetidosApi = () => axios.get("/api-sellos/repetidos");
export const getSellosProvinciaApi = () => axios.get("/api-sellos/por-provincia");

export const cerrarPedidoApi = (id) => axios.post(`/pedidos/${id}/cerrar`);


export const actualizarEstadoPedidoApi = (id, estado) =>
    axios.put(`/pedidos/${id}/estado`, { estado });

export const eliminarSelloApi = (tareaId, selloId) =>
    axios.delete(`/tareas/${tareaId}/sellos/${selloId}`);

export const eliminarTareaApi = (id) => axios.delete(`/tareas/${id}`);
export const editarSelloApi = (id, data) => axios.put(`/sellos/${id}`, data);

export const editarTareaApi = (id, data) => axios.put(`/tareas/${id}`, data);
export const getMetricasApi = () => axios.get("/dashboard/metricas");