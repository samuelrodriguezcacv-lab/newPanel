import Sidebar from "../Components/organisms/Sidebar.jsx";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertTriangle, Bell, CheckCircle2, Clock, UserRound, X } from "lucide-react";

export default function Layout({ children, title, subtitle }) {
  const { props, url } = usePage();
  const user = props.auth?.user;
  const [notificaciones, setNotificaciones] = useState(null);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [abrirPanelNotificaciones, setAbrirPanelNotificaciones] = useState(false);

  const TITULOS_POR_RUTA = useMemo(() => ([
    { match: /^\/dashboard/, title: "Dashboard" },
    { match: /^\/sellos\/pedidos\/nuevo-pedido/, title: "Nuevo Pedido" },
    { match: /^\/sellos\/pedidos/, title: "Lista de Pedidos" },
    { match: /^\/sellos\/tareas/, title: "Lista de Tareas" },
    { match: /^\/sellos\/gestion\/todos/, title: "Todos los Sellos" },
    { match: /^\/sellos\/gestion\/repetidos/, title: "Sellos Repetidos" },
    { match: /^\/sellos\/gestion\/provincia/, title: "Sellos por Provincia" },
    { match: /^\/metacrilatos\/pedidos/, title: "Pedidos de Metacrilatos" },
    { match: /^\/metacrilatos\/tareas/, title: "Tareas de Metacrilatos" },
    { match: /^\/metacrilatos/, title: "Metacrilatos" },
    { match: /^\/envio-proveedores/, title: "Envio a Proveedores" },
    { match: /^\/tareas-logistica/, title: "Tareas Pendientes" },
    { match: /^\/incidencias/, title: "Incidencias" },
    { match: /^\/plantilla-envio/, title: "Plantilla de Envio" },
    { match: /^\/email/, title: "Envio Email" },
  ]), []);

  const tituloPorRuta = useMemo(() => {
    const limpio = (url ?? "").split("?")[0];
    return TITULOS_POR_RUTA.find((item) => item.match.test(limpio))?.title ?? "Panel";
  }, [TITULOS_POR_RUTA, url]);
  const tituloActual = title ?? tituloPorRuta;
  const subtituloActual = subtitle ?? "Gestion operativa diaria";

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
  const totalAvisos = tareasSinFinalizar + pedidosAbiertos;

  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full p-6">
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Herramientas Logistica</p>
              <h1 className="truncate text-xl font-bold text-slate-900">{tituloActual}</h1>
              <p className="truncate text-xs text-slate-500">{subtituloActual}</p>
            </div>

            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAbrirPanelNotificaciones((prev) => !prev)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="Abrir notificaciones"
              >
                <Bell className="h-5 w-5" />
                {totalAvisos > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {totalAvisos > 99 ? "99+" : totalAvisos}
                  </span>
                )}
              </button>

              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <UserRound className="h-4 w-4" />
                </span>
                <span>{user?.name ?? "Usuario"}</span>
              </div>
            </div>
          </div>

          {abrirPanelNotificaciones && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
              <p className="font-semibold text-gray-800">Notificaciones</p>
              <p className="mt-1 text-gray-600">
                Tareas sin finalizar: <span className="font-bold">{tareasSinFinalizar}</span>
              </p>
              <p className="text-gray-600">
                Pedidos abiertos fuera de tiempo: <span className="font-bold">{pedidosAbiertos}</span>
              </p>
            </div>
          )}
        </div>

        <div className="pt-3">
          {children}
        </div>
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
