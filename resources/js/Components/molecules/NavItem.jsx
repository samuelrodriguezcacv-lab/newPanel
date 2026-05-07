import { Link } from '@inertiajs/react'

export function NavItem({ icon: Icon, label, href, active }) {
  return (
    <Link
      href={href}
      className="
        relative group flex items-center gap-3
        px-4 py-3 rounded-xl
        hover:bg-gray-50 transition
      "
    >

      {/* barra verde izquierda */}
      <div className={`
        absolute left-0 top-2 bottom-2
        w-1 bg-green-600
        rounded-r-full
        transition
        ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `} />

      <Icon size={18} className="text-gray-600" />

      <span className={`text-sm font-medium ${
        active ? "text-green-700" : "text-gray-800"
      }`}>
        {label}
      </span>

    </Link>
  )
}