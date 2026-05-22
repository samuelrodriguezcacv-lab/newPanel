import jsPDF from "jspdf";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";
import { getSellosRepetidosApi } from "../Services/pedidoService"

import calibriRegularUrl from "../../fonts/calibri-regular.ttf?url";
import calibriBoldUrl from "../../fonts/calibri-bold.ttf?url";

const PROVINCIAS = {
  "04": "ALMERIA",
  "11": "CADIZ",
  "14": "CORDOBA",
  "18": "GRANADA",
  "21": "HUELVA",
  "23": "JAEN",
  "29": "MALAGA",
  "41": "SEVILLA",
};

async function convertirFuenteABase64(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar la fuente: ${url}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

async function registrarCalibri(doc) {
  const calibriRegularBase64 = await convertirFuenteABase64(calibriRegularUrl);
  const calibriBoldBase64 = await convertirFuenteABase64(calibriBoldUrl);

  doc.addFileToVFS("calibri-regular.ttf", calibriRegularBase64);
  doc.addFont("calibri-regular.ttf", "Calibri", "normal");
  doc.addFileToVFS("calibri-bold.ttf", calibriBoldBase64);
  doc.addFont("calibri-bold.ttf", "Calibri", "bold");
}

function normalizarProvincia(prefijo) {
  return String(prefijo ?? "").padStart(2, "0");
}

function nombreProvincia(prefijo) {
  return PROVINCIAS[normalizarProvincia(prefijo)] ?? prefijo ?? "SIN PROVINCIA";
}

function numeroTareaDesdeAsignacion(tarea) {
  return tarea.tarea_logistica?.numero_tarea
    ?? tarea.numero_tarea
    ?? tarea.Tarea
    ?? tarea.tareas_logistica_id
    ?? "";
}

function extraerSellosPedido(pedido) {
  const sellos = [];

  pedido.tareas?.forEach((tarea) => {
    const tareaNumero = numeroTareaDesdeAsignacion(tarea);

    if (tarea.sello) {
      sellos.push({
        ...tarea.sello,
        tarea: tareaNumero,
      });
    }

    tarea.sellos?.forEach((sello) => {
      sellos.push({
        ...sello,
        tarea: tareaNumero,
      });
    });
  });

  return sellos;
}

function agruparSellosPorProvinciaYTipo(pedido) {
  const grupos = {};

  extraerSellosPedido(pedido).forEach((sello) => {
    const provincia = normalizarProvincia(sello.prefijo_postal);
    const tipo = sello.tipo_sello === "automatico" ? "automatico" : "manual";

    if (!grupos[provincia]) {
      grupos[provincia] = {
        manual: [],
        automatico: [],
      };
    }

    grupos[provincia][tipo].push(sello);
  });

  return Object.fromEntries(Object.entries(grupos).sort());
}

function resumenRecibisPorProvincia(grupos) {
  return Object.fromEntries(
    Object.entries(grupos).map(([provincia, tipos]) => [
      provincia,
      {
        manual: tipos.manual.length,
        automatico: tipos.automatico.length,
        total: tipos.manual.length + tipos.automatico.length,
      },
    ])
  );
}

function subrayarTexto(doc, texto, x, y, align = "left") {
  const ancho = doc.getTextWidth(texto);
  let xInicio = x;
  let xFin = x + ancho;

  if (align === "center") {
    xInicio = x - ancho / 2;
    xFin = x + ancho / 2;
  }

  doc.line(xInicio, y + 1, xFin, y + 1);
}

function comprobarSaltoPagina(doc, y, espacioNecesario = 20) {
  if (y + espacioNecesario > 285) {
    doc.addPage();
    return 18;
  }

  return y;
}

function pintarTituloCentradoPdf(doc, titulo, y) {
  doc.setTextColor(0, 0, 0);
  doc.setFont("Calibri", "bold");
  doc.setFontSize(12);
  doc.text(titulo, 105, y, { align: "center" });
  subrayarTexto(doc, titulo, 105, y, "center");

  return y + 12;
}

function pintarColegioPdf(doc, provincia, y) {
  const titulo = `COLEGIO DE ${nombreProvincia(provincia)}`;

  doc.setTextColor(0, 0, 0);
  doc.setFont("Calibri", "bold");
  doc.setFontSize(12);
  doc.text(titulo, 12, y);
  subrayarTexto(doc, titulo, 12, y, "left");

  return y + 12;
}

function pintarCabeceraColumnasPdf(doc, y, mostrarPedido = false) {
  doc.setFont("Calibri", "bold");
  doc.setFontSize(11);
  if (mostrarPedido) {
    doc.text("Pedido", 12, y);
    doc.text("Tarea", 34, y);
    doc.text("Nombre", 58, y);
    doc.text("Apellido1", 92, y);
    doc.text("Apellido2", 130, y);
    doc.text("Nuevo numero", 167, y);
  } else {
    doc.text("Tarea", 12, y);
    doc.text("Nombre", 32, y);
    doc.text("Apellido1", 70, y);
    doc.text("Apellido2", 110, y);
    doc.text("Nuevo numero", 155, y);
  }
  return y + 7;
}

function pintarSelloPdf(doc, sello, y, mostrarPedido = false) {
  doc.setFont("Calibri", "normal");
  doc.setFontSize(10);
  if (mostrarPedido) {
    doc.text(String(sello.numero_pedido ?? ""), 12, y);
    doc.text(String(sello.tarea ?? ""), 34, y);
    doc.text(String(sello.nombre ?? ""), 58, y);
    doc.text(String(sello.apellido1 ?? ""), 92, y);
    doc.text(String(sello.apellido2 ?? ""), 130, y);
    doc.text(String(sello.codigo_sello ?? ""), 167, y);
  } else {
    doc.text(String(sello.tarea ?? ""), 12, y);
    doc.text(String(sello.nombre ?? ""), 32, y);
    doc.text(String(sello.apellido1 ?? ""), 70, y);
    doc.text(String(sello.apellido2 ?? ""), 110, y);
    doc.text(String(sello.codigo_sello ?? ""), 155, y);
  }
  return y + 6;
}

function pintarListadoSellosPdf(doc, titulo, sellos, subtitulo = "") {
  let y = 18;

  doc.setFont("Calibri", "bold");
  doc.setFontSize(13);
  doc.text(titulo, 105, y, { align: "center" });
  subrayarTexto(doc, titulo, 105, y, "center");
  y += 10;

  if (subtitulo) {
    doc.setFont("Calibri", "normal");
    doc.setFontSize(10);
    doc.text(subtitulo, 12, y);
    y += 10;
  }

  if (!sellos.length) {
    doc.setFont("Calibri", "normal");
    doc.setFontSize(10);
    doc.text("No hay sellos para este listado.", 12, y);
    return;
  }

  y = pintarCabeceraColumnasPdf(doc, y);

  sellos.forEach((sello) => {
    y = comprobarSaltoPagina(doc, y, 10);
    y = pintarSelloPdf(doc, sello, y);
  });
}

function pintarTipoProvinciaPdf(doc, titulo, sellos, y) {
  if (!sellos.length) {
    return y;
  }

  y = comprobarSaltoPagina(doc, y, 28);
  y = pintarTituloCentradoPdf(doc, titulo, y);
  y = pintarCabeceraColumnasPdf(doc, y);

  sellos.forEach((sello) => {
    y = comprobarSaltoPagina(doc, y, 10);
    y = pintarSelloPdf(doc, sello, y);
  });

  return y + 10;
}

async function generarListadoPdf(pedido, grupos) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  const entradas = Object.entries(grupos);

  if (entradas.length === 0) {
    doc.setFont("Calibri", "normal");
    doc.text("Este pedido no tiene sellos.", 12, 18);
  }

  entradas.forEach(([provincia, tipos], index) => {
    if (index > 0) {
      doc.addPage();
    }

    let y = 18;
    y = pintarColegioPdf(doc, provincia, y);
    y = pintarTipoProvinciaPdf(doc, "SELLOS MANUAL", tipos.manual, y);
    y = pintarTipoProvinciaPdf(doc, "SELLOS AUTOMATICO", tipos.automatico, y);
  });

  doc.save(`pedido-${pedido.numero_pedido}-sellos-por-provincia.pdf`);
}

