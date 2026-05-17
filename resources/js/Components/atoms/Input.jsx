export default function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <input
      {...props}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
       
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        text-slate-900
        outline-none
        transition
        placeholder:text-slate-400
        focus:border-emerald-600
        focus:ring-4
        focus:ring-emerald-100
        disabled:cursor-not-allowed
        disabled:bg-slate-100
        disabled:text-slate-400
        ${className}
      `}
    />
  );
}