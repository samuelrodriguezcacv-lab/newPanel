import { useState } from "react"
import { NavItem } from "../molecules/NavItem"
import { Folder } from "lucide-react"

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <aside className="w-64 bg-white border-r h-screen p-4">

      {/* ITEM PADRE */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between
          px-4 py-3 rounded-xl
          hover:bg-gray-100 cursor-pointer
        "
      >
        <div className="flex items-center gap-3">
          <Folder size={18} />
          <span>Projects</span>
        </div>

        <span>{open ? "▲" : "▼"}</span>
      </div>

      {/* SUBMENU */}
      {open && (
        <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-3">
          <NavItem label="Project A" />
          <NavItem label="Project B" />
          <NavItem label="Project C" />
        </div>
      )}

    </aside>
  )
}