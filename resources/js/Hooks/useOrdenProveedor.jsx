import { useState, useMemo } from "react";

export default function useOrdenProveedor() {

  const [proveedor, setProveedor] = useState(null);
  const [colegio, setColegio] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [lineas, setLineas] = useState([]);

  // ➕ añadir línea
  const addLinea = () => {
    if (!productoSeleccionado) return;

    const subtotal =
      parseFloat(productoSeleccionado.precio) * parseInt(cantidad);

    setLineas((prev) => [
      ...prev,
      {
        producto_id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        cantidad: parseInt(cantidad),
        precio: parseFloat(productoSeleccionado.precio),
        subtotal,
      },
    ]);
  };

  // ❌ eliminar línea
  const removeLinea = (index) => {
    setLineas((prev) => prev.filter((_, i) => i !== index));
  };

  // 💰 total calculado
  const total = useMemo(() => {
    return lineas.reduce((acc, l) => acc + l.subtotal, 0);
  }, [lineas]);

  return {
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
  };
}