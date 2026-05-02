// Client-side PDF export of a calculation result.
//
// Uses pdf-lib so output is real text (selectable + searchable). English-only
// for now — Arabic shaping requires registering a Noto Naskh Arabic font via
// @pdf-lib/fontkit and a custom layout. That lands with B7 (i18n) so we have
// the AR strings to render.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { CalculationResult, InheritanceCase } from "$engine";
import { labelFor } from "$lib/features/questionnaire/heirLabels";

interface ExportOptions {
  inputCase: InheritanceCase;
  result: CalculationResult;
  generatedAt?: Date;
}

export async function buildResultPdf(opts: ExportOptions): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const margin = 48;
  let y = page.getHeight() - margin;

  function text(
    s: string,
    x: number,
    yPos: number,
    size: number,
    font: typeof helv = helv,
    color = rgb(0.07, 0.07, 0.07),
  ): void {
    page.drawText(s, { x, y: yPos, size, font, color });
  }

  function ruler(yPos: number) {
    page.drawLine({
      start: { x: margin, y: yPos },
      end: { x: page.getWidth() - margin, y: yPos },
      color: rgb(0.85, 0.85, 0.85),
      thickness: 0.6,
    });
  }

  // Header
  text("FairShare", margin, y, 22, helvBold);
  text("Islamic Inheritance Calculation", margin, y - 22, 11, helv, rgb(0.4, 0.4, 0.4));
  y -= 56;

  // Subject summary
  const subject =
    opts.inputCase.subjectGender === "male" ? "Male subject" : "Female subject";
  text(subject, margin, y, 14, helvBold);
  y -= 16;
  text(`School: ${opts.inputCase.madhhab}`, margin, y, 10, helv, rgb(0.4, 0.4, 0.4));
  y -= 12;
  text(
    `Generated: ${(opts.generatedAt ?? new Date()).toLocaleString("en")}`,
    margin,
    y,
    10,
    helv,
    rgb(0.4, 0.4, 0.4),
  );
  y -= 24;

  ruler(y);
  y -= 18;

  // Shares
  text("Shares", margin, y, 14, helvBold);
  y -= 18;

  for (const s of opts.result.shares) {
    const label = labelFor(s.heirType, s.count);
    text(label, margin, y, 11, helv);
    text(s.fraction.toString(), margin + 280, y, 11, helvBold);
    text(`${s.percentage.toFixed(2)}%`, margin + 360, y, 11, helv, rgb(0.4, 0.4, 0.4));
    y -= 16;
    if (y < margin + 120) break; // simple overflow guard
  }

  y -= 8;
  ruler(y);
  y -= 18;

  // Calculation flags
  text("Notes", margin, y, 12, helvBold);
  y -= 14;
  text(
    `Common denominator: ${opts.result.commonDenominator}`,
    margin,
    y,
    10,
    helv,
    rgb(0.3, 0.3, 0.3),
  );
  y -= 12;
  if (opts.result.adjustedDenominator) {
    text(
      `Adjusted denominator: ${opts.result.adjustedDenominator}`,
      margin,
      y,
      10,
      helv,
      rgb(0.3, 0.3, 0.3),
    );
    y -= 12;
  }
  if (opts.result.appliedAwl) {
    text("Awl applied (proportional reduction).", margin, y, 10, helv, rgb(0.3, 0.3, 0.3));
    y -= 12;
  }
  if (opts.result.appliedRadd) {
    text(
      "Radd applied (surplus redistribution).",
      margin,
      y,
      10,
      helv,
      rgb(0.3, 0.3, 0.3),
    );
    y -= 12;
  }
  if (opts.result.appliedSpecialCase) {
    text(
      `Special case: ${opts.result.appliedSpecialCase}`,
      margin,
      y,
      10,
      helv,
      rgb(0.3, 0.3, 0.3),
    );
    y -= 12;
  }

  y -= 12;

  // Footer
  text(
    "Educational use only — please consult a qualified mufti before acting on any calculation.",
    margin,
    margin,
    9,
    helvItalic,
    rgb(0.5, 0.5, 0.5),
  );
  text("https://fairshare.guigalabs.com", margin, margin - 12, 9, helv, rgb(0.5, 0.5, 0.5));

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