async function generarRecibisPdf(pedido, resumen) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  const entradas = Object.entries(resumen);

  if (entradas.length === 0) {
    doc.setFont("Calibri", "normal");
    doc.text("Este pedido no tiene recibis de sellos.", 12, 18);
  }

  entradas.forEach(([provincia, conteo], index) => {
    if (index > 0) {
      doc.addPage();
    }

    let y = 28;
    doc.setFont("Calibri", "bold");
    doc.setFontSize(16);
    doc.text("RECIBI DE SELLOS", 105, y, { align: "center" });
    y += 18;

    doc.setFontSize(12);
    doc.text(`Pedido: ${pedido.numero_pedido}`, 18, y);
    y += 10;
    doc.text(`Provincia: ${nombreProvincia(provincia)}`, 18, y);
    y += 16;

    doc.setFont("Calibri", "normal");
    doc.text(`Manual: ${conteo.manual} sellos`, 24, y);
    y += 9;
    doc.text(`Automatico: ${conteo.automatico} sellos`, 24, y);
    y += 9;
    doc.text(`Total: ${conteo.total} sellos`, 24, y);
    y += 28;

    doc.text("Recibido por:", 18, y);
    doc.line(50, y, 135, y);
    y += 16;
    doc.text("Fecha:", 18, y);
    doc.line(35, y, 95, y);
    y += 16;
    doc.text("Firma:", 18, y);
    doc.line(35, y, 135, y);
  });

  doc.save(`pedido-${pedido.numero_pedido}-recibis-por-provincia.pdf`);
}

