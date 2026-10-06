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
  /** Meta description, about 150 characters. */
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
      en: "Follows the rulings the four Sunni schools agree on, and the majority view where they split. Use it if you don't follow one school in particular.",
      ar: "يأخذ بما اتفقت عليه المذاهب السنية الأربعة، وبقول الجمهور فيما اختلفت فيه. اختره إن لم تكن تلتزم مذهبًا بعينه.",
    },
    readingMinutes: 4,
  },
  {
    group: "madhhab",
    slug: "hanafi",
    title: { en: "Hanafi inheritance", ar: "الميراث في المذهب الحنفي" },
    description: {
      en: "The largest Sunni school. The grandfather blocks the siblings outright, and full siblings get nothing in the Musharakah case.",
      ar: "أكبر المذاهب السنية. يحجب فيه الجدُّ الإخوةَ حجبًا تامًا، ولا يأخذ الإخوة الأشقاء شيئًا في مسألة المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "maliki",
    title: { en: "Maliki inheritance", ar: "الميراث في المذهب المالكي" },
    description: {
      en: "Followed across North and West Africa. Classical Maliki scholars were reluctant to apply Radd, and the school agrees with Shafi'i on the Musharakah case.",
      ar: "المذهب السائد في شمال أفريقيا وغربها. تحفّظ فقهاؤه قديمًا في تطبيق الرَّد، ويوافق الشافعيَّ في مسألة المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "shafii",
    title: { en: "Shafi'i inheritance", ar: "الميراث في المذهب الشافعي" },
    description: {
      en: "Followed in Egypt, the Levant, and Southeast Asia. When the grandfather inherits with siblings he gets the best of three options, and the school applies the Musharakah ruling.",
      ar: "المذهب السائد في مصر والشام وجنوب شرق آسيا. يعطي الجدَّ مع الإخوة أوفر ثلاث صور، ويطبّق المشتركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "madhhab",
    slug: "hanbali",
    title: { en: "Hanbali inheritance", ar: "الميراث في المذهب الحنبلي" },
    description: {
      en: "Followed across the Arabian peninsula. On most contested cases it sides with Shafi'i and Maliki rather than Hanafi.",
      ar: "المذهب السائد في شبه الجزيرة العربية. يوافق الشافعيَّ والمالكيَّ دون الحنفي في معظم المسائل المختلَف فيها.",
    },
    readingMinutes: 5,
  },

  {
    group: "rules",
    slug: "fixed-shares",
    title: { en: "Fixed shares (الفروض)", ar: "الفروض المقدّرة" },
    description: {
      en: "The six fractions the Quran prescribes (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) and which heirs get each one.",
      ar: "الفروض الستة التي نصّ عليها القرآن (1/2، 1/4، 1/8، 2/3، 1/3، 1/6) ومن يستحقّ كلًّا منها.",
    },
    readingMinutes: 6,
  },
  {
    group: "rules",
    slug: "blocking",
    title: { en: "Blocking (الحجب)", ar: "الحجب" },
    description: {
      en: "How a closer heir stops a more distant one from inheriting. It's the most common reason someone you'd expect to inherit gets nothing.",
      ar: "كيف يمنع الوارثُ الأقرب من هو أبعد منه من الإرث. وهو أكثر ما يُحرَم به وارثٌ كان يُتوقَّع أن يرث.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "residuary",
    title: { en: "Residuary heirs (العصبة)", ar: "العصبة" },
    description: {
      en: "Asabah heirs take what's left after the fixed shares are paid. There are three kinds: by self, by another, and with another.",
      ar: "العصبة يأخذون ما بقي بعد أصحاب الفروض، وهم ثلاثة أنواع: عصبة بالنفس، وعصبة بالغير، وعصبة مع الغير.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "awl",
    title: { en: "Awl (العول)", ar: "العَوْل" },
    description: {
      en: "When the fixed shares add up to more than the estate, Awl reduces each one in proportion until they fit.",
      ar: "إذا زادت جملة الفروض على التركة، نقص كل نصيب بنسبته بالعَوْل حتى تتّسع لها التركة.",
    },
    readingMinutes: 5,
  },
  {
    group: "rules",
    slug: "radd",
    title: { en: "Radd (الرد)", ar: "الرَّد" },
    description: {
      en: "When the fixed shares add up to less than the estate and there's no residuary heir, Radd gives the surplus back to the heirs other than the spouse.",
      ar: "إذا نقصت جملة الفروض عن التركة ولم يوجد عاصب، رُدّ الفائض على أصحاب الفروض من غير الزوجين.",
    },
    readingMinutes: 5,
  },

  {
    group: "special-cases",
    slug: "umariatan",
    title: { en: "Umariatan (العمريتان)", ar: "العمريتان" },
    description: {
      en: "Two cases Caliph Umar ruled on, where the heirs are a spouse, the mother, and the father. The mother takes 1/3 of the remainder, not 1/3 of the total.",
      ar: "مسألتان قضى فيهما عمر رضي الله عنه، والورثة فيهما زوج أو زوجة مع أم وأب. تأخذ الأم فيهما ثلث الباقي لا ثلث التركة كلها.",
    },
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "musharakah",
    title: { en: "Musharakah (المشتركة)", ar: "المشتركة" },
    description: {
      en: "When the fixed shares use up the estate, full siblings join the maternal half-siblings in their 1/3 share. Maliki and Shafi'i apply this. Hanafi doesn't.",
      ar: "إذا استغرقت الفروضُ التركةَ، شارك الإخوةُ الأشقاء الإخوةَ لأم في ثلثهم. يأخذ بها المالكي والشافعي، ولا يأخذ بها الحنفي.",
    },
    readingMinutes: 4,
  },
  {
    group: "special-cases",
    slug: "grandfather-with-siblings",
    title: { en: "Grandfather with siblings (الجد مع الإخوة)", ar: "الجد مع الإخوة" },
    description: {
      en: "When a grandfather inherits alongside the deceased's siblings, does he block them (Hanafi) or share with them (Maliki, Shafi'i, and Hanbali)?",
      ar: "إذا ورث الجد مع إخوة المتوفى، فهل يحجبهم (الحنفي) أم يقاسمهم (المالكي والشافعي والحنبلي)؟",
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
