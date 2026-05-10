import axios from "axios";

const OrdenProveedorService = {

  // 📦 proveedores
  getProveedores: () =>
    axios.get("/api/proveedores"),

  // 🏫 colegios destino
  getColegios: () =>
    axios.get("/api/colegios"),

  // 📦 productos por proveedor
  getProductosByProveedor: (proveedorId) =>
    axios.get(`/api/proveedores/${proveedorId}/productos`),

  // 🧾 crear orden
  crearOrden: (data) =>
    axios.post("/ordenes-proveedores", data),

};

export default OrdenProveedorService;