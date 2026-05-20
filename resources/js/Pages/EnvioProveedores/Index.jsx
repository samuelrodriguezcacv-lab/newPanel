import React, { useState } from 'react';
import Layout from '../../Template/LayaoutNav';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Clock, CheckCircle, FileText, Plus, Trash2, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { useFeedbackModal } from '../../Hooks/useFeedbackModal';

export default function Index({ proveedores, colegios, pedidos = [] }) {
    const { feedbackModal, notify, confirm } = useFeedbackModal();
    // 1. ESTADO DEL FORMULARIO
    console.log("PROVEEDORES RECIBIDOS:", proveedores);
    console.log("COLEGIOS RECIBIDOS:", colegios);
    console.log("PEDIDOS RECIBIDOS:", pedidos);
    console.log("Productos del primer proveedor:", proveedores[0]?.productos || []);

    const [form, setForm] = useState({
        proveedor_id: '',
        colegio_veterinario_id: '',
        lineas: [{ producto_id: '', unidades: 1 }]
    });
    const [enviando, setEnviando] = useState(false);

    // SOLUCIÓN AL SELECT: Convertimos ambos a String para evitar conflictos de tipo (int vs string)
    const productosDisponibles = proveedores.find(
        p => String(p.id) === String(form.proveedor_id)
    )?.productos || [];

    // Manejar cambios en las líneas de productos
    const handleLineaChange = (index, field, value) => {
        const nuevasLineas = [...form.lineas];
        nuevasLineas[index][field] = value;
        setForm({ ...form, lineas: nuevasLineas });
    };

    const agregarLinea = () => {
        setForm({ ...form, lineas: [...form.lineas, { producto_id: '', unidades: 1 }] });
    };

    const eliminarLinea = (index) => {
        setForm({ ...form, lineas: form.lineas.filter((_, i) => i !== index) });
    };

    // 2. FUNCIÓN ENVIAR (Guarda con Axios y actualiza la lista de pendientes con Inertia)
    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviando(true);

        axios.post(route('envio-proveedores.pedidos.store'), form)
            .then(async res => {
                await notify({
                    title: 'Pedido guardado',
                    message: 'El pedido se ha creado y se abrira el PDF.',
                    tone: 'success',
                });
                
                // Abre el PDF en una pestaña nueva automáticamente
                window.open(route('envio-proveedores.pedidos.pdf', res.data.pedido_id), '_blank');

                // Resetea el formulario al estado inicial
                setForm({
                    proveedor_id: '',
                    colegio_veterinario_id: '',
                    lineas: [{ producto_id: '', unidades: 1 }]
                });

                // Sincroniza la columna de "Pedidos Pendientes" llamando al backend en segundo plano
                router.reload({ only: ['pedidos'] });
            })
            .catch(err => {
                console.error(err);
                notify({
                    title: 'Error al crear pedido',
                    message: err.response?.data?.mensaje ?? 'Hubo un error al crear el pedido.',
                    tone: 'danger',
                });
            })
            .finally(() => {
                setEnviando(false);
            });
    };

    // Cambiar estado desde la tarjeta de seguimiento
    const handleCambiarEstado = async (id, nuevoEstado) => {
        const ok = await confirm({
            title: 'Cambiar estado',
            message: `Marcar este pedido como ${nuevoEstado}?`,
            tone: 'warning',
            confirmText: 'Cambiar estado',
        });
        if (!ok) return;

        router.put(route('envio-proveedores.pedidos.estado', id), { estado: nuevoEstado }, {
            preserveScroll: true,
            onSuccess: () => notify({
                title: 'Estado actualizado',
                message: 'El pedido se actualizo correctamente.',
                tone: 'success',
            }),
        });
    };

    return (
        <Layout>
            {feedbackModal}
            <div className="bg-slate-50/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* CABECERA */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Gestión de Envíos a Proveedores
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Genera órdenes de compra estructuradas y administra la recepción de mercancías en tiempo real.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* COLUMNA FORMULARIO DE PEDIDO */}
                        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <ShoppingBag size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Nueva Orden de Pedido</h3>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* SELECT PROVEEDOR */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            Proveedor Remitente
                                        </label>
                                        <div className="relative">
                                            <select 
                                                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 pl-3 pr-10 text-slate-700 font-medium focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                                                value={form.proveedor_id}
                                                onChange={e => setForm({ ...form, proveedor_id: e.target.value, lineas: [{ producto_id: '', unidades: 1 }] })}
                                                required
                                            >
                                                <option value="">Selecciona un proveedor...</option>
                                                {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* SELECT COLEGIO */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            Colegio Veterinario Destino
                                        </label>
                                        <div className="relative">
                                            <select 
                                                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 pl-3 pr-10 text-slate-700 font-medium focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                                                value={form.colegio_veterinario_id}
                                                onChange={e => setForm({ ...form, colegio_veterinario_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Selecciona un colegio...</option>
                                                {colegios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* DINÁMICO: LÍNEAS DE PRODUCTOS */}
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        Artículos e Unidades del Pedido
                                    </label>
                                    
                                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                        {form.lineas.map((linea, index) => (
                                            <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 transition-all hover:border-slate-200">
                                                <div className="flex-1">
                                                    <select
                                                        className="w-full rounded-xl border-slate-200 bg-white py-2.5 text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm disabled:opacity-60"
                                                        value={linea.producto_id}
                                                        onChange={e => handleLineaChange(index, 'producto_id', e.target.value)}
                                                        disabled={!form.proveedor_id}
                                                        required
                                                    >
                                                        <option value="">Selecciona un producto...</option>
                                                        {productosDisponibles.map(p => (
                                                            <option key={p.id} value={p.id}>{p.nombre} ({p.precio}€)</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="w-28">
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        placeholder="Cant."
                                                        className="w-full rounded-xl border-slate-200 bg-white py-2.5 text-center font-semibold text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                                                        value={linea.unidades}
                                                        onChange={e => handleLineaChange(index, 'unidades', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                {form.lineas.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => eliminarLinea(index)} 
                                                        className="p-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                                                        title="Eliminar línea"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={agregarLinea}
                                        disabled={!form.proveedor_id}
                                        className="mt-3 text-sm font-semibold text-indigo-600 flex items-center gap-2 hover:text-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
                                    >
                                        <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-100 transition-colors">
                                            <Plus size={14} />
                                        </div> 
                                        Añadir otra línea de producto
                                    </button>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={enviando}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 tracking-wide text-sm"
                                >
                                    {enviando ? 'Procesando y Guardando...' : 'Generar y Emitir Orden de Pedido'}
                                </button>
                            </form>
                        </div>

                        {/* COLUMNA SEGUIMIENTO (Pedidos Pendientes) */}
                        <div className="space-y-4 lg:sticky lg:top-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Truck size={20} className="text-slate-500" />
                                    Pedidos Pendientes
                                </h3>
                                <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {pedidos.filter(p => p.estado === 'pendiente').length}
                                </span>
                            </div>
                            
                            <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
                                {pedidos.filter(p => p.estado === 'pendiente').length === 0 ? (
                                    <div className="text-center p-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                                            <CheckCircle size={24} />
                                        </div>
                                        <p className="text-slate-700 font-medium text-sm">Todo al día</p>
                                        <p className="text-slate-400 text-xs mt-1">No hay recepciones pendientes.</p>
                                    </div>
                                ) : (
                                    pedidos
                                        .filter(p => p.estado === 'pendiente')
                                        .map((pedido) => (
                                            <div key={pedido.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-lg tracking-wider">
                                                            {pedido.numero_pedido}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 dynamic-pulse">
                                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                                            Pendiente
                                                        </span>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                                                            {pedido.proveedor?.nombre}
                                                        </h4>
                                                        <div className="flex items-start gap-1.5 text-slate-500 text-xs mt-1.5">
                                                            <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                                            <p className="line-clamp-1"><span className="font-medium text-slate-600">Destino:</span> {pedido.colegio?.nombre}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        {new Date(pedido.fecha).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>

                                                    <div className="flex gap-2 shrink-0">
                                                        <a 
                                                            href={route('envio-proveedores.pedidos.pdf', pedido.id)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1.5 transition-all"
                                                        >
                                                            <FileText size={13} className="text-slate-400" /> PDF
                                                        </a>
                                                        <button
                                                            onClick={() => handleCambiarEstado(pedido.id, 'completado')}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                                                        >
                                                            <CheckCircle size={13} /> Recibido
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
