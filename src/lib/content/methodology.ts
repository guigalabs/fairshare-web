// Catalog of methodology articles. Drives both the /methodology hub and the
// dynamic /methodology/[group]/[topic] route. Article bodies live in
// methodology-bodies.ts, keyed by group/slug and locale.

import { i18n, type Locale } from "$lib/i18n/index.svelte";

export type MethodologyGroup = "madhhab" | "rules" | "special-cases";

export interface MethodologyEntry {
  slug: string;
  group: MethodologyGroup;
  /** Display title (used in cards, breadcrumbs, page H1, og:title). */
  title: Record<Locale, string>;
  /** ~150-char meta description. */
  description: Record<Locale, string>;
  /** Approximate read time in minutes. */
  readingMinutes: number;
}

export const METHODOLOGY: MethodologyEntry[] = [
  {
    group: "madhhab",
    slug: "general",
    title: {
      en: "The General (majority Sunni) opinion",
      ar: "الرأي العام (جمهور أهل السنة)",
    },
    description: {
      en: "The default ruleset: where the four Sunni schools agree, the General view follows them. A safe starting point for any calculation.",
      ar: "القاعدة الافتراضية: حيث تتّفق المذاهب السنية الأربعة، يتبعها الرأي العام. نقطة بداية آمنة لأي حساب.",
    },
    readingMinutes: 4,
  },
  {
    group: "madhhab",
    slug: "hanafi",
    title: { en: "Hanafi inheritance", ar: "الميراث في المذهب الحنفي" },
    description: {
      en: "The largest Sunni school. Stricter blocking around the grandfather and a distinctive ruling on the Musharakah case.",
      ar: "أكبر المذاهب السنية. حجب أشدّ حول الجد، ورأي مميّز في مسألة المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "maliki",
    title: { en: "Maliki inheritance", ar: "الميراث في المذهب المالكي" },
    description: {
      en: "Dominant in North and West Africa. Historically reluctant to apply Radd; agrees with Shafi'i on the shared-sibling case.",
      ar: "السائد في شمال وغرب أفريقيا. تاريخيًا متحفّظ في تطبيق الرَّد، ويوافق الشافعي في مسألة المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "shafii",
    title: { en: "Shafi'i inheritance", ar: "الميراث في المذهب الشافعي" },
    description: {
      en: "Egypt, the Levant, and Southeast Asia. Distinctive on the grandfather-with-siblings case and applies the Musharakah ruling.",
      ar: "مصر والشام وجنوب شرق آسيا. متميّز في مسألة الجد مع الإخوة، ويُطبّق المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "hanbali",
    title: { en: "Hanbali inheritance", ar: "الميراث في المذهب الحنبلي" },
    description: {
      en: "The Arabian peninsula. Agrees with Shafi'i and Maliki against the Hanafi position on most contested cases.",
      ar: "شبه الجزيرة العربية. يوافق الشافعي والمالكي في مقابل الحنفي في معظم المسائل المختلَف فيها.",
    },
    readingMinutes: 5,
  },

  {
    group: "rules",
    slug: "fixed-shares",
    title: { en: "Fixed shares (الفروض)", ar: "الفروض المقدّرة" },
    description: {
      en: "The six prescribed Quranic fractions (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) and which heirs receive which.",
      ar: "الكسور الستة المنصوص عليها قرآنيًا (1/2، 1/4، 1/8، 2/3، 1/3، 1/6) ومن يستحقّ كلًّا منها.",
    },
    readingMinutes: 6,
  },
  {
    group: "rules",
    slug: "blocking",
    title: { en: "Blocking (الحجب)", ar: "الحجب" },
    description: {
      en: "How a closer heir prevents a more distant one from inheriting. Hajb is the most common reason an expected heir gets nothing.",
      ar: "كيف يمنع الوارث الأقرب من هو أبعد منه من الإرث. الحجب أكثر الأسباب شيوعًا في حرمان وارث متوقَّع.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "residuary",
    title: { en: "Residuary heirs (العصبة)", ar: "العصبة" },
    description: {
      en: "Asabah heirs take whatever remains after fixed shares are paid. Three sub-types: by self, by another, with another.",
      ar: "العصبة يأخذون ما بقي بعد أصحاب الفروض. ثلاثة أنواع: بالنفس، بالغير، مع الغير.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "awl",
    title: { en: "Awl (العول)", ar: "العَوْل" },
    description: {
      en: "When prescribed shares total more than the estate, Awl scales every share down proportionally so the math fits.",
      ar: "حين تتجاوز جملة الفروض التركةَ، يُخفَّض كل نصيب بالنسبة بالعَوْل حتى يستقيم الحساب.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "radd",
    title: { en: "Radd (الرد)", ar: "الرَّد" },
    description: {
      en: "When prescribed shares total less than the estate and there's no residuary, Radd returns the surplus to non-spouse heirs.",
      ar: "حين تنقص جملة الفروض عن التركة ولا عصبة، يردّ الفائض على الورثة من غير الزوجين بالرَّد.",
    },
    readingMinutes: 5,
  },

  {
    group: "special-cases",
    slug: "umariatan",
    title: { en: "Umariatan (العمريتان)", ar: "العمريتان" },
    description: {
      en: "Two named cases under Caliph Umar: spouse + mother + father, where the mother takes 1/3 of the remainder, not 1/3 of the total.",
      ar: "مسألتان مشهورتان في عهد عمر رضي الله عنه: زوج/زوجة + أم + أب، تأخذ فيهما الأم ثلث الباقي لا ثلث الجميع.",
    },
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "musharakah",
    title: { en: "Musharakah (المشتركة)", ar: "المشتركة" },
    description: {
      en: "Full siblings join maternal half-siblings in their 1/3 share when the estate is exhausted. Maliki and Shafi'i apply it; Hanafi does not.",
      ar: "يشارك الإخوة الأشقاء الإخوةَ لأم في الثلث عند استغراق التركة. يطبّقها المالكي والشافعي، ولا يطبّقها الحنفي.",
    },
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "grandfather-with-siblings",
    title: { en: "Grandfather with siblings (الجد مع الإخوة)", ar: "الجد مع الإخوة" },
    description: {
      en: "When a grandfather inherits alongside the deceased's siblings, does he block them (Hanafi) or share with them (Maliki/Shafi'i/Hanbali)?",
      ar: "حين يرث الجد مع إخوة المتوفى، هل يحجبهم (الحنفي) أم يقاسمهم (المالكي/الشافعي/الحنبلي)؟",
    },
    readingMinutes: 6,
  },
];

export function findEntry(group: string, slug: string): MethodologyEntry | undefined {
  return METHODOLOGY.find((e) => e.group === group && e.slug === slug);
}

export function entriesByGroup(group: MethodologyGroup): MethodologyEntry[] {
  return METHODOLOGY.filter((e) => e.group === group);
}

/** Localised title for a methodology entry. Reads i18n.current reactively. */
export function entryTitle(entry: MethodologyEntry): string {
  return entry.title[i18n.current] ?? entry.title.en;
}

/** Localised description for a methodology entry. */
export function entryDescription(entry: MethodologyEntry): string {
  return entry.description[i18n.current] ?? entry.description.en;
}

const GROUP_TITLES: Record<MethodologyGroup, Record<Locale, string>> = {
  madhhab: { en: "Schools of thought (madhabs)", ar: "المذاهب الفقهية" },
  rules: { en: "Core rules", ar: "القواعد الأساسية" },
  "special-cases": { en: "Special cases", ar: "الحالات الخاصة" },
};

export function groupTitle(group: MethodologyGroup): string {
  return GROUP_TITLES[group][i18n.current] ?? GROUP_TITLES[group].en;
}
