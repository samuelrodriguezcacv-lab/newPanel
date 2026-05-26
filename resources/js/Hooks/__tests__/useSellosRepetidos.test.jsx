import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSellosRepetidos } from "../useSellosRepetidos";
import { getSellosRepetidosApi } from "../../Services/pedidoService";

vi.mock("../../Services/pedidoService", () => ({
    getSellosRepetidosApi: vi.fn(),
}));

const dataMock = [
    { id: 1, tipo_sello: "manual", veces_generado: 2 },
    { id: 2, tipo_sello: "automatico", veces_generado: 1 },
    { id: 3, tipo_sello: "manual", veces_generado: 0 },
];

describe("useSellosRepetidos", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getSellosRepetidosApi.mockResolvedValue({ data: dataMock });
    });

    it("carga sellos repetidos", async () => {
        const { result } = renderHook(() => useSellosRepetidos());

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(getSellosRepetidosApi).toHaveBeenCalled();
        expect(result.current.sellos).toHaveLength(3);
        expect(result.current.sellosFiltrados).toHaveLength(3);
        expect(result.current.totalCargosExtra).toBe(3);
    });

    it("filtra por tipo y recalcula total", async () => {
        const { result } = renderHook(() => useSellosRepetidos());
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.setFiltroTipo("manual");
        });

        expect(result.current.sellosFiltrados).toHaveLength(2);
        expect(result.current.totalCargosExtra).toBe(2);
    });
});
