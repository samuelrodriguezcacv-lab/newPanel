import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NuevoPedido from "../NuevoPedido";

vi.mock("../../../../Hooks/usePedidoFlow.jsx", () => ({
    usePedidoFlow: vi.fn(),
}));

vi.mock("../../../../Template/LayaoutNav.jsx", () => ({
    default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

import { usePedidoFlow } from "../../../../Hooks/usePedidoFlow.jsx";

const baseHookState = {
    pedidos: [],
    pedido: null,
    setPedido: vi.fn(),
    tareaCreada: null,
    setTareaCreada: vi.fn(),
    sello: {
        prefijo_postal: "",
        numero_colegiado: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        tipo_sello: "manual",
    },
    setSello: vi.fn(),
    sellosAcumulados: [],
    cargando: false,
    cargandoSello: false,
    editarSelloAcumulado: vi.fn(),
    eliminarSellosAcumulados: vi.fn(),
    erroresSello: {},
    editandoIndex: null,
    crearPedido: vi.fn(),
    seleccionarPedido: vi.fn(),
    cambiarPedido: vi.fn(),
    cerrarPedido: vi.fn(),
    acumularSello: vi.fn(),
    confirmarSellos: vi.fn(),
    nuevaTarea: vi.fn(),
    tareaUrl: null,
    tareaLogisticaId: null,
    feedbackModal: null,
};

describe("NuevoPedido", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra boton de nuevo pedido y ejecuta crearPedido", () => {
        usePedidoFlow.mockReturnValue({ ...baseHookState });

        render(<NuevoPedido />);

        const botonNuevoPedido = screen.getByRole("button", { name: /\+ nuevo pedido/i });
        fireEvent.click(botonNuevoPedido);

        expect(baseHookState.crearPedido).toHaveBeenCalledTimes(1);
    });

    it("muestra pedidos existentes y permite seleccionar uno", () => {
        const seleccionarPedido = vi.fn();
        usePedidoFlow.mockReturnValue({
            ...baseHookState,
            seleccionarPedido,
            pedidos: [
                { id: 10, numero_pedido: "P-100", tareas: [{ id: 1 }], estado: "abierto" },
            ],
        });

        render(<NuevoPedido />);

        const botonPedidoExistente = screen.getByRole("button", { name: /p-100/i });
        fireEvent.click(botonPedidoExistente);

        expect(seleccionarPedido).toHaveBeenCalledWith(
            expect.objectContaining({ id: 10, numero_pedido: "P-100" })
        );
    });

    it("con pedido y tarea creada permite confirmar sellos acumulados", () => {
        const confirmarSellos = vi.fn();
        usePedidoFlow.mockReturnValue({
            ...baseHookState,
            pedido: { id: 1, numero_pedido: "P-200", estado: "abierto" },
            tareaCreada: { id: 50, numero_tarea: "500", provincia: 41 },
            sellosAcumulados: [
                { id: 1, nombre: "Ana", apellido1: "Lopez", codigo_sello: "SEL-1", tipo_sello: "manual" },
            ],
            confirmarSellos,
        });

        render(<NuevoPedido />);

        const botonConfirmar = screen.getByRole("button", { name: /añadir al pedido/i });
        fireEvent.click(botonConfirmar);

        expect(confirmarSellos).toHaveBeenCalledTimes(1);
        expect(screen.getAllByText(/#500/).length).toBeGreaterThan(0);
    });
});
