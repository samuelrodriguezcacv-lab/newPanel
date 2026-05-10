import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PROVINCIAS = {
    4: "Almería", 11: "Cádiz", 14: "Córdoba", 18: "Granada",
    21: "Huelva", 23: "Jaén", 29: "Málaga", 41: "Sevilla"
};

export function generarPdfPedido(pedido) {
    const doc = new jsPDF();

    // CABECERA
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Pedido ${pedido.numero_pedido}`, 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${pedido.fecha}`, 14, 28);
    doc.text(`Estado: ${pedido.estado ?? 'abierto'}`, 14, 34);

    // Recoge todos los sellos agrupados por tipo y provincia
    const manuales = {};
    const automaticos = {};

    pedido.tareas?.forEach((t) => {
        t.sellos?.forEach((s) => {
            const prov = t.provincia;
            if (s.tipo_sello === "manual") {
                if (!manuales[prov]) manuales[prov] = [];
                manuales[prov].push({ ...s, tarea: t.Tarea });
            } else {
                if (!automaticos[prov]) automaticos[prov] = [];
                automaticos[prov].push({ ...s, tarea: t.Tarea });
            }
        });
    });

    let y = 44;

    // SECCIÓN MANUAL
    if (Object.keys(manuales).length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 64, 175);
        doc.text("SELLOS MANUALES", 14, y);
        y += 4;
        doc.setDrawColor(30, 64, 175);
        doc.line(14, y, 196, y);
        y += 8;
        doc.setTextColor(0, 0, 0);

        Object.entries(manuales).forEach(([provincia, sellos]) => {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`${PROVINCIAS[provincia] ?? provincia}`, 14, y);
            y += 4;

            autoTable(doc, {
                startY: y,
                head: [[ "Código", "Colegiado", "Nombre", "Apellidos"]],
                body: sellos.map((s) => [
                    
                    s.codigo_sello,
                    s.numero_colegiado,
                    s.nombre,
                    `${s.apellido1} ${s.apellido2 ?? ""}`.trim(),
                ]),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [219, 234, 254], textColor: [30, 64, 175] },
                margin: { left: 14, right: 14 },
            });
            y = doc.lastAutoTable.finalY + 8;
        });
    }

    // SALTO DE PÁGINA ANTES DE AUTOMÁTICOS
    if (Object.keys(manuales).length > 0 && Object.keys(automaticos).length > 0) {
        doc.addPage();
        y = 20;
    }

    // SECCIÓN AUTOMÁTICO
    if (Object.keys(automaticos).length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(109, 40, 217);
        doc.text("SELLOS AUTOMÁTICOS", 14, y);
        y += 4;
        doc.setDrawColor(109, 40, 217);
        doc.line(14, y, 196, y);
        y += 8;
        doc.setTextColor(0, 0, 0);

        Object.entries(automaticos).forEach(([provincia, sellos]) => {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`${PROVINCIAS[provincia] ?? provincia}`, 14, y);
            y += 4;

            autoTable(doc, {
                startY: y,
                head: [[ "Código", "Colegiado", "Nombre", "Apellidos"]],
                body: sellos.map((s) => [
                    
                    s.codigo_sello,
                    s.numero_colegiado,
                    s.nombre,
                    `${s.apellido1} ${s.apellido2 ?? ""}`.trim(),
                ]),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [237, 233, 254], textColor: [109, 40, 217] },
                margin: { left: 14, right: 14 },
            });
            y = doc.lastAutoTable.finalY + 8;
        });
    }

    doc.save(`pedido-${pedido.numero_pedido}.pdf`);
}