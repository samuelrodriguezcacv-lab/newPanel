import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../Template/LayaoutNav';
import { useFeedbackModal } from '../../Hooks/useFeedbackModal';
import axios from 'axios';

const PLANTILLAS = {
    pedidos: {
        asunto: 'Solicitud de confirmacion de pedido',
        mensaje: 'Buenos dias,\n\nAdjuntamos el pedido para su revision y confirmacion.\n\nGracias.\nDepartamento de Logistica',
        adjunto: 'Albaran PDF',
    },
    sellos: {
        asunto: 'Notificacion operativa de sellos',
        mensaje: 'Hola,\n\nTe compartimos el resumen operativo del modulo de sellos.\n\nUn saludo.\nDepartamento de Sellos',
        adjunto: 'Resumen Sellos PDF',
    },
    metacrilatos: {
        asunto: 'Notificacion operativa de metacrilatos',
        mensaje: 'Hola,\n\nTe compartimos el resumen del modulo de metacrilatos.\n\nUn saludo.\nDepartamento de Metacrilatos',
        adjunto: 'Resumen Metacrilatos PDF',
    },
};

export default function EmailIndex() {
    const { feedbackModal, notify } = useFeedbackModal();
    const [modulo, setModulo] = useState('pedidos');
    const [destinatario, setDestinatario] = useState('');
    const [asunto, setAsunto] = useState(PLANTILLAS.pedidos.asunto);
    const [mensaje, setMensaje] = useState(PLANTILLAS.pedidos.mensaje);
    const [ultimoPedido, setUltimoPedido] = useState(null);

    const plantillaActiva = PLANTILLAS[modulo];

    const previewHtml = useMemo(() => {
        return mensaje
            .split('\n')
            .map((linea) => linea.trim())
            .filter(Boolean)
            .map((linea, idx) => `<p key=${idx}>${linea}</p>`)
            .join('');
    }, [mensaje]);

    const cambiarModulo = (nuevoModulo) => {
        setModulo(nuevoModulo);
        setAsunto(PLANTILLAS[nuevoModulo].asunto);
        setMensaje(PLANTILLAS[nuevoModulo].mensaje);
        setUltimoPedido(null);
    };

    useEffect(() => {
        if (modulo !== 'sellos' && modulo !== 'metacrilatos') return;

        axios
            .get('/email/ultimo-pedido', { params: { modulo } })
            .then((res) => {
                const pedido = res.data?.pedido ?? null;
                setUltimoPedido(pedido);

                if (pedido?.numero_pedido) {
                    setAsunto((prev) => `${PLANTILLAS[modulo].asunto} #${pedido.numero_pedido}`);
                    setMensaje((prev) =>
                        `${PLANTILLAS[modulo].mensaje}\n\nPedido vinculado: #${pedido.numero_pedido}`
                    );
                }
            })
            .catch(() => {
                setUltimoPedido(null);
            });
    }, [modulo]);

    const simularEnvio = async () => {
        await notify({
            title: 'Borrador listo',
            message: `Modulo: ${modulo}. Destinatario: ${destinatario || 'sin definir'}. Esta pantalla esta preparada para conectar el endpoint final cuando quieras.`,
            tone: 'success',
        });
    };

    return (
        <Layout title="Envio Email" subtitle="Modulo independiente para componer correos por dominio">
            {feedbackModal}
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Compositor</h3>

                    <div className="grid grid-cols-3 gap-2">
                        {Object.keys(PLANTILLAS).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => cambiarModulo(key)}
                                className={`rounded-xl px-3 py-2 text-sm font-semibold border transition ${
                                    modulo === key
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Destinatario</label>
                        <input
                            type="email"
                            value={destinatario}
                            onChange={(e) => setDestinatario(e.target.value)}
                            placeholder="correo@proveedor.com"
                            className="w-full rounded-xl border-slate-200 bg-white px-3 py-2.5 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Asunto</label>
                        <input
                            type="text"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                            className="w-full rounded-xl border-slate-200 bg-white px-3 py-2.5 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mensaje</label>
                        <textarea
                            rows={10}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            className="w-full rounded-xl border-slate-200 bg-white px-3 py-2.5 text-sm"
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        Adjunto esperado para este modulo: <span className="font-bold">{plantillaActiva.adjunto}</span>
                    </div>

                    {(modulo === 'sellos' || modulo === 'metacrilatos') && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                            {ultimoPedido
                                ? `Ultimo pedido detectado: #${ultimoPedido.numero_pedido} (${ultimoPedido.estado ?? 'sin estado'})`
                                : 'No se encontro un pedido previo para este modulo.'}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={simularEnvio}
                        className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-slate-800"
                    >
                        Guardar borrador / Simular envio
                    </button>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Preview del email</h3>

                    <div className="rounded-xl border border-slate-200 p-4 bg-white">
                        <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full mb-2">
                            {modulo}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900">{asunto || 'Sin asunto'}</h4>
                        <div className="mt-3 text-sm text-slate-700 space-y-2" dangerouslySetInnerHTML={{ __html: previewHtml || '<p>Sin contenido.</p>' }} />
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                            Este es un correo automatico, por favor no respondas directamente.
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
