<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import { i18n } from "$lib/i18n/index.svelte";
  import { loc, pageUrl, localizeBodyHtml } from "$lib/i18n/url";
  import { page } from "$app/state";

  const CONTENT = {
    en: {
      kicker: "For Scholars & Madrassas",
      title: "For scholars, imams, and madrassas",
      lede: "A teaching, mediation, and reference tool for those answering inheritance questions in classrooms, mosques, and consultations.",
      metaDescription:
        "FairShare for scholars, imams, and madrassas teaching Fara'id. Side-by-side madhab comparison, full Quranic citations, and a walkthrough that shows the reasoning.",
      body: `<h2>How it gets used</h2>
<ul>
  <li><strong>Teaching Fara'id.</strong> Walk students through any family scenario and let the step-by-step explanation show how each share is derived: fixed shares first, then 'awl or radd, then residue.</li>
  <li><strong>Public Q&A.</strong> When a congregant asks "what's the share of two daughters and a wife?" you can run the answer in seconds and have the verse reference at hand.</li>
  <li><strong>Mediation and dispute work.</strong> When families disagree on which madhab applies, the side-by-side compare view shows the difference plainly without you having to hand-compute four parallel scenarios.</li>
</ul>

<h2>What's included</h2>
<ul>
  <li><strong>Five madhabs side by side.</strong> General, Hanafi, Maliki, Shafi'i, and Hanbali rulings rendered as columns for the same family. The named edge cases (Umariatan, Musharakah, Grandfather-with-siblings) are surfaced where they apply.</li>
  <li><strong>Quranic citations.</strong> Every fixed share is linked to the verse in Surah An-Nisa that prescribes it (4:11, 4:12, 4:176).</li>
  <li><strong>Plain-language summary.</strong> Each result includes a paragraph explaining the outcome to a non-technical audience, which helps when explaining to a grieving family.</li>
  <li><strong>Branded PDFs.</strong> If you teach at a madrassa or run a fatwa service, your logo, letterhead, and disclaimer go on every export.</li>
  <li><strong>Bilingual EN/AR.</strong> Full RTL, with the Arabic side rendered in Noto Naskh.</li>
</ul>

<h2>The engine</h2>
<p>FairShare's calculator is a TypeScript port of the Swift package that powers the iOS app. It uses BigInt-backed exact fractions, runs entirely in your browser, and is tested against a corpus of classical scenarios, including all the named edge cases. The methodology pages walk through each madhab's rulings in detail.</p>

<h2>Who's it for</h2>
<p>Imams, mufti consultants, scholars working on inheritance questions, and madrassas teaching Fara'id. Institutional pricing is available; contact us directly for madrassa licenses.</p>`,
      cta: { primary: "See pricing", secondary: "Read the methodology" },
    },
    ar: {
      kicker: "للعلماء والمدارس الشرعية",
      title: "للعلماء والأئمّة والمدارس الشرعية",
      lede: "أداة للتدريس والتحكيم والمراجعة لمن يجيبون عن مسائل الميراث في الفصول والمساجد والاستشارات.",
      metaDescription:
        "فيرشير للعلماء والأئمّة والمدارس الشرعية الذين يدرّسون الفرائض. مقارنة المذاهب جنبًا إلى جنب، إحالات قرآنية كاملة، وشرح خطوة بخطوة يُظهر منطق الحكم.",
      body: `<h2>كيف يُستخدم</h2>
<ul>
  <li><strong>تدريس الفرائض.</strong> امشِ مع الطلاب عبر أي مسألة عائلية ودَع الشرح خطوة بخطوة يُبيّن طريقة استنباط كل نصيب: الفروض المقدّرة أولًا، ثم العَوْل أو الرَّد، ثم الباقي.</li>
  <li><strong>الأسئلة العامة.</strong> عندما يسأل أحد المصلّين "ما نصيب بنتين وزوجة؟" يمكنك الحصول على الجواب في ثوانٍ مع الإحالة إلى الآية.</li>
  <li><strong>التحكيم وفضّ النزاعات.</strong> حين تختلف العائلات على المذهب الذي يُطبَّق، تُظهر شاشة المقارنة الفرق بوضوح دون الحاجة إلى حساب أربعة سيناريوهات يدويًا.</li>
</ul>

<h2>ما الذي يشمله</h2>
<ul>
  <li><strong>خمسة مذاهب جنبًا إلى جنب.</strong> أحكام العام والحنفي والمالكي والشافعي والحنبلي معروضة في أعمدة لنفس العائلة. تُبرَز الحالات الخاصة المسماة (العمريتان، المشتركة، الجد مع الإخوة) حيث تنطبق.</li>
  <li><strong>الإحالات القرآنية.</strong> كل فرض ثابت مربوط بآية سورة النساء التي تنصّ عليه (4:11، 4:12، 4:176).</li>
  <li><strong>ملخّص بكلمات بسيطة.</strong> تتضمّن كل نتيجة فقرة تشرح الحكم لعموم الناس، مما يفيد في الحديث مع عائلة فقدت عزيزًا.</li>
  <li><strong>تقارير PDF بشعار المؤسسة.</strong> إن كنت تدرّس في مدرسة شرعية أو تُدير خدمة فتوى، يظهر شعارك ورأس الورق وإخلاء المسؤولية على كل تصدير.</li>
  <li><strong>ثنائي اللغة عربي/إنجليزي.</strong> دعم كامل للكتابة من اليمين إلى اليسار، مع تقديم الجانب العربي بخط نوتو نسخ.</li>
</ul>

<h2>المحرّك</h2>
<p>حاسبة فيرشير نسخة TypeScript من حزمة Swift التي تشغّل تطبيق iOS. تستخدم كسورًا دقيقة مدعومة بـ BigInt، وتعمل داخل متصفّحك بالكامل، ومختبَرة على ذخيرة من السيناريوهات الكلاسيكية تشمل جميع الحالات الخاصة المسماة. تُفصّل صفحات المنهجية أحكام كل مذهب.</p>

<h2>لمن هذا الاشتراك</h2>
<p>الأئمّة والمستشارون والعلماء العاملون في مسائل الميراث، والمدارس الشرعية التي تدرّس الفرائض. تتوفّر تسعيرة مؤسسية؛ تواصل معنا مباشرة بشأن تراخيص المدارس.</p>`,
      cta: { primary: "اطلع على الأسعار", secondary: "اقرأ المنهجية" },
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.title}</title>
  <meta name="description" content={content.metaDescription} />
  <link rel="canonical" href={pageUrl(page.url.pathname)} />
</svelte:head>

<section class="container">
  <ArticleHeader kicker={content.kicker} title={content.title} lede={content.lede} />

  <Prose>
    {#snippet children()}
      {#if i18n.current === "ar"}
        {@html localizeBodyHtml(CONTENT.ar.body, "ar")}
      {:else}
        {@html CONTENT.en.body}
      {/if}
    {/snippet}
  </Prose>

  <div class="cta">
    <Button href={loc("/pricing")}>{content.cta.primary}</Button>
    <Button href={loc("/methodology")} variant="secondary">{content.cta.secondary}</Button>
  </div>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
</style>
