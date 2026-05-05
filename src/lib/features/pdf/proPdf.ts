import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import type { CalculationResult, HeirEntry } from "$engine";
import { labelFor } from "$lib/features/questionnaire/heirLabels";
import { formatCents, perHeirAmount, type Cents } from "$lib/money";

export interface FirmBranding {
  letterhead?: string | null;
  customDisclaimerEn?: string | null;
  customDisclaimerAr?: string | null;
  primaryColor?: string | null;
  signatureBlock?: string | null;
  logoBytes?: Uint8Array | null;
  logoMimeType?: string | null;
}

export interface PractitionerCaseInput {
  deceasedName: string;
  dateOfDeath?: string | null;
  placeOfDeath?: string | null;
  jurisdiction?: string | null;
  deceasedIdentifier?: string | null;
  madhhab: string;
  subjectGender: string;
  currency: string;
  grossEstate: Cents;
  funeralExpenses: Cents;
  debts: { creditor: string; amount: string; note?: string }[];
  bequests: { beneficiary: string; amount: string; note?: string }[];
  specialFlags: Partial<{
    mafqud: string;
    haml: string;
    hadm: string;
    apostate: string;
    qatil: string;
    nonMuslimHeir: string;
  }>;
  advisoryNotes?: string | null;
  heirs: HeirEntry[];
}

export interface PractitionerPdfInput {
  case: PractitionerCaseInput;
  result: CalculationResult;
  net: Cents;
  debtsTotal: Cents;
  bequestsTotal: Cents;
  branding?: FirmBranding;
  generatedAt?: Date;
}

const MARGIN = 48;
const LINE = 14;
const SECTION_GAP = 18;

function parseHexColor(hex: string | null | undefined) {
  if (!hex) return rgb(0.06, 0.06, 0.06);
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return rgb(0.06, 0.06, 0.06);
  const n = parseInt(m[1], 16);
  return rgb(((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255);
}

function flagLabel(key: string): string {
  switch (key) {
    case "mafqud":
      return "Missing heir (mafqud)";
    case "haml":
      return "Pregnant widow (haml)";
    case "hadm":
      return "Simultaneous death (hadm)";
    case "apostate":
      return "Apostate heir";
    case "qatil":
      return "Heir disqualified (qatil)";
    case "nonMuslimHeir":
      return "Non-Muslim heir";
    default:
      return key;
  }
}

interface RenderState {
  page: PDFPage;
  doc: PDFDocument;
  y: number;
  helv: PDFFont;
  helvBold: PDFFont;
  helvItalic: PDFFont;
  width: number;
  primary: ReturnType<typeof rgb>;
}

function newPage(s: RenderState): void {
  s.page = s.doc.addPage([595, 842]);
  s.y = s.page.getHeight() - MARGIN;
}

function ensureRoom(s: RenderState, needed: number): void {
  if (s.y - needed < MARGIN + 64) newPage(s);
}

function drawText(
  s: RenderState,
  txt: string,
  size: number,
  font: PDFFont,
  color = rgb(0.06, 0.06, 0.06),
  indent = 0,
): void {
  s.page.drawText(txt, { x: MARGIN + indent, y: s.y, size, font, color });
}

function drawWrap(s: RenderState, txt: string, size: number, font: PDFFont, indent = 0): void {
  const max = s.width - MARGIN * 2 - indent;
  const words = txt.split(/\s+/);
  let line = "";
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, size) > max && line) {
      ensureRoom(s, LINE);
      drawText(s, line, size, font, rgb(0.18, 0.18, 0.18), indent);
      s.y -= LINE;
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) {
    ensureRoom(s, LINE);
    drawText(s, line, size, font, rgb(0.18, 0.18, 0.18), indent);
    s.y -= LINE;
  }
}

function ruler(s: RenderState): void {
  s.page.drawLine({
    start: { x: MARGIN, y: s.y },
    end: { x: s.width - MARGIN, y: s.y },
    color: rgb(0.85, 0.85, 0.85),
    thickness: 0.6,
  });
}

