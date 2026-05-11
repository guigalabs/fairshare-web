// Client-side PDF export of a calculation result.
//
// Captures the off-screen <PrintableResult> one-pager via html-to-image, then
// embeds the PNG into a single A4 portrait page using pdf-lib. This keeps the
// PDF visually identical to the on-screen design (header, share table, family
// tree, plain-language summary, footer disclaimer) without re-implementing the
// layout in pdf-lib primitives.

import { PDFDocument } from "pdf-lib";
import { toPng } from "html-to-image";
import type { CalculationResult, InheritanceCase } from "$engine";

interface ExportOptions {
  inputCase: InheritanceCase;
  result: CalculationResult;
}

// A4 portrait at 72dpi (the PDF coordinate space).
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// PrintableResult is sized to 794×1123 (A4 at 96dpi). Capture at 2× density
// for sharper text on retina viewers, then scale to fit the PDF page.
const CAPTURE_PIXEL_RATIO = 2;

export async function buildResultPdf(_opts: ExportOptions): Promise<Blob> {
  const fixture = document.querySelector<HTMLElement>('[data-pdf-root="result"]');
  if (!fixture) {
    throw new Error("PDF fixture element not found");
  }

  const dataUrl = await toPng(fixture, {
    pixelRatio: CAPTURE_PIXEL_RATIO,
    backgroundColor: "#ffffff",
    cacheBust: true,
  });

  const pngBytes = await (await fetch(dataUrl)).arrayBuffer();

  const doc = await PDFDocument.create();
  const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  const png = await doc.embedPng(pngBytes);

  // Scale the captured image to fit A4 while preserving aspect ratio. The
  // sheet is taller than A4 (1123 > 842 at the same width); scale to fit
  // height so nothing is clipped.
  const fitScale = Math.min(A4_WIDTH / png.width, A4_HEIGHT / png.height);
  const drawWidth = png.width * fitScale;
  const drawHeight = png.height * fitScale;
  const x = (A4_WIDTH - drawWidth) / 2;
  const y = (A4_HEIGHT - drawHeight) / 2;
  page.drawImage(png, { x, y, width: drawWidth, height: drawHeight });

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
