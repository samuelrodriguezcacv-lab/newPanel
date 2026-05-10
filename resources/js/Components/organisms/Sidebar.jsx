import { useState } from "react"
import { NavItem } from "../molecules/NavItem"
import { Link, usePage } from '@inertiajs/react'
import { Home, Stamp, Settings, Folder,ClipboardCheck, Box,ClipboardList, SquareCheckBig} from "lucide-react" 

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
    ">
      <h2 className="text-lg font-bold mb-6">Mi App</h2>

      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
        Herramientas
      </h3>

      <div className="space-y-2">

        {/* ITEM NORMAL */}
        <NavItem
          icon={Home}
          label="Dashboard"
          href="/sellos/dashboard-sellos"
          active={url === '/sellos/dashboard-sellos'}
        />

        {/* ITEM CON SUBMENU */}
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
              <Stamp size={18} />
              <span className="text-sm font-medium text-gray-800">
                Sellos
              </span>
            </div>

            <span className="text-gray-400 text-sm">
              {openTools ? "▲" : "▼"}
            </span>
          </div>

          {/* SUBMENU */}
          {openTools && (
            <div className="ml-6 mt-2 space-y-2 border-l border-gray-200 pl-3">
                 <NavItem
                icon={Home}
                label="Dashboard"
                href="/sellos/dashboard-sellos"
                active={url === '/sellos/Dashboard/DashboardSellos'}
              />

             
             Pedidos
               <NavItem
                icon={Box}
                label="Nuevo Pedidos"
               href="/sellos/pedidos/nuevo-pedido"
              active={url === '/sellos/pedidos/nuevo-pedido'}
              />

               <NavItem
                  icon={ClipboardList}
                  label="Lista de Pedidos"
                  href="/sellos/pedidos"
                  active={url === '/sellos/pedidos'}
              />

          
          <div className="flex"> <SquareCheckBig/>  Tareas</div>
              
              <NavItem
                  icon={SquareCheckBig}
                  label="Lista de Tareas"
                  href="/sellos/tareas"
                  active={url === '/sellos/tareas'}
              />      

            Gestión de Sellos
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

                <NavItem icon={Settings} label="Configuración" />
        </div>

      </div>
    </aside>
  )
}