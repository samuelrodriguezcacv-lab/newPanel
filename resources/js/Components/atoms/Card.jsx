import { ArrowUpRight } from "lucide-react";

export default function Card({
  type = "secondary",
  title,
  value,
  description,
}) {
  const isPrimary = type === "primary";

  const cardStyle = isPrimary
    ? "bg-gradient-to-br from-emerald-700 to-emerald-950 text-white"
    : "bg-white text-slate-950";

  const iconButtonStyle = isPrimary
    ? "border-white/20 bg-white/15 text-white"
    : "border-slate-200 bg-white text-slate-900";

  const descriptionStyle = isPrimary
    ? "text-emerald-100"
    : "text-emerald-700";

  return (
    <section
      className={`
        min-h-[145px]
         max-w-[260px]
        rounded-[24px]
        p-5
        shadow-sm
        ${cardStyle}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium">
          {title}
        </p>

        <button
          type="button"
          className={`
            flex h-9 w-9 items-center justify-center rounded-full border
            ${iconButtonStyle}
          `}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <p className="mt-4 text-5xl font-semibold tracking-tight">
        {value}
      </p>

      <p className={`mt-3 text-xs ${descriptionStyle}`}>
        {description}
      </p>
    </section>
  );
}