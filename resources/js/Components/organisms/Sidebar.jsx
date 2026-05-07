import { useState } from "react"
import { NavItem } from "../molecules/NavItem"
import { Home, Stamp, Settings, Folder } from "lucide-react"

export default function Sidebar() {
  const [openTools, setOpenTools] = useState(false)

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
        <NavItem icon={Home} label="Dashboard" />

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

              <NavItem icon={Stamp} label="Generar Sellos" />
          

            </div>
          )}

                <NavItem icon={Settings} label="Configuración" />
        </div>

      </div>
    </aside>
  )
}