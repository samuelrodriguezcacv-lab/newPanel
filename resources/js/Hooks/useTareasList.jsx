import { useEffect, useMemo, useState } from "react";
import { getTareasApi, updateTareaEstadoApi, eliminarTareaApi, editarTareaApi } from "../Services/pedidoService";

export function useTareasList({ notify, confirm }) {
    const [tareas, setTareas] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [tareaDetalle, setTareaDetalle] = useState(null);
    const [tareaEditando, setTareaEditando] = useState(null);
    const [formEditTarea, setFormEditTarea] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tareaUrl = params.get("tarea");

        getTareasApi().then((res) => {
            setTareas(res.data);
            setCargando(false);

            if (tareaUrl) {
                const tareaEncontrada = res.data.find((t) => String(t.Tarea) === String(tareaUrl));
                if (tareaEncontrada) {
                    setTareaDetalle(tareaEncontrada);
                    setTimeout(() => {
                        document.getElementById(`tarea-${tareaEncontrada.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 300);
                }
            }
        });
    }, []);

    const cambiarEstado = async (tarea, estado) => {
        await updateTareaEstadoApi(tarea.id, estado);
        setTareas(tareas.map((t) => (t.id === tarea.id ? { ...t, estado } : t)));
    };

    const eliminarTarea = async (id) => {
        const ok = await confirm({
            title: "Eliminar tarea de sellos",
            message: "Se eliminara esta tarea y todos sus sellos asignados.",
            tone: "danger",
            confirmText: "Eliminar",
        });
        if (!ok) return;

        await eliminarTareaApi(id);
        setTareas(tareas.filter((t) => t.id !== id));
        await notify({ title: "Tarea eliminada", message: "La tarea se elimino correctamente.", tone: "success" });
    };

    const abrirEditorTarea = (t) => {
        setTareaEditando(t);
        setFormEditTarea({ Tarea: t.Tarea, fecha: t.fecha, estado: t.estado, provincia: t.provincia });
    };

    const guardarEdicionTarea = async () => {
        await editarTareaApi(tareaEditando.id, formEditTarea);
        const res = await getTareasApi();
        setTareas(res.data);
        setTareaEditando(null);
    };

    const tareasFiltradas = useMemo(() => {
        return tareas.filter((t) => {
            const coincideEstado = filtroEstado ? t.estado === filtroEstado : true;
            const coincideProvincia = filtroProvincia ? t.provincia == filtroProvincia : true;
            return coincideEstado && coincideProvincia;
        });
    }, [tareas, filtroEstado, filtroProvincia]);

    return {
        tareas,
        filtroEstado,
        setFiltroEstado,
        filtroProvincia,
        setFiltroProvincia,
        tareaDetalle,
        setTareaDetalle,
        tareaEditando,
        setTareaEditando,
        formEditTarea,
        setFormEditTarea,
        cargando,
        cambiarEstado,
        eliminarTarea,
        abrirEditorTarea,
        guardarEdicionTarea,
        tareasFiltradas,
    };
}
