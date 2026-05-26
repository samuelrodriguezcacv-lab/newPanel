import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTodosSellos } from "../useTodosSellos";
import { getSellosApi, editarSelloApi, eliminarSelloApi } from "../../Services/pedidoService";

vi.mock("../../Services/pedidoService", () => ({
    getSellosApi: vi.fn(),
    editarSelloApi: vi.fn(),
    eliminarSelloApi: vi.fn(),
}));

const sello1 = {
    id: 1,
    codigo_sello: "SEL-001",
    nombre: "Ana",
    apellido1: "Lopez",
    apellido2: "Ruiz",
    numero_colegiado: 1234,
    prefijo_postal: 41,
    tipo_sello: "manual",
};

const sello2 = {
    id: 2,
    codigo_sello: "SEL-002",
    nombre: "Luis",
    apellido1: "Perez",
    apellido2: "Diaz",
    numero_colegiado: 5678,
    prefijo_postal: 29,
    tipo_sello: "automatico",
};

describe("useTodosSellos", () => {
    const notify = vi.fn();
    const confirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        getSellosApi.mockResolvedValue({
            data: { data: [sello1, sello2], last_page: 3 },
        });
    });

    it("carga sellos al iniciar", async () => {
        const { result } = renderHook(() => useTodosSellos({ notify, confirm }));

        await waitFor(() => {
            expect(result.current.cargando).toBe(false);
        });

        expect(getSellosApi).toHaveBeenCalledWith(1);
        expect(result.current.sellos).toHaveLength(2);
        expect(result.current.lastPage).toBe(3);
    });

    it("filtra por busqueda y tipo", async () => {
        const { result } = renderHook(() => useTodosSellos({ notify, confirm }));

        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.setBusqueda("ana");
            result.current.setFiltroTipo("manual");
        });

        expect(result.current.sellosFiltrados).toHaveLength(1);
        expect(result.current.sellosFiltrados[0].id).toBe(1);
    });

    it("elimina sello cuando confirm devuelve true", async () => {
        confirm.mockResolvedValue(true);
        eliminarSelloApi.mockResolvedValue({});

        const { result } = renderHook(() => useTodosSellos({ notify, confirm }));

        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.eliminarSello(1);
        });

        expect(confirm).toHaveBeenCalled();
        expect(eliminarSelloApi).toHaveBeenCalledWith(1);
        expect(result.current.sellos).toHaveLength(1);
        expect(result.current.sellos[0].id).toBe(2);
        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ tone: "success" }));
    });

    it("no elimina sello cuando confirm devuelve false", async () => {
        confirm.mockResolvedValue(false);

        const { result } = renderHook(() => useTodosSellos({ notify, confirm }));

        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.eliminarSello(1);
        });

        expect(eliminarSelloApi).not.toHaveBeenCalled();
        expect(result.current.sellos).toHaveLength(2);
    });

    it("guarda edicion y refresca pagina actual", async () => {
        editarSelloApi.mockResolvedValue({});
        getSellosApi
            .mockResolvedValueOnce({ data: { data: [sello1, sello2], last_page: 3 } })
            .mockResolvedValueOnce({
                data: {
                    data: [{ ...sello1, nombre: "Ana Maria" }, sello2],
                    last_page: 3,
                },
            });

        const { result } = renderHook(() => useTodosSellos({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.seleccionarSello(sello1);
            result.current.setFormEdit((actual) => ({ ...actual, nombre: "Ana Maria" }));
        });

        await act(async () => {
            await result.current.guardarEdicion();
        });

        expect(editarSelloApi).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: "Ana Maria" }));
        expect(getSellosApi).toHaveBeenLastCalledWith(1);
        expect(result.current.sellos[0].nombre).toBe("Ana Maria");
    });
});
