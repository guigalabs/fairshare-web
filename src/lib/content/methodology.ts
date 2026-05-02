// Catalog of methodology articles. Drives both the /methodology hub and the
// dynamic /methodology/[group]/[topic] route. Page bodies live in dedicated
// .svelte files keyed by slug — see src/routes/methodology/[group]/[topic]/.

export type MethodologyGroup = "madhhab" | "rules" | "special-cases";

export interface MethodologyEntry {
  slug: string;
  group: MethodologyGroup;
  /** Display title (used in cards, breadcrumbs, page H1, og:title). */
  title: string;
  /** ~150-char meta description. */
  description: string;
  /** Approximate read time in minutes. */
  readingMinutes: number;
}

export const METHODOLOGY: MethodologyEntry[] = [
  {
    group: "madhhab",
    slug: "general",
    title: "The General (majority Sunni) opinion",
    description:
      "The default ruleset: where the four Sunni schools agree, the General view follows them. A safe starting point for any calculation.",
    readingMinutes: 4,
  },
  {
    group: "madhhab",
    slug: "hanafi",
    title: "Hanafi inheritance",
    description:
      "The largest Sunni school. Stricter blocking around the grandfather and a distinctive ruling on the Musharakah case.",
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "maliki",
    title: "Maliki inheritance",
    description:
      "Dominant in North and West Africa. Historically reluctant to apply Radd; agrees with Shafi'i on the shared-sibling case.",
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "shafii",
    title: "Shafi'i inheritance",
    description:
      "Egypt, the Levant, and Southeast Asia. Distinctive on the grandfather-with-siblings case and applies the Musharakah ruling.",
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "hanbali",
    title: "Hanbali inheritance",
    description:
      "The Arabian peninsula. Agrees with Shafi'i and Maliki against the Hanafi position on most contested cases.",
    readingMinutes: 5,
  },

  {
    group: "rules",
    slug: "fixed-shares",
    title: "Fixed shares (الفروض)",
    description:
      "The six prescribed Quranic fractions (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) and which heirs receive which.",
    readingMinutes: 6,
  },
  {
    group: "rules",
    slug: "blocking",
    title: "Blocking (الحجب)",
    description:
      "How a closer heir prevents a more distant one from inheriting. Hajb is the most common reason an expected heir gets nothing.",
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "residuary",
    title: "Residuary heirs (العصبة)",
    description:
      "Asabah heirs take whatever remains after fixed shares are paid. Three sub-types: by self, by another, with another.",
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "awl",
    title: "Awl (العول)",
    description:
      "When prescribed shares total more than the estate, Awl scales every share down proportionally so the math fits.",
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "radd",
    title: "Radd (الرد)",
    description:
      "When prescribed shares total less than the estate and there's no residuary, Radd returns the surplus to non-spouse heirs.",
    readingMinutes: 5,
  },

  {
    group: "special-cases",
    slug: "umariatan",
    title: "Umariatan (العمريتان)",
    description:
      "Two named cases under Caliph Umar: spouse + mother + father, where the mother takes 1/3 of the remainder, not 1/3 of the total.",
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "musharakah",
    title: "Musharakah (المشتركة)",
    description:
      "Full siblings join maternal half-siblings in their 1/3 share when the estate is exhausted. Maliki and Shafi'i apply it; Hanafi does not.",
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "grandfather-with-siblings",
    title: "Grandfather with siblings (الجد مع الإخوة)",
    description:
      "When a grandfather inherits alongside the deceased's siblings, does he block them (Hanafi) or share with them (Maliki/Shafi'i/Hanbali)?",
    readingMinutes: 6,
  },
];

export function findEntry(group: string, slug: string): MethodologyEntry | undefined {
  return METHODOLOGY.find((e) => e.group === group && e.slug === slug);
}

export function entriesByGroup(group: MethodologyGroup): MethodologyEntry[] {
  return METHODOLOGY.filter((e) => e.group === group);
}

export function groupTitle(group: MethodologyGroup): string {
  switch (group) {
    case "madhhab":
      return "Schools of thought (madhabs)";
    case "rules":
      return "Core rules";
    case "special-cases":
      return "Special cases";
  }
}
