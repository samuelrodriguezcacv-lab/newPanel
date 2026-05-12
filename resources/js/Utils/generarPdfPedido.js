import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopType,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";

import calibriRegularUrl from "../../fonts/calibri-regular.ttf?url";
import calibriBoldUrl from "../../fonts/calibri-bold.ttf?url";

const PROVINCIAS = {
  "04": "ALMERÍA",
  "11": "CÁDIZ",
  "14": "CÓRDOBA",
  "18": "GRANADA",
  "21": "HUELVA",
  "23": "JAÉN",
  "29": "MÁLAGA",
  "41": "SEVILLA",
};

async function convertirFuenteABase64(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar la fuente: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

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

function agruparSellosPorTipoYProvincia(pedido) {
  const manuales = {};
  const automaticos = {};

  pedido.tareas?.forEach((tarea) => {
    tarea.sellos?.forEach((sello) => {
      const provincia = normalizarProvincia(sello.prefijo_postal);

      const destino =
        sello.tipo_sello === "manual" ? manuales : automaticos;

      if (!destino[provincia]) {
        destino[provincia] = [];
      }

      destino[provincia].push({
        ...sello,
        tarea: tarea.Tarea,
      });
    });
  });

  return {
    manuales: Object.fromEntries(Object.entries(manuales).sort()),
    automaticos: Object.fromEntries(Object.entries(automaticos).sort()),
  };
}

/* =========================
   GENERADOR PDF
========================= */

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

function pintarTituloTipoSelloPdf(doc, titulo, y) {
  doc.setTextColor(0, 0, 0);
  doc.setFont("Calibri", "bold");
  doc.setFontSize(12);

  const xCentro = 105;

  doc.text(titulo, xCentro, y, { align: "center" });
  subrayarTexto(doc, titulo, xCentro, y, "center");

  return y + 16;
}

function pintarColegioPdf(doc, provincia, y) {
  const nombreProvincia = PROVINCIAS[provincia] ?? provincia;
  const titulo = `COLEGIO DE ${nombreProvincia}`;

  doc.setTextColor(0, 0, 0);
  doc.setFont("Calibri", "bold");
  doc.setFontSize(12);

  doc.text(titulo, 12, y);
  subrayarTexto(doc, titulo, 12, y, "left");

  return y + 12;
}

function pintarCabeceraColumnasPdf(doc, y) {
  doc.setFont("Calibri", "bold");
  doc.setFontSize(12);

  doc.text("Nombre", 14, y);
  doc.text("Apellido1", 52, y);
  doc.text("Apellido2", 92, y);
  doc.text("Nuevo número", 145, y);

  return y + 7;
}

function pintarSelloPdf(doc, sello, y) {
  doc.setFont("Calibri", "normal");
  doc.setFontSize(12);

  const nombre = sello.nombre ?? "";
  const apellido1 = sello.apellido1 ?? "";
  const apellido2 = sello.apellido2 ?? "";

  /*
    Si "Nuevo número" no corresponde a codigo_sello,
    cambia esta línea por el campo correcto.
  */
  const nuevoNumero = sello.codigo_sello ?? "";

  doc.text(String(nombre), 14, y);
  doc.text(String(apellido1), 52, y);
  doc.text(String(apellido2), 92, y);
  doc.text(String(nuevoNumero), 145, y);

  return y + 6;
}

function pintarSeccionPdf(doc, titulo, grupos, y) {
  if (Object.keys(grupos).length === 0) {
    return y;
  }

  y = pintarTituloTipoSelloPdf(doc, titulo, y);

  Object.entries(grupos).forEach(([provincia, sellos]) => {
    y = comprobarSaltoPagina(doc, y, 40);

    y = pintarColegioPdf(doc, provincia, y);
    y = pintarCabeceraColumnasPdf(doc, y);

    sellos.forEach((sello) => {
      y = comprobarSaltoPagina(doc, y, 10);
      y = pintarSelloPdf(doc, sello, y);
    });

    y += 10;
  });

  return y;
}

async function generarPdf(pedido, manuales, automaticos) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await registrarCalibri(doc);

  let y = 18;

  if (Object.keys(manuales).length > 0) {
    y = pintarSeccionPdf(doc, "SELLOS MANUAL", manuales, y);
  }

  if (
    Object.keys(manuales).length > 0 &&
    Object.keys(automaticos).length > 0
  ) {
    doc.addPage();
    y = 18;
  }

  if (Object.keys(automaticos).length > 0) {
    y = pintarSeccionPdf(doc, "SELLOS AUTOMÁTICO", automaticos, y);
  }

  doc.save(`pedido-${pedido.numero_pedido}.pdf`);
}

