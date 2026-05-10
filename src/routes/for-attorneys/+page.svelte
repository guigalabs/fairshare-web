<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import { i18n } from "$lib/i18n/index.svelte";

  const CONTENT = {
    en: {
      kicker: "For Practitioners",
      title: "Built for Islamic estate attorneys",
      lede: "Replace the spreadsheet-and-Word workflow you've been using to compute Fara'id distributions for clients. Every case in one place, with the math, citations, and deliverables a practising attorney needs.",
      metaDescription:
        "A workspace for Islamic estate attorneys: case folders per family, named heirs, debts and wasiyyah deductions, branded PDFs, side-by-side madhab comparison.",
      body: `<h2>What's included</h2>
<ul>
  <li><strong>Case folders per family.</strong> Group multiple estates under one client (the Hassan family's grandfather and grandmother), with notes, tags, and a hearing date on each case.</li>
  <li><strong>Named heirs.</strong> Capture each son, daughter, and spouse by name and identifier so they appear on the distribution document, not just as "sons: 3."</li>
  <li><strong>Estate amounts and deductions.</strong> Enter the gross estate, funeral expenses, debts, and bequests; the calculator validates the 1/3 wasiyyah cap and applies Fara'id to the net estate.</li>
  <li><strong>Branded PDFs.</strong> Upload your firm logo and letterhead, add an editable advisory paragraph and signature block, and download a deliverable you can hand a client.</li>
  <li><strong>Side-by-side madhab comparison.</strong> When a family is mixed-school or you need to counsel on the difference, render Hanafi, Maliki, Shafi'i, Hanbali, and General results in one view.</li>
  <li><strong>Search, filter, export.</strong> Find any case in seconds. Export your data as JSON or CSV at any time.</li>
</ul>

<h2>Why FairShare and not a spreadsheet</h2>
<p>The Fara'id engine is built in TypeScript with BigInt-backed exact fractions, so every share is computed precisely without floating-point drift. The named edge cases (Awl, Radd, Hajb, Umariatan, Musharakah, Grandfather-with-siblings) are all detected automatically. Every share is linked to the verse in Surah An-Nisa that prescribes it (4:11, 4:12, 4:176).</p>

<h2>For diaspora clients</h2>
<p>FairShare is bilingual EN/AR with full RTL. The branded PDF can carry both your English advisory text and an Arabic disclaimer for clients who'll share it with family back home.</p>

<h2>Who's it for</h2>
<p>Solo practitioners and small firms doing Islamic estate planning, wasiyyah drafting, and inheritance dispute work. Institutional pricing is available for madrassas and Sharia finance firms; contact us directly.</p>`,
      cta: { primary: "See pricing", secondary: "Try the free calculator" },
    },
    ar: {
      kicker: "للممارسين",
      title: "بُني لمحامي تخطيط التركات الإسلامية",
      lede: "بديل لطريقة العمل بالجداول وملفات Word التي تستخدمها لحساب قسمة الفرائض لموكليك. كل ملف في مكان واحد، مع الحساب والاستشهادات والمخرجات التي يحتاجها المحامي الممارس.",
      metaDescription:
        "بيئة عمل لمحامي تخطيط التركات الإسلامية: ملفات لكل عائلة، ورثة بالاسم، خصومات الديون والوصايا، تقارير PDF بشعار المكتب، مقارنة المذاهب جنبًا إلى جنب.",
      body: `<h2>ما الذي يشمله الاشتراك</h2>
<ul>
  <li><strong>ملفات لكل عائلة.</strong> اجمع عدّة تركات تحت موكّل واحد (جدّ آل حسن وجدّتهم)، مع ملاحظات ووسوم وتاريخ الجلسة لكل ملف.</li>
  <li><strong>ورثة بالاسم.</strong> سجّل كل ابن وبنت وزوج بالاسم والمعرّف ليظهروا على وثيقة القسمة، لا مجرد "أبناء: 3".</li>
  <li><strong>قيم التركة والخصومات.</strong> أدخل إجمالي التركة ومصاريف الجنازة والديون والوصايا؛ تتحقّق الحاسبة من حدّ الثلث في الوصية وتطبّق الفرائض على صافي التركة.</li>
  <li><strong>تقارير PDF بشعار المكتب.</strong> ارفع شعار مكتبك ورأس الورق، أضف فقرة استشارية قابلة للتحرير وخانة توقيع، ونزّل ملفًا قابلاً للتسليم للموكّل.</li>
  <li><strong>مقارنة المذاهب جنبًا إلى جنب.</strong> حين تختلط مذاهب العائلة أو تحتاج لإيضاح الفرق، اعرض نتائج الحنفي والمالكي والشافعي والحنبلي والعام في شاشة واحدة.</li>
  <li><strong>بحث وتصفية وتصدير.</strong> اعثر على أي ملف في ثوانٍ. صدِّر بياناتك بصيغة JSON أو CSV في أي وقت.</li>
</ul>

<h2>لماذا فيرشير وليس جدول بيانات</h2>
<p>محرّك الفرائض مكتوب بـ TypeScript مع كسور دقيقة مدعومة بـ BigInt، فيُحسب كل نصيب بدقّة دون أي انحراف في الفواصل العشرية. الحالات الخاصة المسماة (العَوْل، الرَّد، الحجب، العمريتان، المشتركة، الجد مع الإخوة) تُكتشف جميعها تلقائيًا. كل نصيب مربوط بآية سورة النساء التي تنصّ عليه (4:11، 4:12، 4:176).</p>

<h2>للموكّلين في المهجر</h2>
<p>فيرشير ثنائي اللغة عربي/إنجليزي مع دعم كامل للكتابة من اليمين إلى اليسار. يستطيع تقرير PDF حمل نصّك الاستشاري بالإنجليزية وإخلاء مسؤولية بالعربية للموكّلين الذين سيشاركونه مع أفراد عائلتهم في الوطن.</p>

<h2>لمن هذا الاشتراك</h2>
<p>الممارسون الأفراد والمكاتب الصغيرة الذين يعملون في تخطيط التركات الإسلامية وصياغة الوصايا والنزاعات الميراثية. تتوفّر تسعيرة مؤسسية للمدارس الشرعية وشركات التمويل الإسلامي؛ تواصل معنا مباشرة.</p>`,
      cta: { primary: "اطلع على الأسعار", secondary: "جرّب الحاسبة المجانية" },
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.title}</title>
  <meta name="description" content={content.metaDescription} />
  <link rel="canonical" href="https://fairshare.guigalabs.com/for-attorneys/" />
</svelte:head>

<section class="container">
  <ArticleHeader kicker={content.kicker} title={content.title} lede={content.lede} />

  <Prose>
    {#snippet children()}
      {#if i18n.current === "ar"}
        {@html CONTENT.ar.body}
      {:else}
        {@html CONTENT.en.body}
      {/if}
    {/snippet}
  </Prose>

  <div class="cta">
    <Button href="/pricing">{content.cta.primary}</Button>
    <Button href="/calculate" variant="secondary">{content.cta.secondary}</Button>
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
