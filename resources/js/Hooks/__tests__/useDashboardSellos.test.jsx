import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardSellos } from "../useDashboardSellos";
import { getMetricasApi } from "../../Services/pedidoService";

vi.mock("../../Services/pedidoService", () => ({
    getMetricasApi: vi.fn(),
}));

const metricasMock = {
    total_sellos: 10,
    sellos_provincia: [
        { prefijo_postal: 41, total: 7 },
        { prefijo_postal: 29, total: 3 },
    ],
};

describe("useDashboardSellos", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getMetricasApi.mockResolvedValue({ data: metricasMock });
        history.pushState({}, "", "/sellos/dashboard?tarea=777");
    });

    it("lee tarea activa de URL y carga metricas", async () => {
        const { result } = renderHook(() => useDashboardSellos());

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(getMetricasApi).toHaveBeenCalled();
        expect(result.current.tareaActiva).toBe("777");
        expect(result.current.metricas.total_sellos).toBe(10);
    });

    it("mapea datosGrafico con nombres de provincia", async () => {
        const { result } = renderHook(() => useDashboardSellos());

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(result.current.datosGrafico).toEqual([
            { provincia: "Sevilla", total: 7 },
            { provincia: "Malaga", total: 3 },
        ]);
    });
});