function sectionTitle(s: RenderState, title: string): void {
  ensureRoom(s, LINE * 2);
  s.y -= 8;
  drawText(s, title, 12, s.helvBold, s.primary);
  s.y -= 4;
  ruler(s);
  s.y -= LINE;
}

async function renderHeader(s: RenderState, input: PractitionerPdfInput): Promise<void> {
  const branding = input.branding;
  if (branding?.logoBytes && branding.logoMimeType) {
    try {
      const img =
        branding.logoMimeType === "image/jpeg"
          ? await s.doc.embedJpg(branding.logoBytes)
          : await s.doc.embedPng(branding.logoBytes);
      const dims = img.scale(48 / img.height);
      s.page.drawImage(img, {
        x: MARGIN,
        y: s.y - dims.height,
        width: dims.width,
        height: dims.height,
      });
      s.y -= dims.height;
    } catch {
      // ignore: render without logo if the bytes don't match the declared mime
    }
  }

  if (branding?.letterhead) {
    drawText(s, branding.letterhead, 14, s.helvBold, s.primary);
    s.y -= LINE;
  } else {
    drawText(s, "FairShare Pro", 14, s.helvBold, s.primary);
    s.y -= LINE;
  }
  drawText(s, "Islamic inheritance distribution memo", 10, s.helvItalic, rgb(0.4, 0.4, 0.4));
  s.y -= LINE * 1.5;
}

function renderDeceasedBlock(s: RenderState, c: PractitionerCaseInput): void {
  sectionTitle(s, "Deceased");
  drawText(s, c.deceasedName, 12, s.helvBold);
  s.y -= LINE;

  const meta: string[] = [];
  if (c.dateOfDeath) meta.push(`DOD: ${c.dateOfDeath}`);
  if (c.placeOfDeath) meta.push(c.placeOfDeath);
  if (c.jurisdiction) meta.push(c.jurisdiction);
  if (c.deceasedIdentifier) meta.push(`ID: ${c.deceasedIdentifier}`);
  if (meta.length) {
    drawText(s, meta.join(" · "), 10, s.helv, rgb(0.4, 0.4, 0.4));
    s.y -= LINE;
  }
  drawText(
    s,
    `Madhhab: ${c.madhhab} · Subject gender: ${c.subjectGender}`,
    10,
    s.helv,
    rgb(0.4, 0.4, 0.4),
  );
  s.y -= SECTION_GAP;
}

function renderEstateBlock(s: RenderState, input: PractitionerPdfInput): void {
  const c = input.case;
  if (input.case.grossEstate === 0n) return;
  sectionTitle(s, "Estate breakdown");

  const rows: { label: string; value: string }[] = [
    { label: "Gross estate", value: `${c.currency} ${formatCents(input.case.grossEstate)}` },
    {
      label: "Funeral expenses",
      value: `- ${c.currency} ${formatCents(input.case.funeralExpenses)}`,
    },
    {
      label: `Debts (${input.case.debts.length})`,
      value: `- ${c.currency} ${formatCents(input.debtsTotal)}`,
    },
    {
      label: `Bequests (${input.case.bequests.length})`,
      value: `- ${c.currency} ${formatCents(input.bequestsTotal)}`,
    },
  ];
  for (const r of rows) {
    ensureRoom(s, LINE);
    drawText(s, r.label, 10, s.helv);
    drawText(s, r.value, 10, s.helv, rgb(0.06, 0.06, 0.06), 320);
    s.y -= LINE;
  }
  ensureRoom(s, LINE + 4);
  s.y -= 2;
  ruler(s);
  s.y -= LINE;
  drawText(s, "Net estate", 11, s.helvBold);
  drawText(
    s,
    `${c.currency} ${formatCents(input.net)}`,
    11,
    s.helvBold,
    rgb(0.06, 0.06, 0.06),
    320,
  );
  s.y -= SECTION_GAP;
}

