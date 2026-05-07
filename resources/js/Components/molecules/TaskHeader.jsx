import Input from "../atoms/Input"
import { Badge } from "../atoms/Badge"

export function TaskHeader() {
  return (
    <Badge>

      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-lg">
          Sellos Tarea
        </h2>

        <span className="text-sm text-slate-500">
          07/05/2026
        </span>
      </div>

      <Input
        placeholder="Número de tarea"
      />

    </Badge>
  )
}