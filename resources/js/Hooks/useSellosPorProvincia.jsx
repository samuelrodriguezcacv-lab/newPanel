import { useEffect, useState } from "react";
import { getSellosProvinciaApi } from "../Services/pedidoService";

export function useSellosPorProvincia() {
    const [sellos, setSellos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [provinciaActiva, setProvinciaActiva] = useState(null);

    useEffect(() => {
        getSellosProvinciaApi().then((res) => {
            setSellos(res.data);
            setCargando(false);
        });
    }, []);

    const toggleProvinciaActiva = (prefijo) => {
        setProvinciaActiva((actual) => (actual == prefijo ? null : prefijo));
    };

    return {
        sellos,
        cargando,
        provinciaActiva,
        setProvinciaActiva,
        toggleProvinciaActiva,
    };
}
