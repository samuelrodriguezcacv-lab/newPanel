import { useState } from "react"
import { NavItem } from "../molecules/NavItem"
import { Link } from '@inertiajs/react'
import { Home, Stamp, Settings, Folder,ClipboardCheck } from "lucide-react"
import { usePage } from '@inertiajs/react'

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
                icon={ClipboardCheck}
                label="Tareas de Sellos"
               href="/sellos/sellos-tareas"
              active={url === '/sellos/sellos-tareas'}
              />

              <NavItem
                icon={Stamp}
                label="Generar Sellos"
                href="/sellos/generar-sellos"
                active={url === '/sellos/generar-sellos'}
              />
                    

            </div>
          )}

                <NavItem icon={Settings} label="Configuración" />
        </div>

      </div>
    </aside>
  )
}