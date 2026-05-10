export default function Button({
  variant = "primary",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "", // ← añade esto
}) {
  const base =
    "px-4 py-3 font-semibold rounded-3xl transition-all active:scale-[0.98] font-sans"

  const styles = {
    primary: `
      text-white
      bg-gradient-to-r from-[#166534] to-[#15803d]
      hover:from-[#15803d] hover:to-[#14532d]
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white
      text-[#166534]
      border border-[#166534]
      hover:bg-[#166534]/10
    `,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`} // ← añade className aquí
    >
      {children}
    </button>
  )
}