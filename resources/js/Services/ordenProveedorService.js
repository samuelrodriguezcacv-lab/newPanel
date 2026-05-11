// En tu Services/OrdenProveedorService.js simplificado
import axios from "axios";

export const getProductosByProveedor = async (id) => {
    // Esta sigue siendo una ruta de API que devuelve JSON
    const response = await axios.get(`/api/proveedores/${id}/productos`);
    return response.data;
};