function renderSharesBlock(s: RenderState, input: PractitionerPdfInput): void {
  sectionTitle(s, "Distribution");
  ensureRoom(s, LINE);
  drawText(s, "Heir", 9, s.helvBold, rgb(0.4, 0.4, 0.4));
  drawText(s, "Share", 9, s.helvBold, rgb(0.4, 0.4, 0.4), 240);
  if (input.net > 0n) drawText(s, "Amount", 9, s.helvBold, rgb(0.4, 0.4, 0.4), 360);
  s.y -= LINE;

  const heirsByType = new Map<string, HeirEntry>();
  for (const h of input.case.heirs) heirsByType.set(h.type, h);

  for (const share of input.result.shares) {
    ensureRoom(s, LINE);
    const entry = heirsByType.get(share.heirType);
    const persons = (entry as { persons?: { name?: string }[] } | undefined)?.persons;
    let label: string;
    if (persons && persons.length > 0) {
      label = `${labelFor(share.heirType, share.count)}: ${persons
        .map((p) => p.name)
        .filter(Boolean)
        .join(", ")}`;
    } else {
      label = labelFor(share.heirType, share.count);
    }
    drawText(s, label, 10, s.helv);
    drawText(s, share.fraction.toString(), 10, s.helvBold, rgb(0.06, 0.06, 0.06), 240);
    if (input.net > 0n) {
      drawText(
        s,
        `${input.case.currency} ${formatCents(perHeirAmount(input.net, share.fraction))}`,
        10,
        s.helv,
        rgb(0.06, 0.06, 0.06),
        360,
      );
    }
    s.y -= LINE;
  }
  s.y -= SECTION_GAP - LINE;
}

function renderSpecialFlags(s: RenderState, c: PractitionerCaseInput): void {
  const entries = Object.entries(c.specialFlags).filter(([, v]) => v && v.trim() !== "");
  if (entries.length === 0) return;
  sectionTitle(s, "Special-case notes");
  for (const [key, value] of entries) {
    ensureRoom(s, LINE * 2);
    drawText(s, flagLabel(key), 10, s.helvBold);
    s.y -= LINE;
    drawWrap(s, value as string, 10, s.helv, 12);
    s.y -= 4;
  }
  s.y -= SECTION_GAP - LINE;
}

function renderAdvisoryNotes(s: RenderState, c: PractitionerCaseInput): void {
  if (!c.advisoryNotes?.trim()) return;
  sectionTitle(s, "Advisory notes");
  drawWrap(s, c.advisoryNotes, 10, s.helv);
  s.y -= 8;
}

function renderSignature(s: RenderState, branding?: FirmBranding): void {
  const block = branding?.signatureBlock;
  if (!block?.trim()) return;
  sectionTitle(s, "Signed");
  for (const line of block.split("\n")) {
    ensureRoom(s, LINE);
    drawText(s, line, 10, s.helv);
    s.y -= LINE;
  }
  s.y -= 4;
}

function renderFooter(s: RenderState, input: PractitionerPdfInput): void {
  const branding = input.branding;
  const disclaimerEn =
    branding?.customDisclaimerEn ??
    "Educational use only. Please consult a qualified mufti before acting on any distribution.";
  const generated = (input.generatedAt ?? new Date()).toLocaleString("en");
  s.page.drawText(disclaimerEn, {
    x: MARGIN,
    y: MARGIN + 20,
    size: 8,
    font: s.helvItalic,
    color: rgb(0.4, 0.4, 0.4),
    maxWidth: s.width - MARGIN * 2,
  });
  s.page.drawText(`Generated ${generated} · fairshare.guigalabs.com`, {
    x: MARGIN,
    y: MARGIN + 8,
    size: 8,
    font: s.helv,
    color: rgb(0.5, 0.5, 0.5),
  });
}

export async function buildPractitionerPdf(input: PractitionerPdfInput): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const state: RenderState = {
    page,
    doc,
    y: page.getHeight() - MARGIN,
    helv,
    helvBold,
    helvItalic,
    width: page.getWidth(),
    primary: parseHexColor(input.branding?.primaryColor),
  };

  await renderHeader(state, input);
  renderDeceasedBlock(state, input.case);
  renderEstateBlock(state, input);
  renderSharesBlock(state, input);
  renderSpecialFlags(state, input.case);
  renderAdvisoryNotes(state, input.case);
  renderSignature(state, input.branding);
  renderFooter(state, input);

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
