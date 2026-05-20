import { Link } from '@inertiajs/react';
import logo from "../images/raia.png";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 text-gray-900 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="hidden border-r border-gray-200 bg-[#f7f7f7] p-8 lg:flex lg:flex-col lg:justify-between">
                        <Link href="/" className="inline-flex">
                            <img src={logo} alt="RAIA" className="h-12 w-auto" />
                        </Link>

                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-400">
                                    Herramientas Logistica
                                </p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                    Gestion interna de pedidos y tareas
                                </h1>
                            </div>
                            <p className="max-w-sm text-sm leading-6 text-gray-500">
                                Acceso al panel operativo para sellos, metacrilatos, proveedores y tareas logisticas.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-gray-600">
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                Sellos
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                Metacrilatos
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                Proveedores
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                Tareas
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-[620px] flex-col justify-center px-6 py-8 sm:px-10 lg:px-14">
                        <div className="mb-8 lg:hidden">
                            <Link href="/" className="inline-flex">
                                <img src={logo} alt="RAIA" className="h-12 w-auto" />
                            </Link>
                        </div>

                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
