import Sidebar from "../Components/organisms/Sidebar.jsx";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertTriangle, Bell, CheckCircle2, Clock, UserRound, X } from "lucide-react";

export default function Layout({ children }) {
  const user = usePage().props.auth?.user;
  const [notificaciones, setNotificaciones] = useState(null);
  const [mostrarToast, setMostrarToast] = useState(false);

  const storageKey = useMemo(
    () => `notificaciones-logistica-v1-${user?.id ?? "anon"}`,
    [user?.id]
  );

  useEffect(() => {
    if (!user) return;

    const yaMostrado = sessionStorage.getItem(storageKey);

    axios.get("/dashboard/notificaciones")
      .then((res) => {
        setNotificaciones(res.data);

        if (!yaMostrado) {
          setMostrarToast(true);
          sessionStorage.setItem(storageKey, "1");
        }
      })
      .catch(() => {});
  }, [storageKey, user]);

  const tareasSinFinalizar = notificaciones?.tareas?.sin_finalizar ?? 0;
  const pedidosAbiertos = notificaciones?.pedidos_abiertos?.total ?? 0;
  const tieneAvisos = tareasSinFinalizar > 0 || pedidosAbiertos > 0;

  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full p-6">
        <div className="mb-6 flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <UserRound className="h-4 w-4" />
            </span>
            <span>{user?.name ?? "Usuario"}</span>
          </div>
        </div>

        {children}
      </main>

      {mostrarToast && notificaciones && (
        <div className="fixed right-6 top-24 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              tieneAvisos ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}>
              {tieneAvisos ? <Bell className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Resumen de logistica
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Estado actual al entrar en la app.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarToast(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Cerrar notificacion"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 ${tareasSinFinalizar > 0 ? "text-amber-600" : "text-emerald-600"}`} />
                  <p className="text-gray-700">
                    Tienes <span className="font-bold">{tareasSinFinalizar}</span> tareas sin finalizar
                    <span className="text-gray-500"> ({notificaciones.tareas.pendientes} pendientes, {notificaciones.tareas.en_proceso} en proceso)</span>.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className={`mt-0.5 h-4 w-4 ${pedidosAbiertos > 0 ? "text-red-600" : "text-emerald-600"}`} />
                  <div className="text-gray-700">
                    <p>
                      <span className="font-bold">{pedidosAbiertos}</span> pedidos llevan mas de {notificaciones.umbral_horas_pedido_abierto} horas abiertos.
                    </p>
                    {notificaciones.pedidos_abiertos.muestras?.length > 0 && (
                      <ul className="mt-1 space-y-1 text-xs text-gray-500">
                        {notificaciones.pedidos_abiertos.muestras.map((pedido) => (
                          <li key={`${pedido.tipo}-${pedido.numero_pedido}`}>
                            {pedido.tipo} #{pedido.numero_pedido}: {pedido.abierto_desde}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/tareas-logistica"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Ver tareas
                </Link>
                <button
                  type="button"
                  onClick={() => setMostrarToast(false)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
