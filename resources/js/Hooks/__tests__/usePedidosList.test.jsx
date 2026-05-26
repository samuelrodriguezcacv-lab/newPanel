import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePedidosList } from "../usePedidosList";
import {
    getPedidosApi,
    getPedidoApi,
    actualizarEstadoPedidoApi,
    eliminarSelloApi,
    eliminarTareaApi,
} from "../../Services/pedidoService";
import {
    generarPdfEmpresaPedido,
    generarPdfHojaPedido,
    generarPdfRepetidosPedido,
    obtenerOpcionesHojasPedido,
} from "../../Utils/generarPdfPedido";

vi.mock("@inertiajs/react", () => ({
    usePage: () => ({ url: "/sellos/pedidos?resaltar=1001" }),
}));

vi.mock("../../Services/pedidoService", () => ({
    getPedidosApi: vi.fn(),
    getPedidoApi: vi.fn(),
    actualizarEstadoPedidoApi: vi.fn(),
    eliminarSelloApi: vi.fn(),
    eliminarTareaApi: vi.fn(),
}));

vi.mock("../../Utils/generarPdfPedido", () => ({
    generarPdfEmpresaPedido: vi.fn(),
    generarPdfHojaPedido: vi.fn(),
    generarPdfRepetidosPedido: vi.fn(),
    obtenerOpcionesHojasPedido: vi.fn(),
}));

const pedidosMock = [
    {
        id: 1,
        numero_pedido: 1001,
        fecha: "2026-05-25",
        estado: "abierto",
        tareas: [{ provincia: 41, sello: { id: 1 } }],
    },
    {
        id: 2,
        numero_pedido: 1002,
        fecha: "2026-05-24",
        estado: "cerrado",
        tareas: [{ provincia: 29, sello: null }],
    },
];

describe("usePedidosList", () => {
    const notify = vi.fn();
    const confirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        getPedidosApi.mockResolvedValue({ data: pedidosMock });
        getPedidoApi.mockResolvedValue({ data: { id: 1, tareas: [] } });
        obtenerOpcionesHojasPedido.mockReturnValue([{ value: "41:manual", label: "Sevilla manual" }]);
    });

    it("carga pedidos y expone resaltar desde querystring", async () => {
        const { result } = renderHook(() => usePedidosList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(getPedidosApi).toHaveBeenCalled();
        expect(result.current.pedidosFiltrados).toHaveLength(2);
        expect(result.current.resaltar).toBe("1001");
    });

    it("filtra por fecha y provincia", async () => {
        const { result } = renderHook(() => usePedidosList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        act(() => {
            result.current.setFiltroFecha("2026-05-25");
            result.current.setFiltroProvincia("41");
        });

        expect(result.current.pedidosFiltrados).toHaveLength(1);
        expect(result.current.pedidosFiltrados[0].id).toBe(1);
    });

    it("actualiza estado del pedido", async () => {
        actualizarEstadoPedidoApi.mockResolvedValue({});
        const { result } = renderHook(() => usePedidosList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.cambiarEstadoPedido(pedidosMock[0], "enviado");
        });

        expect(actualizarEstadoPedidoApi).toHaveBeenCalledWith(1, "enviado");
        expect(result.current.pedidosFiltrados.find((p) => p.id === 1)?.estado).toBe("enviado");
    });

    it("descarga pdf hoja y avisa cuando no hay opcion", async () => {
        const { result } = renderHook(() => usePedidosList({ notify, confirm }));
        await waitFor(() => expect(result.current.cargando).toBe(false));

        await act(async () => {
            await result.current.descargarPdfHoja(pedidosMock[0]);
        });

        expect(generarPdfHojaPedido).toHaveBeenCalled();

        obtenerOpcionesHojasPedido.mockReturnValue([]);
        const { result: result2 } = renderHook(() => usePedidosList({ notify, confirm }));
        await waitFor(() => expect(result2.current.cargando).toBe(false));

        await act(async () => {
            await result2.current.descargarPdfHoja(pedidosMock[0]);
        });

        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ tone: "warning" }));
    });
});
