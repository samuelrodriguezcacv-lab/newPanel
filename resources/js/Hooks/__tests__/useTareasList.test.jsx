import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTareasList } from "../useTareasList";
import {
    getTareasApi,
    updateTareaEstadoApi,
    eliminarTareaApi,
    editarTareaApi,
} from "../../Services/pedidoService";

vi.mock("../../Services/pedidoService", () => ({
    getTareasApi: vi.fn(),
    updateTareaEstadoApi: vi.fn(),
    eliminarTareaApi: vi.fn(),
    editarTareaApi: vi.fn(),
}));

const tareasMock = [
    { id: 1, Tarea: 101, fecha: "2026-05-25", estado: "pendiente", provincia: 41, sellos: [] },
    { id: 2, Tarea: 202, fecha: "2026-05-24", estado: "completada", provincia: 29, sellos: [] },
];

describe("useTareasList", () => {
    const notify = vi.fn();
    const confirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        getTareasApi.mockResolvedValue({ data: tareasMock });
        history.pushState({}, "", "/");
    });

    it("carga tareas y permite filtrar", async () => {
        const { result } = renderHook(() => useTareasList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.setFiltroEstado("pendiente");
            result.current.setFiltroProvincia("41");
        });

        expect(result.current.tareasFiltradas).toHaveLength(1);
        expect(result.current.tareasFiltradas[0].id).toBe(1);
    });

    it("cambia estado en memoria", async () => {
        updateTareaEstadoApi.mockResolvedValue({});
        const { result } = renderHook(() => useTareasList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.cambiarEstado(tareasMock[0], "en_proceso");
        });

        expect(updateTareaEstadoApi).toHaveBeenCalledWith(1, "en_proceso");
        expect(result.current.tareasFiltradas.find((t) => t.id === 1)?.estado).toBe("en_proceso");
    });

    it("elimina tarea con confirmacion", async () => {
        confirm.mockResolvedValue(true);
        eliminarTareaApi.mockResolvedValue({});
        const { result } = renderHook(() => useTareasList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.eliminarTarea(1);
        });

        expect(eliminarTareaApi).toHaveBeenCalledWith(1);
        expect(result.current.tareasFiltradas).toHaveLength(1);
        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ tone: "success" }));
    });

    it("abre editor y guarda edicion", async () => {
        editarTareaApi.mockResolvedValue({});
        getTareasApi
            .mockResolvedValueOnce({ data: tareasMock })
            .mockResolvedValueOnce({ data: [{ ...tareasMock[0], estado: "completada" }, tareasMock[1]] });

        const { result } = renderHook(() => useTareasList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.abrirEditorTarea(tareasMock[0]);
            result.current.setFormEditTarea((v) => ({ ...v, estado: "completada" }));
        });

        await act(async () => {
            await result.current.guardarEdicionTarea();
        });

        expect(editarTareaApi).toHaveBeenCalledWith(1, expect.objectContaining({ estado: "completada" }));
        expect(result.current.tareaEditando).toBe(null);
    });
});