function crearParrafoVacio() {
  return new Paragraph({
    children: [new TextRun("")],
    spacing: { after: 120 },
  });
}

function crearTituloWord(titulo) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: titulo,
        bold: true,
        size: 24,
        font: "Calibri",
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });
}

function crearColegioWord(provincia) {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    children: [
      new TextRun({
        text: `COLEGIO DE ${nombreProvincia(provincia)}`,
        bold: true,
        size: 24,
        font: "Calibri",
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });
}

function crearCabeceraColumnasWord() {
  return new Paragraph({
    tabStops: [
      { type: TabStopType.LEFT, position: 900 },
      { type: TabStopType.LEFT, position: 2500 },
      { type: TabStopType.LEFT, position: 4300 },
      { type: TabStopType.LEFT, position: 6200 },
    ],
    spacing: { after: 120 },
    children: [
      new TextRun({ text: "Tarea", bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: "\tNombre", bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: "\tApellido1", bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: "\tApellido2", bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: "\tNuevo numero", bold: true, size: 22, font: "Calibri" }),
    ],
  });
}

function crearFilaSelloWord(sello) {
  return new Paragraph({
    tabStops: [
      { type: TabStopType.LEFT, position: 900 },
      { type: TabStopType.LEFT, position: 2500 },
      { type: TabStopType.LEFT, position: 4300 },
      { type: TabStopType.LEFT, position: 6200 },
    ],
    spacing: { after: 80 },
    children: [
      new TextRun({ text: String(sello.tarea ?? ""), size: 22, font: "Calibri" }),
      new TextRun({ text: `\t${sello.nombre ?? ""}`, size: 22, font: "Calibri" }),
      new TextRun({ text: `\t${sello.apellido1 ?? ""}`, size: 22, font: "Calibri" }),
      new TextRun({ text: `\t${sello.apellido2 ?? ""}`, size: 22, font: "Calibri" }),
      new TextRun({ text: `\t${sello.codigo_sello ?? ""}`, size: 22, font: "Calibri" }),
    ],
  });
}

function crearTipoProvinciaWord(titulo, sellos) {
  if (!sellos.length) {
    return [];
  }

  return [
    crearTituloWord(titulo),
    crearCabeceraColumnasWord(),
    ...sellos.map((sello) => crearFilaSelloWord(sello)),
    crearParrafoVacio(),
  ];
}

function crearDocumentoWord(children) {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });
}

