import { useState, useEffect, useMemo } from "react";
import { getSellosApi, editarSelloApi, eliminarSelloApi } from "../Services/pedidoService";

export function useTodosSellos({ notify, confirm }) {
    const [sellos, setSellos] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [selloSeleccionado, setSelloSeleccionado] = useState(null);
    const [formEdit, setFormEdit] = useState({});

    useEffect(() => {
        loadSellos(page);
    }, [page]);

    const normalizarRespuestaSellos = (res) => {
        const payload = res?.data;
        const lista = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
                ? payload
                : [];
        const ultima = Number(payload?.last_page ?? 1);
        return { lista, ultima };
    };

    const loadSellos = async (paginaActual) => {
        setCargando(true);
        try {
            const res = await getSellosApi(paginaActual);
            const { lista, ultima } = normalizarRespuestaSellos(res);
            setSellos(lista);
            setLastPage(ultima);
        } catch (error) {
            console.error("Error al cargar sellos:", error);
            await notify({
                title: "Error al cargar sellos",
                message: "No se pudieron cargar los sellos. Intenta recargar la pagina.",
                tone: "danger",
            });
        } finally {
            setCargando(false);
        }
    };

    const seleccionarSello = (sello) => {
        setSelloSeleccionado(sello);
        setFormEdit({
            prefijo_postal: sello.prefijo_postal,
            numero_colegiado: sello.numero_colegiado,
            nombre: sello.nombre,
            apellido1: sello.apellido1,
            apellido2: sello.apellido2 ?? "",
            tipo_sello: sello.tipo_sello,
        });
    };

    const eliminarSello = async (id) => {
        const ok = await confirm({
            title: "Eliminar sello",
            message: "Se eliminara este sello de forma permanente. Revisa que no este asociado a un pedido que necesites conservar.",
            tone: "danger",
            confirmText: "Eliminar",
        });
        if (!ok) return;

        await eliminarSelloApi(id);
        const nuevosSellos = sellos.filter((s) => s.id !== id);
        setSellos(nuevosSellos);

        if (selloSeleccionado?.id === id) {
            setSelloSeleccionado(nuevosSellos[0] || null);
        }

        await notify({
            title: "Sello eliminado",
            message: "El sello se elimino correctamente.",
            tone: "success",
        });
    };

    const guardarEdicion = async () => {
        if (!selloSeleccionado?.id) return;

        await editarSelloApi(selloSeleccionado.id, formEdit);
        const res = await getSellosApi(page);
        const { lista, ultima } = normalizarRespuestaSellos(res);
        setSellos(lista);
        setLastPage(ultima);

        const actualizado = lista.find((s) => s.id === selloSeleccionado.id);
        if (actualizado) setSelloSeleccionado(actualizado);
    };

    const sellosFiltrados = useMemo(() => {
        return (Array.isArray(sellos) ? sellos : []).filter((s) => {
            const coincideBusqueda = busqueda
                ? s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                  s.apellido1.toLowerCase().includes(busqueda.toLowerCase()) ||
                  s.codigo_sello.toLowerCase().includes(busqueda.toLowerCase()) ||
                  String(s.numero_colegiado).includes(busqueda)
                : true;

            const coincideTipo = filtroTipo ? s.tipo_sello === filtroTipo : true;
            const coincideProvincia = filtroProvincia ? s.prefijo_postal == filtroProvincia : true;
            return coincideBusqueda && coincideTipo && coincideProvincia;
        });
    }, [sellos, busqueda, filtroTipo, filtroProvincia]);

    return {
        sellos,
        setSellos,
        page,
        setPage,
        lastPage,
        setLastPage,
        cargando,
        setCargando,
        busqueda,
        setBusqueda,
        filtroTipo,
        setFiltroTipo,
        filtroProvincia,
        setFiltroProvincia,
        selloSeleccionado,
        setSelloSeleccionado,
        formEdit,
        setFormEdit,
        loadSellos,
        seleccionarSello,
        eliminarSello,
        guardarEdicion,
        sellosFiltrados,
    };
}
