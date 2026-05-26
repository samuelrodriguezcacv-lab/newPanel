import { useEffect, useMemo, useState } from "react";
import { getMetricasApi } from "../Services/pedidoService";

const PROVINCIAS = {
    4: "Almeria", 11: "Cadiz", 14: "Cordoba", 18: "Granada",
    21: "Huelva", 23: "Jaen", 29: "Malaga", 41: "Sevilla"
};

export function useDashboardSellos() {
    const [metricas, setMetricas] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [tareaActiva, setTareaActiva] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tareaUrl = params.get("tarea");
        if (tareaUrl) {
            setTareaActiva(tareaUrl);
        }
    }, []);

    useEffect(() => {
        getMetricasApi().then((res) => {
            setMetricas(res.data);
            setCargando(false);
        });
    }, []);

    const datosGrafico = useMemo(
        () =>
            metricas?.sellos_provincia.map((s) => ({
                provincia: PROVINCIAS[s.prefijo_postal] ?? s.prefijo_postal,
                total: s.total,
            })) ?? [],
        [metricas]
    );

    return {
        metricas,
        cargando,
        tareaActiva,
        setTareaActiva,
        datosGrafico,
    };
}