async function generarListadoWord(pedido, grupos) {
  const children = [];
  let primeraProvincia = true;

  Object.entries(grupos).forEach(([provincia, tipos]) => {
    if (!primeraProvincia) {
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    }

    children.push(crearColegioWord(provincia));
    children.push(...crearTipoProvinciaWord("SELLOS MANUAL", tipos.manual));
    children.push(...crearTipoProvinciaWord("SELLOS AUTOMATICO", tipos.automatico));
    primeraProvincia = false;
  });

  if (!children.length) {
    children.push(new Paragraph({ children: [new TextRun("Este pedido no tiene sellos.")] }));
  }

  const blob = await Packer.toBlob(crearDocumentoWord(children));

  saveAs(blob, `pedido-${pedido.numero_pedido}-sellos-por-provincia.docx`);
}

async function generarRecibisWord(pedido, resumen) {
  const children = [];
  let primeraProvincia = true;

  Object.entries(resumen).forEach(([provincia, conteo]) => {
    if (!primeraProvincia) {
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    }

    children.push(crearTituloWord("RECIBI DE SELLOS"));
    children.push(new Paragraph({
      spacing: { after: 180 },
      children: [new TextRun({ text: `Pedido: ${pedido.numero_pedido}`, bold: true, size: 24, font: "Calibri" })],
    }));
    children.push(new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: `Provincia: ${nombreProvincia(provincia)}`, bold: true, size: 24, font: "Calibri" })],
    }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Manual: ${conteo.manual} sellos`, size: 24, font: "Calibri" })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Automatico: ${conteo.automatico} sellos`, size: 24, font: "Calibri" })] }));
    children.push(new Paragraph({
      spacing: { after: 480 },
      children: [new TextRun({ text: `Total: ${conteo.total} sellos`, bold: true, size: 24, font: "Calibri" })],
    }));
    children.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Recibido por: ______________________________", size: 24, font: "Calibri" })] }));
    children.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Fecha: __________________", size: 24, font: "Calibri" })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Firma: ______________________________", size: 24, font: "Calibri" })] }));

    primeraProvincia = false;
  });

  if (!children.length) {
    children.push(new Paragraph({ children: [new TextRun("Este pedido no tiene recibis de sellos.")] }));
  }

  const blob = await Packer.toBlob(crearDocumentoWord(children));

  saveAs(blob, `pedido-${pedido.numero_pedido}-recibis-por-provincia.docx`);
}

export function extraerSellosDePedido(pedido) {
  return extraerSellosPedido(pedido);
}

export function obtenerOpcionesHojasPedido(pedido) {
  const grupos = agruparSellosPorProvinciaYTipo(pedido);

  return Object.entries(grupos).flatMap(([provincia, tipos]) => (
    ["manual", "automatico"]
      .filter((tipo) => tipos[tipo]?.length > 0)
      .map((tipo) => ({
        value: `${provincia}:${tipo}`,
        provincia,
        tipo,
        total: tipos[tipo].length,
        label: `${nombreProvincia(provincia)} - ${tipo === "manual" ? "Manual" : "Automatico"} (${tipos[tipo].length})`,
      }))
  ));
}

export async function generarPdfEmpresaPedido(pedido) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  const sellos = extraerSellosPedido(pedido).sort((a, b) => {
    const provinciaA = normalizarProvincia(a.prefijo_postal);
    const provinciaB = normalizarProvincia(b.prefijo_postal);

    return provinciaA.localeCompare(provinciaB)
      || String(a.tipo_sello ?? "").localeCompare(String(b.tipo_sello ?? ""))
      || String(a.tarea ?? "").localeCompare(String(b.tarea ?? ""));
  });

  pintarListadoSellosPdf(
    doc,
    "PEDIDO COMPLETO DE SELLOS",
    sellos,
    `Pedido ${pedido.numero_pedido} - documento para empresa`
  );

  doc.save(`pedido-${pedido.numero_pedido}-empresa-completo.pdf`);
}

