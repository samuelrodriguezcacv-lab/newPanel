import { useEffect, useMemo, useState } from "react";
import { getSellosRepetidosApi } from "../Services/pedidoService";

export function useSellosRepetidos() {
    const [sellos, setSellos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {
        getSellosRepetidosApi().then((res) => {
            setSellos(res.data);
            setCargando(false);
        });
    }, []);

    const sellosFiltrados = useMemo(
        () => sellos.filter((s) => (filtroTipo ? s.tipo_sello === filtroTipo : true)),
        [sellos, filtroTipo]
    );

    const totalCargosExtra = useMemo(
        () => sellosFiltrados.reduce((acc, s) => acc + (s.veces_generado || 0), 0),
        [sellosFiltrados]
    );

    return {
        sellos,
        cargando,
        filtroTipo,
        setFiltroTipo,
        sellosFiltrados,
        totalCargosExtra,
    };
}
