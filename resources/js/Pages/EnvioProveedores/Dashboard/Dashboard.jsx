import React, { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import Layout from '../../../Template/LayaoutNav';
import { useFeedbackModal } from '../../../Hooks/useFeedbackModal';
import { 
    ChevronRight, 
    Plus, 
    Trash2, 
    FileText, 
    Package, 
    ShoppingCart, 
    CheckCircle,
    ArrowLeft
} from 'lucide-react'; // Sugerencia: Instala lucide-react para iconos consistentes

export default function Dashboard() {
    const { feedbackModal, notify } = useFeedbackModal();
    const { proveedores, colegios } = usePage().props;

    const [vista, setVista] = useState('catalogo');
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [colegioId, setColegioId] = useState('');
    const [lineas, setLineas] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [pedidoCreado, setPedidoCreado] = useState(null);

    // --- Lógica de negocio ---
    const seleccionarProveedor = (p) => {
        setProveedorSeleccionado(p);
        setLineas([]);
        setPedidoCreado(null);
        setColegioId('');
    };

    const getProducto = (id) =>
        proveedorSeleccionado?.productos?.find(p => p.id === parseInt(id));

    const añadirLinea = (productoId = '', unidades = 1) => {
        const existe = lineas.find(l => l.producto_id === String(productoId));
        if (existe && productoId !== '') {
            actualizarLinea(lineas.indexOf(existe), 'unidades', parseInt(existe.unidades) + 1);
        } else {
            setLineas([...lineas, { producto_id: String(productoId), unidades }]);
        }
    };

    const actualizarLinea = (i, campo, valor) => {
        const nuevas = [...lineas];
        nuevas[i][campo] = valor;
        setLineas(nuevas);
    };

    const eliminarLinea = (i) => setLineas(lineas.filter((_, idx) => idx !== i));

    // Cálculos optimizados con useMemo
const totales = useMemo(() => {
    const subtotal = lineas.reduce((sum, l) => {
        const p = getProducto(l.producto_id);
        return sum + (l.unidades * parseFloat(p?.precio ?? 0));
    }, 0);
    
    // Forzamos el IVA a 0 para que no sume nada
    const iva = 0; 

    return { 
        subtotal, 
        iva, 
        total: subtotal // El total es idéntico al subtotal
    };
}, [lineas, proveedorSeleccionado]);

    const guardarPedido = async () => {
        if (!proveedorSeleccionado || !colegioId || lineas.length === 0) return;
        setGuardando(true);
        try {
            const res = await axios.post('/envio-proveedores/pedidos', {
                proveedor_id: proveedorSeleccionado.id,
                colegio_veterinario_id: parseInt(colegioId),
                lineas: lineas.map(l => ({
                    producto_id: parseInt(l.producto_id),
                    unidades: parseInt(l.unidades),
                })),
            });
            setPedidoCreado(res.data.pedido_id);
        } catch (e) {
            notify({
                title: 'Error al guardar pedido',
                message: e.response?.data?.mensaje ?? 'No se pudo guardar el pedido.',
                tone: 'danger',
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Layout>
            {feedbackModal}
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                
                {/* SIDEBAR IZQUIERDO */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Proveedores</h2>
                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">
                            {proveedores.length} Disponibles
                        </p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {proveedores.map(p => (
                            <button
                                key={p.id}
                                onClick={() => seleccionarProveedor(p)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                                    proveedorSeleccionado?.id === p.id
                                        ? 'bg-blue-600 shadow-blue-200 shadow-lg'
                                        : 'hover:bg-slate-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-sm ${proveedorSeleccionado?.id === p.id ? 'text-white' : 'text-slate-700'}`}>
                                            {p.nombre}
                                        </span>
                                        <span className={`text-xs mt-1 ${proveedorSeleccionado?.id === p.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {p.ciudad} • {p.productos?.length ?? 0} Prod.
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${proveedorSeleccionado?.id === p.id ? 'text-white' : 'text-slate-300'}`} />
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 overflow-y-auto relative bg-slate-50">
                    {!proveedorSeleccionado ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="bg-white p-8 rounded-full shadow-sm mb-4">
                                <Package size={48} className="text-slate-200" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-600">No hay selección</h3>
                            <p className="text-sm text-slate-400">Selecciona un proveedor para gestionar pedidos</p>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto p-8">
                            
                            {/* HEADER PROVEEDOR */}
                            <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Package className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800">{proveedorSeleccionado.nombre}</h2>
                                    </div>
                                    <div className="flex gap-4 mt-3 text-sm text-slate-500">
                                        <span>📍 {proveedorSeleccionado.direccion}, {proveedorSeleccionado.ciudad}</span>
                                        <span>📧 {proveedorSeleccionado.email}</span>
                                        <span>📞 {proveedorSeleccionado.telefono}</span>
                                    </div>
                                </div>
                                <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Identificación CIF</p>
                                    <p className="font-mono font-bold text-slate-700">{proveedorSeleccionado.cif}</p>
                                </div>
                            </header>

                            {/* TABS NAVEGACIÓN */}
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6 w-fit">
                                <button
                                    onClick={() => setVista('catalogo')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        vista === 'catalogo' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <ShoppingCart size={16} /> Catálogo
                                </button>
                                <button
                                    onClick={() => setVista('albaran')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        vista === 'albaran' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <FileText size={16} /> Albarán Activo
                                    {lineas.length > 0 && (
                                        <span className="bg-blue-400 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                            {lineas.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* VISTA CATÁLOGO */}
                            {vista === 'catalogo' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {proveedorSeleccionado.productos?.map((producto) => (
                                        <div key={producto.id} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
                                                <span className="text-lg font-bold text-slate-900">{parseFloat(producto.precio).toFixed(2)}€</span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{producto.descripcion || 'Sin descripción disponible.'}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${producto.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {producto.activo ? 'En Stock' : 'Agotado'}
                                                </span>
                                                <button
                                                    disabled={!producto.activo}
                                                    onClick={() => {
                                                        añadirLinea(producto.id);
                                                        setVista('albaran');
                                                    }}
                                                    className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                                                >
                                                    <Plus size={14} /> Añadir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* VISTA ALBARÁN */}
                            {vista === 'albaran' && (
                                <div className="space-y-6">
                                    {pedidoCreado ? (
                                        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="text-green-600 w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-green-900">¡Pedido Confirmado!</h3>
                                            <p className="text-green-700 mt-2">El albarán ha sido generado con éxito.</p>
                                            <div className="flex gap-4 justify-center mt-8">
                                                <a href={`/envio-proveedores/pedidos/${pedidoCreado}/pdf`} target="_blank" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all">
                                                    <FileText size={18} /> Ver PDF Albarán
                                                </a>
                                                <button onClick={() => { setPedidoCreado(null); setLineas([]); }} className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                                    Crear otro pedido
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* SELECCIÓN COLEGIO */}
                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Colegio Destinatario</label>
                                                <select
                                                    value={colegioId}
                                                    onChange={e => setColegioId(e.target.value)}
                                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                                >
                                                    <option value="">Selecciona el destino del material...</option>
                                                    {colegios.map(c => (
                                                        <option key={c.id} value={c.id}>{c.nombre} ({c.ciudad})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* TABLA DE LÍNEAS */}
                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50 border-b border-slate-100">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left font-bold text-slate-500">Producto</th>
                                                            <th className="px-6 py-4 text-center font-bold text-slate-500 w-32">Cant.</th>
                                                            <th className="px-6 py-4 text-right font-bold text-slate-500">Precio Unit.</th>
                                                            <th className="px-6 py-4 text-right font-bold text-slate-500">Subtotal</th>
                                                            <th className="px-6 py-4 w-16"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {lineas.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                                                                    No hay productos en el albarán
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            lineas.map((linea, i) => {
                                                                const producto = getProducto(linea.producto_id);
                                                                return (
                                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                                        <td className="px-6 py-4">
                                                                            <select
                                                                                value={linea.producto_id}
                                                                                onChange={e => actualizarLinea(i, 'producto_id', e.target.value)}
                                                                                className="w-full bg-transparent border-none p-0 font-medium text-slate-700 focus:ring-0"
                                                                            >
                                                                                <option value="">Seleccionar...</option>
                                                                                {proveedorSeleccionado.productos?.map(p => (
                                                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                                                ))}
                                                                            </select>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                value={linea.unidades}
                                                                                onChange={e => actualizarLinea(i, 'unidades', e.target.value)}
                                                                                className="w-full bg-slate-100 border-none rounded-lg p-2 text-center font-bold"
                                                                            />
                                                                        </td>
                                                                        <td className="px-6 py-4 text-right text-slate-500 font-mono">
                                                                            {producto ? `${parseFloat(producto.precio).toFixed(2)}€` : '—'}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-right font-bold text-slate-800 font-mono">
                                                                            {producto ? `${(linea.unidades * producto.precio).toFixed(2)}€` : '—'}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <button onClick={() => eliminarLinea(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                                                <Trash2 size={18} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                                
                                                <div className="p-4 bg-slate-50 border-t border-slate-100">
                                                    <button onClick={() => añadirLinea()} className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:text-blue-800 transition-colors">
                                                        <Plus size={14} /> AÑADIR OTRA LÍNEA
                                                    </button>
                                                </div>
                                            </div>

                                            {/* RESUMEN Y ACCIONES */}
                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                <div className="flex-1"></div>
                                                <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Subtotal</span>
                                                        <span className="font-mono">{totales.subtotal.toFixed(2)}€</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>IVA (Incl.)</span>
                                                        <span className="font-mono">{totales.iva.toFixed(2)}€</span>
                                                    </div>
                                                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-3 border-t">
                                                        <span>Total</span>
                                                        <span className="text-blue-600 font-mono">{totales.total.toFixed(2)}€</span>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={guardarPedido}
                                                        disabled={guardando || !colegioId || lineas.length === 0}
                                                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {guardando ? 'Procesando...' : (
                                                            <> <CheckCircle size={18} /> Confirmar Pedido </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
