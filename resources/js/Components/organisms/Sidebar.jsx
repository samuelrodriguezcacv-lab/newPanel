import { useState } from "react"
import { NavItem } from "../molecules/NavItem"
import { usePage, Link } from '@inertiajs/react' // <-- Importamos Link desde Inertia
import { Home, Stamp, Settings, ClipboardList, Box, SquareCheckBig, Truck, Layers, ListTodo, LogOut } from "lucide-react" // <-- Importamos el icono LogOut

export default function Sidebar() {
  const [openTools, setOpenTools] = useState(false)
  const { url } = usePage()

  return (
    <aside className="
      fixed left-4 top-4 bottom-4
      w-64
      bg-[#f7f7f7]
      border border-gray-200
      rounded-2xl
      shadow-sm hover:shadow-md
      p-4
      transition
      overflow-y-auto
      flex flex-col justify-between 
    ">
      {/* SECCIÓN SUPERIOR: MENÚS */}
      <div>
        <h2 className="text-lg font-bold mb-6 text-gray-800">Mi App</h2>

        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wider">
          Herramientas
        </h3>

        <div className="space-y-2">

          <NavItem
            icon={Home}
            label="Dashboard"
            href="/dashboard"
            active={url === '/dashboard'}
          />

          <NavItem
            icon={ListTodo}
            label="Tareas Pendientes"
            href="/tareas-logistica"
            active={url === '/tareas-logistica'}
          />

          <div>
            <div
              onClick={() => setOpenTools(!openTools)}
              className="
                flex items-center justify-between
                px-4 py-3
                rounded-xl
                hover:bg-gray-100
                cursor-pointer
                transition
              "
            >
              <div className="flex items-center gap-3">
                <Stamp size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  Sellos
                </span>
              </div>
              <span className="text-gray-400 text-xs transition-transform duration-200">
                {openTools ? "▲" : "▼"}
              </span>
            </div>

            {openTools && (
              <div className="ml-6 mt-1 space-y-2 border-l border-gray-200 pl-3">
                
                <div className="text-[11px] font-bold text-gray-400 uppercase pt-2 tracking-wider">
                  Pedidos
                </div>
                <NavItem
                  icon={Box}
                  label="Crear Sellos"
                  href="/sellos/pedidos/nuevo-pedido"
                  active={url === '/sellos/pedidos/nuevo-pedido'}
                />
                <NavItem
                  icon={ClipboardList}
                  label="Lista de Pedidos"
                  href="/sellos/pedidos"
                  active={url === '/sellos/pedidos'}
                />

                <div className="text-[11px] font-bold text-gray-400 uppercase pt-2 tracking-wider">
                  Tareas
                </div>
                <NavItem
                  icon={SquareCheckBig}
                  label="Lista de Tareas"
                  href="/sellos/tareas"
                  active={url === '/sellos/tareas'}
                />      

                <div className="text-[11px] font-bold text-gray-400 uppercase pt-2 tracking-wider">
                  Gestión de Sellos
                </div>
                <NavItem
                  icon={Stamp}
                  label="Todos los Sellos"
                  href="/sellos/gestion/todos"
                  active={url === '/sellos/gestion/todos'}
                /> 
                <NavItem
                  icon={SquareCheckBig}
                  label="Sellos Repetidos"
                  href="/sellos/gestion/repetidos"
                  active={url === '/sellos/gestion/repetidos'}
                />    
                <NavItem
                  icon={SquareCheckBig}
                  label="Sellos por Provincia"
                  href="/sellos/gestion/provincia"
                  active={url === '/sellos/gestion/provincia'}
                />  
              </div>
            )}
          </div>

          <NavItem
            icon={Layers}
            label="Metacrilatos"
            href="/metacrilatos"
            active={url === '/metacrilatos'}
          />

          <NavItem 
            icon={Truck}
            label="Pedidos Proveedores"
            href="/envio-proveedores"
            active={url === '/envio-proveedores'}
          />    

          <NavItem 
            icon={Settings} 
            label="Configuración" 
            href="/configuracion"
            active={url === '/configuracion'}
          />

        </div>
      </div>

      {/* SECCIÓN INFERIOR: CUENTA / LOGOUT */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <Link
          href="/logout"
          method="post"
          as="button"
          className="
            w-full
            flex items-center gap-3
            px-4 py-3
            rounded-xl
            text-sm font-semibold text-red-600
            hover:bg-red-50
            cursor-pointer
            transition-colors
            text-left
          "
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </Link>
      </div>

    </aside>
  )
}