/* =========================
   GENERADOR WORD
========================= */

function crearParrafoVacio() {
  return new Paragraph({
    children: [new TextRun("")],
    spacing: {
      after: 120,
    },
  });
}

function crearTituloWord(titulo) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      after: 360,
    },
    children: [
      new TextRun({
        text: titulo,
        bold: true,
        size: 24,
        font: "Calibri",
        underline: {
          type: UnderlineType.SINGLE,
        },
      }),
    ],
  });
}

function crearColegioWord(provincia) {
  const nombreProvincia = PROVINCIAS[provincia] ?? provincia;

  return new Paragraph({
    spacing: {
      before: 240,
      after: 240,
    },
    children: [
      new TextRun({
        text: `COLEGIO DE ${nombreProvincia}`,
        bold: true,
        size: 24,
        font: "Calibri",
        underline: {
          type: UnderlineType.SINGLE,
        },
      }),
    ],
  });
}

function crearCabeceraColumnasWord() {
  return new Paragraph({
    tabStops: [
      { type: TabStopType.LEFT, position: 1800 },
      { type: TabStopType.LEFT, position: 3600 },
      { type: TabStopType.LEFT, position: 5800 },
    ],
    spacing: {
      after: 120,
    },
    children: [
      new TextRun({
        text: "Nombre",
        bold: true,
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: "\tApellido1",
        bold: true,
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: "\tApellido2",
        bold: true,
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: "\tNuevo número",
        bold: true,
        size: 24,
        font: "Calibri",
      }),
    ],
  });
}

function crearFilaSelloWord(sello) {
  const nombre = sello.nombre ?? "";
  const apellido1 = sello.apellido1 ?? "";
  const apellido2 = sello.apellido2 ?? "";

  /*
    Si "Nuevo número" no corresponde a codigo_sello,
    cambia esta línea por el campo correcto.
  */
  const nuevoNumero = sello.codigo_sello ?? "";

  return new Paragraph({
    tabStops: [
      { type: TabStopType.LEFT, position: 1800 },
      { type: TabStopType.LEFT, position: 3600 },
      { type: TabStopType.LEFT, position: 5800 },
    ],
    spacing: {
      after: 80,
    },
    children: [
      new TextRun({
        text: String(nombre),
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: `\t${apellido1}`,
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: `\t${apellido2}`,
        size: 24,
        font: "Calibri",
      }),
      new TextRun({
        text: `\t${nuevoNumero}`,
        size: 24,
        font: "Calibri",
      }),
    ],
  });
}

function crearSeccionWord(titulo, grupos) {
  const children = [];

  if (Object.keys(grupos).length === 0) {
    return children;
  }

  children.push(crearTituloWord(titulo));

  Object.entries(grupos).forEach(([provincia, sellos]) => {
    children.push(crearColegioWord(provincia));
    children.push(crearCabeceraColumnasWord());

    sellos.forEach((sello) => {
      children.push(crearFilaSelloWord(sello));
    });

    children.push(crearParrafoVacio());
  });

  return children;
}

async function generarWord(pedido, manuales, automaticos) {
  const children = [];

  if (Object.keys(manuales).length > 0) {
    children.push(...crearSeccionWord("SELLOS MANUAL", manuales));
  }

  if (
    Object.keys(manuales).length > 0 &&
    Object.keys(automaticos).length > 0
  ) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        children: [],
      })
    );
  }

  if (Object.keys(automaticos).length > 0) {
    children.push(...crearSeccionWord("SELLOS AUTOMÁTICO", automaticos));
  }

  const documento = new Document({
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

  const blob = await Packer.toBlob(documento);

  saveAs(blob, `pedido-${pedido.numero_pedido}.docx`);
}

/* =========================
   FUNCIÓN PRINCIPAL
========================= */

export async function generarPdfPedido(pedido) {
  const { manuales, automaticos } = agruparSellosPorTipoYProvincia(pedido);

  await generarPdf(pedido, manuales, automaticos);

  await generarWord(pedido, manuales, automaticos);
}