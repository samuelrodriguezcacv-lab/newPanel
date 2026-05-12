import React, { useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';

export default function Index({ metacrilatos, tiposCentro }) {
    // Obtenemos las props globales para leer el mensaje flash
    const { props } = usePage();
    const flash = props.flash || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_centro: '',
        codigo_registro: '',
    });

    // ESCUCHADOR: Cuando Laravel nos envía la URL, abrimos el PDF automáticamente
    useEffect(() => {
        if (flash?.pdf_url) {
            window.open(flash.pdf_url, '_blank');
        }
    }, [flash?.pdf_url]);

    const submit = (e) => {
        e.preventDefault();
        // Usamos la URL manual para evitar errores de "route is not defined"
        post('/metacrilatos', {
            onSuccess: () => reset(),
        });
    };

    const deleteRegistro = (id) => {
        if (confirm('¿Estás seguro de eliminar este registro?')) {
            router.delete(`/metacrilatos/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Placas Veterinarias" />
            
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Generador de Placas de Metacrilato</h1>
                    
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Centro</label>
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                value={data.tipo_centro}
                                onChange={e => setData('tipo_centro', e.target.value)}
                            >
                                <option value="">Selecciona una opción...</option>
                                {tiposCentro.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                            {errors.tipo_centro && <span className="text-red-500 text-xs">{errors.tipo_centro}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número de Registro</label>
                            <input 
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                value={data.codigo_registro}
                                onChange={e => setData('codigo_registro', e.target.value)}
                                placeholder="Ej: MA-123"
                            />
                            {errors.codigo_registro && <span className="text-red-500 text-xs">{errors.codigo_registro}</span>}
                        </div>

                        <div className="md:col-span-2">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50 font-bold"
                            >
                                {processing ? 'Generando...' : 'Generar y Descargar Placa'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLA DE HISTORIAL */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Registro</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {metacrilatos.data.map((m) => (
                                <tr key={m.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.tipo_centro}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.codigo_registro}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <a href={`/metacrilatos/${m.id}/pdf`} target="_blank" className="text-blue-600 hover:text-blue-900">PDF</a>
                                        <button onClick={() => deleteRegistro(m.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}