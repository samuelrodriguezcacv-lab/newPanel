import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSellosPorProvincia } from "../useSellosPorProvincia";
import { getSellosProvinciaApi } from "../../Services/pedidoService";

vi.mock("../../Services/pedidoService", () => ({
    getSellosProvinciaApi: vi.fn(),
}));

const dataMock = {
    41: [{ id: 1 }, { id: 2 }],
    29: [{ id: 3 }],
};

describe("useSellosPorProvincia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getSellosProvinciaApi.mockResolvedValue({ data: dataMock });
    });

    it("carga sellos agrupados por provincia", async () => {
        const { result } = renderHook(() => useSellosPorProvincia());

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(getSellosProvinciaApi).toHaveBeenCalled();
        expect(Object.keys(result.current.sellos)).toHaveLength(2);
        expect(result.current.provinciaActiva).toBe(null);
    });

    it("togglea provincia activa", async () => {
        const { result } = renderHook(() => useSellosPorProvincia());
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.toggleProvinciaActiva("41");
        });
        expect(result.current.provinciaActiva).toBe("41");

        act(() => {
            result.current.toggleProvinciaActiva("41");
        });
        expect(result.current.provinciaActiva).toBe(null);
    });
});
