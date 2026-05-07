import Input from "../atoms/Input"
import { Badge } from "../atoms/Badge"
import Button from "../atoms/Button"

export function SelloSearch({ value, onChange, onAdd, count }) {
  return (
    <Badge>

      <h3 className="font-semibold mb-3">
        Buscar / Crear Sellos
      </h3>

      <Input
        value={value}
        onChange={onChange}
        placeholder="Nombre o nº colegiado..."
      />

      <div className="flex justify-between mt-3 items-center">

        <span className="text-sm text-slate-500">
          Sellos manuales: {count}
        </span>

        <Button onClick={onAdd}>
          + Añadir
        </Button>

      </div>

    </Badge>
  )
}