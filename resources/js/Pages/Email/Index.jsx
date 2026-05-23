import React, { useState } from 'react';
import axios from 'axios';
import { useFeedbackModal } from '../../Hooks/useFeedbackModal';
import MicrochipLoadingIcon from '../../Components/atoms/MicrochipLoadingIcon.jsx';

export default function EnvioPedidosModulo() {
    const { feedbackModal, notify } = useFeedbackModal();
    // Estados del formulario clásico
    const [proveedorId, setProveedorId] = useState('');
    const [colegioId, setColegioId] = useState('');
    const [lineas, setLineas] = useState([{ producto_id: '', unidades: 1 }]);

    // 🔥 ESTADOS PARA EL MÓDULO DE CORREO INTELIGENTE
    const [mostrarPrevisualizacion, setMostrarPrevisualizacion] = useState(false);
    const [correoForm, setCorreoForm] = useState({
        destinatario: '',
        asunto: '',
        mensaje: ''
    });
    const [cargando, setCargando] = useState(false);

    // 1. PASO PRIMERO: Generar la propuesta de correo (Pregunta al servidor por los datos limpios)
    const prepararCorreo = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            // Enviamos los datos actuales para que Laravel nos devuelva el borrador del correo
            const response = await axios.post('/envio-proveedores/pedidos/preparar-borrador', {
                proveedor_id: proveedorId,
                colegio_veterinario_id: colegioId,
                lineas: lineas
            });

            if (response.data.success) {
                // Rellenamos el módulo de edición con la propuesta automática de Laravel
                setCorreoForm({
                    destinatario: response.data.borrador.destinatario,
                    asunto: response.data.borrador.asunto,
                    mensaje: response.data.borrador.mensaje // El texto con "Buenos días Victoria..."
                });
                setMostrarPrevisualizacion(true);
            }
        } catch (error) {
            notify({
                title: 'Error al generar borrador',
                message: error.response?.data?.mensaje ?? 'No se pudo generar el borrador.',
                tone: 'danger',
            });
        } finally {
            setCargando(false);
        }
    };

    // 2. PASO SEGUNDO: Confirmar y enviar el correo definitivo (con los cambios del usuario)
    const procesarEnvioDefinitivo = async () => {
        setCargando(true);
        try {
            const response = await axios.post('/envio-proveedores/pedidos', {
                proveedor_id: proveedorId,
                colegio_veterinario_id: colegioId,
                lineas: lineas,
                // Le pasamos al controlador el texto final modificado por el usuario
                email_manual: correoForm.destinatario,
                email_asunto_custom: correoForm.asunto,
                email_mensaje_custom: correoForm.mensaje 
            });

            if (response.data.success) {
                await notify({
                    title: 'Pedido enviado',
                    message: response.data.mensaje,
                    tone: 'success',
                });
                setMostrarPrevisualizacion(false); // Cerramos el panel
            }
        } catch (error) {
            notify({
                title: 'Error al enviar pedido',
                message: error.response?.data?.mensaje ?? 'No se pudo enviar el pedido.',
                tone: 'danger',
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {feedbackModal}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">📦 Emisión de Órdenes a Proveedores</h1>
                
                {/* Formulario de selección normal (Simplificado para el ejemplo) */}
                <form onSubmit={prepararCorreo} className="space-y-4">
                    {/* inputs de proveedor, colegio y líneas aquí... */}
                    
                    {!mostrarPrevisualizacion && (
                        <button 
                            type="submit" 
                            disabled={cargando}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium transition"
                        >
                            {cargando ? (
                                <span className="inline-flex items-center gap-2">
                                    <MicrochipLoadingIcon size={18} label="Procesando datos" />
                                    Procesando datos...
                                </span>
                            ) : 'Generar Propuesta de Pedido y Correo'}
                        </button>
                    )}
                </form>

                {/* 🔥 INTERFAZ DEL MÓDULO DE CORREO (Se activa al recibir el borrador) */}
                {mostrarPrevisualizacion && (
                    <div className="mt-8 border-t pt-6 border-slate-200 animate-fadeIn">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                            <h3 className="text-sm font-semibold text-amber-800 flex items-center">
                                📝 Revisión del Mensaje Predeterminado
                            </h3>
                            <p className="text-xs text-amber-700 mt-1">
                                El sistema ha redactado el correo automáticamente. Puedes modificar el texto o el destinatario antes del envío real. El Albarán PDF se adjuntará de forma transparente.
                            </p>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Destinatario</label>
                                <input 
                                    type="email" 
                                    value={correoForm.destinatario}
                                    onChange={(e) => setCorreoForm({...correoForm, destinatario: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Asunto del Correo</label>
                                <input 
                                    type="text" 
                                    value={correoForm.asunto}
                                    onChange={(e) => setCorreoForm({...correoForm, asunto: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Cuerpo del Mensaje</label>
                                <textarea 
                                    rows="8" 
                                    value={correoForm.mensaje}
                                    onChange={(e) => setCorreoForm({...correoForm, mensaje: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setMostrarPrevisualizacion(false)}
                                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button"
                                    onClick={procesarEnvioDefinitivo}
                                    disabled={cargando}
                                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow transition"
                                >
                                    {cargando ? (
                                        <span className="inline-flex items-center gap-2">
                                            <MicrochipLoadingIcon size={18} label="Enviando correo" />
                                            Enviando...
                                        </span>
                                    ) : '🚀 Confirmar y Enviar Correo con PDF'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