export async function generarPdfHojaPedido(pedido, provincia, tipo) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  const tipoNormalizado = tipo === "automatico" ? "automatico" : "manual";
  const sellos = extraerSellosPedido(pedido).filter((sello) => (
    normalizarProvincia(sello.prefijo_postal) === normalizarProvincia(provincia)
    && (sello.tipo_sello === "automatico" ? "automatico" : "manual") === tipoNormalizado
  ));

  pintarListadoSellosPdf(
    doc,
    `${nombreProvincia(provincia)} - SELLOS ${tipoNormalizado.toUpperCase()}`,
    sellos,
    `Pedido ${pedido.numero_pedido}`
  );

  doc.save(`pedido-${pedido.numero_pedido}-${nombreProvincia(provincia).toLowerCase()}-${tipoNormalizado}.pdf`);
}

export async function generarPdfRepetidosPedido(pedido) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  // Obtener sellos repetidos REALES desde API
  const response = await getSellosRepetidosApi();

  // Solo sellos relacionados con este pedido
  const todosRepetidos = response.data.filter((sello) =>
    sello.historial?.some(
      (h) => String(h.pedido) === String(pedido.numero_pedido)
    )
  );

  // Agrupar por provincia
  const porProvincia = {};

  todosRepetidos.forEach((sello) => {
    const provincia = normalizarProvincia(
      sello.prefijo_postal
    );

    if (!porProvincia[provincia]) {
      porProvincia[provincia] = [];
    }

    porProvincia[provincia].push(sello);
  });

  const entradasOrdenadas =
    Object.entries(porProvincia).sort();

  let y = 18;

  // TITULO
  doc.setFont("Calibri", "bold");
  doc.setFontSize(13);

  doc.text("SELLOS REPETIDOS", 105, y, {
    align: "center",
  });

  subrayarTexto(
    doc,
    "SELLOS REPETIDOS",
    105,
    y,
    "center"
  );

  y += 10;

  doc.setFont("Calibri", "normal");
  doc.setFontSize(10);

  doc.text(`Pedido ${pedido.numero_pedido}`, 12, y);

  y += 10;

  // Sin resultados
  if (entradasOrdenadas.length === 0) {

    doc.text(
      "No hay sellos repetidos en este pedido.",
      12,
      y
    );

    doc.save(
      `pedido-${pedido.numero_pedido}-sellos-repetidos.pdf`
    );

    return;
  }

  // Provincias
  entradasOrdenadas.forEach(([provincia, sellos]) => {

    y = comprobarSaltoPagina(doc, y, 20);

    const tituloProvincia =
      `COLEGIO DE ${nombreProvincia(provincia)}`;

    doc.setFont("Calibri", "bold");
    doc.setFontSize(12);

    doc.text(tituloProvincia, 12, y);

    subrayarTexto(
      doc,
      tituloProvincia,
      12,
      y,
      "left"
    );

    y += 10;

    // Cabecera
    y = pintarCabeceraColumnasPdf(doc, y, false);

    // Sellos
    sellos.forEach((sello) => {

      y = comprobarSaltoPagina(doc, y, 18);

      // Pintar fila normal
      y = pintarSelloPdf(doc, sello, y, false);

      // Pintar trazabilidad
      if (sello.historial?.length) {

        doc.setFont("Calibri", "italic");
        doc.setFontSize(8);

        const trazabilidad = sello.historial
          .map(
            (h) => `P${h.pedido}/T${h.tarea}`
          )
          .join(" | ");

        doc.text(
          `Generado en: ${trazabilidad}`,
          18,
          y
        );

        y += 5;
      }

      y += 2;
    });

    y += 6;
  });

  doc.save(
    `pedido-${pedido.numero_pedido}-sellos-repetidos.pdf`
  );
}

export async function generarPdfPedido(pedido) {
  const grupos = agruparSellosPorProvinciaYTipo(pedido);
  const resumen = resumenRecibisPorProvincia(grupos);

  await generarListadoPdf(pedido, grupos);
  await generarListadoWord(pedido, grupos);
  await generarRecibisPdf(pedido, resumen);
  await generarRecibisWord(pedido, resumen);
}
