export default function SelectorToggle({
  value,
  onChange,
  options = []
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              value === option.value
                ? "bg-white shadow text-green-700"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {option.label}
        </button>
      ))}

    </div>
  )
}