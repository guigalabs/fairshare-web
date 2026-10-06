<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import { i18n } from "$lib/i18n/index.svelte";
  import { loc, pageUrl, localizeBodyHtml } from "$lib/i18n/url";
  import { page } from "$app/state";

  const CONTENT = {
    en: {
      kicker: "For attorneys",
      title: "FairShare Pro for Islamic estate attorneys",
      lede: "If you work out Fara'id distributions in a spreadsheet and then retype them into Word for the client, Pro does both in one place. You get the shares, the verse citations and a PDF you can hand over.",
      metaDescription:
        "FairShare Pro for Islamic estate attorneys: a folder for each family, heirs by name, debt and wasiyyah deductions, PDFs on your letterhead, and the madhabs compared side by side.",
      body: `<h2>What you get</h2>
<ul>
  <li><strong>A folder for each family.</strong> Keep several estates under one client (say, the Hassan family's grandfather and grandmother). Each case has its own notes, tags and hearing date.</li>
  <li><strong>Heirs by name.</strong> Enter each son, daughter and spouse with a name and identifier, so the distribution document lists actual people instead of "sons: 3."</li>
  <li><strong>Estate amounts and deductions.</strong> Enter the gross estate, funeral costs, debts and bequests. Pro checks that bequests stay within the one-third wasiyyah limit, then applies Fara'id to what's left.</li>
  <li><strong>PDFs on your letterhead.</strong> Upload your firm's logo and letterhead, add your own advisory paragraph and a signature block, and download a PDF you can give the client.</li>
  <li><strong>Madhabs side by side.</strong> If the family follows different schools, or you need to explain how they differ, you can see the Hanafi, Maliki, Shafi'i, Hanbali and General results on one screen.</li>
  <li><strong>Search and export.</strong> Search and filter your cases, and export your data as JSON or CSV whenever you want.</li>
</ul>

<h2>Why not just use a spreadsheet</h2>
<p>Spreadsheets work in decimals, so shares like a third or a sixth pick up rounding errors. FairShare's engine uses exact fractions (BigInt in TypeScript), so they don't. It also spots the named edge cases for you: Awl, Radd, Hajb, Umariatan, Musharakah and the grandfather with siblings. And every share links to the verse in Surah An-Nisa that sets it (4:11, 4:12, 4:176).</p>

<h2>Clients with family abroad</h2>
<p>FairShare works in English and Arabic, with full right-to-left support. A PDF can carry your advisory text in English and a disclaimer in Arabic, which helps when the client plans to send it to relatives back home.</p>

<h2>Who it's for</h2>
<p>Solo practitioners and small firms that handle Islamic estate planning, wasiyyah drafting or inheritance disputes. If you're a madrassa or an Islamic finance firm, contact us about institutional pricing.</p>`,
      cta: { primary: "See pricing", secondary: "Try the free calculator" },
    },
    ar: {
      kicker: "للمحامين",
      title: "فيرشير برو لمحامي التركات الإسلامية",
      lede: "إن كنت تحسب قسمة الفرائض في جدول بيانات ثم تنقلها إلى ملف Word لموكّلك، فإن برو يجمع الخطوتين في مكان واحد. تحصل على الأنصبة والإحالات إلى الآيات وملف PDF تسلّمه للموكّل.",
      metaDescription:
        "فيرشير برو لمحامي التركات الإسلامية: ملف لكل عائلة، وورثة بأسمائهم، وخصم الديون والوصايا، وتقارير PDF على ورق مكتبك، ومقارنة بين نتائج المذاهب.",
      body: `<h2>ما تحصل عليه</h2>
<ul>
  <li><strong>ملف لكل عائلة.</strong> احفظ عدّة تركات تحت موكّل واحد (جدّ آل حسن وجدّتهم مثلًا). لكل ملف ملاحظاته ووسومه وتاريخ جلسته.</li>
  <li><strong>الورثة بأسمائهم.</strong> أدخل كل ابن وبنت وزوج باسمه ومعرّفه، فتذكر وثيقة القسمة أشخاصًا بأعيانهم بدلًا من "أبناء: 3".</li>
  <li><strong>قيمة التركة والخصومات.</strong> أدخل إجمالي التركة ونفقات الجنازة والديون والوصايا. يتحقّق برو من أن الوصية لا تتجاوز الثلث، ثم يطبّق الفرائض على ما بقي.</li>
  <li><strong>تقارير PDF على ورق مكتبك.</strong> ارفع شعار مكتبك ورأس الورق، وأضف فقرتك الاستشارية وخانة التوقيع، ثم نزّل ملف PDF تسلّمه للموكّل.</li>
  <li><strong>نتائج المذاهب متجاورة.</strong> إن اختلفت مذاهب أفراد العائلة، أو احتجت إلى شرح الفرق بينها، ترى نتائج الحنفي والمالكي والشافعي والحنبلي والرأي العام في شاشة واحدة.</li>
  <li><strong>البحث والتصدير.</strong> ابحث في ملفاتك وصفِّها، وصدِّر بياناتك بصيغة JSON أو CSV متى شئت.</li>
</ul>

<h2>لماذا لا يكفي جدول البيانات</h2>
<p>جداول البيانات تعمل بالكسور العشرية، فتتسرّب أخطاء التقريب إلى أنصبة مثل الثلث والسدس. أما محرّك فيرشير فيستخدم كسورًا دقيقة (عبر BigInt في TypeScript) فلا يقع في ذلك. ويتعرّف من تلقاء نفسه على الحالات الخاصة المعروفة: العَوْل، والرَّد، والحجب، والعمريتان، والمشتركة، والجد مع الإخوة. وكل نصيب مربوط بآية سورة النساء التي تنصّ عليه (4:11، 4:12، 4:176).</p>

<h2>موكّلون لهم أهل في الخارج</h2>
<p>يعمل فيرشير بالعربية والإنجليزية، مع دعم كامل للكتابة من اليمين إلى اليسار. ويمكن أن يحمل ملف PDF نصّك الاستشاري بالإنجليزية وإخلاء مسؤولية بالعربية، وهذا مفيد حين يريد الموكّل إرساله إلى أقاربه في بلده.</p>

<h2>لمن برو</h2>
<p>للمحامين الأفراد والمكاتب الصغيرة العاملين في تخطيط التركات الإسلامية وصياغة الوصايا ونزاعات الميراث. وإن كنت تمثّل مدرسة شرعية أو شركة تمويل إسلامي، فتواصل معنا بشأن التسعير المؤسسي.</p>`,
      cta: { primary: "اطلع على الأسعار", secondary: "جرّب الحاسبة المجانية" },
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
    <Button href={loc("/calculate")} variant="secondary">{content.cta.secondary}</Button>
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
