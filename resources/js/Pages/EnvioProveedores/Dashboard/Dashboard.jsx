import Layout from "../../../Template/LayaoutNav.jsx";
import useOrdenProveedor from "../../../Hooks/useOrdenProveedor.jsx";
import OrdenProveedorService from "../../../Services/OrdenProveedorService.js";

import { useEffect, useState } from "react";

export default function Dashboard() {

  const {
    proveedor,
    setProveedor,
    colegio,
    setColegio,
    productoSeleccionado,
    setProductoSeleccionado,
    cantidad,
    setCantidad,
    lineas,
    addLinea,
    removeLinea,
    total,
  } = useOrdenProveedor();

  const [proveedores, setProveedores] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [productos, setProductos] = useState([]);

  // 📦 cargar datos iniciales
  useEffect(() => {
    OrdenProveedorService.getProveedores()
      .then(res => setProveedores(res.data));

    OrdenProveedorService.getColegios()
      .then(res => setColegios(res.data));
  }, []);

  // 📦 productos por proveedor
  useEffect(() => {
    if (!proveedor) return;

    OrdenProveedorService
      .getProductosByProveedor(proveedor.id)
      .then(res => setProductos(res.data));
  }, [proveedor]);

  // 📤 generar orden
  const generarOrden = () => {

    if (!proveedor || !colegio || lineas.length === 0) return;

    OrdenProveedorService.crearOrden({
      proveedor_id: proveedor.id,
      colegio_veterinario_id: colegio.id,
      lineas
    }).then(() => {
      alert("Orden creada correctamente");
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">
          Orden-Proveedor (Generador)
        </h1>

        {/* SELECTS */}
        <div className="grid grid-cols-2 gap-4">

          {/* proveedor */}
          <select
            className="border p-2"
            onChange={(e) => setProveedor(JSON.parse(e.target.value))}
          >
            <option value="">Proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={JSON.stringify(p)}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* colegio */}
          <select
            className="border p-2"
            onChange={(e) => setColegio(JSON.parse(e.target.value))}
          >
            <option value="">Colegio destino</option>
            {colegios.map((c) => (
              <option key={c.id} value={JSON.stringify(c)}>
                {c.nombre}
              </option>
            ))}
          </select>

        </div>

        {/* PRODUCTOS */}
        <div className="flex gap-2">

          <select
            className="border p-2 flex-1"
            onChange={(e) =>
              setProductoSeleccionado(JSON.parse(e.target.value))
            }
          >
            <option value="">Producto</option>
            {productos.map((p) => (
              <option key={p.id} value={JSON.stringify(p)}>
                {p.nombre} - {p.precio}€
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 w-24"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4"
            onClick={addLinea}
          >
            Añadir
          </button>
        </div>

        {/* LINEAS */}
        <div className="border p-4">
          {lineas.map((l, i) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <span>{l.nombre} x{l.cantidad}</span>
              <span>{l.subtotal.toFixed(2)} €</span>
              <button onClick={() => removeLinea(i)}>❌</button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="text-xl font-bold">
          Total: {total.toFixed(2)} €
        </div>

        {/* GENERAR */}
        <button
          className="bg-green-600 text-white px-6 py-2"
          onClick={generarOrden}
        >
          Generar Orden-Proveedor
        </button>

      </div>
    </Layout>
  );
}