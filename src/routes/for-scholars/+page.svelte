<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import { i18n } from "$lib/i18n/index.svelte";
  import { loc, pageUrl, localizeBodyHtml } from "$lib/i18n/url";
  import { page } from "$app/state";

  const CONTENT = {
    en: {
      kicker: "For scholars and madrassas",
      title: "FairShare for scholars, imams and madrassas",
      lede: "For people who answer inheritance questions in class, at the mosque or in private consultations. Use it to teach, to help settle a disagreement, or to check an answer.",
      metaDescription:
        "How scholars, imams and madrassas can use FairShare to teach Fara'id: the madhabs compared side by side, the Quranic verse behind each share, and a step-by-step walkthrough of the reasoning.",
      body: `<h2>How people use it</h2>
<ul>
  <li><strong>Teaching Fara'id.</strong> Set up any family and let students follow the step-by-step explanation of each share: the fixed shares first, then 'awl or radd, then the residue.</li>
  <li><strong>Answering questions.</strong> When someone asks after prayer "what do two daughters and a wife get?", you can work it out in seconds with the verse reference in front of you.</li>
  <li><strong>Mediating disputes.</strong> When a family disagrees about which madhab applies, the compare view shows exactly where the schools differ. You don't have to work out four scenarios by hand.</li>
</ul>

<h2>What's included</h2>
<ul>
  <li><strong>Five columns for one family.</strong> General, Hanafi, Maliki, Shafi'i and Hanbali results sit next to each other. Named edge cases (Umariatan, Musharakah, the grandfather with siblings) are flagged where they apply.</li>
  <li><strong>Quranic citations.</strong> Every fixed share links to the verse in Surah An-Nisa that sets it (4:11, 4:12, 4:176).</li>
  <li><strong>A plain-language summary.</strong> Each result comes with a short paragraph that explains the outcome without jargon. It helps when you're talking with a grieving family.</li>
  <li><strong>PDFs with your name on them.</strong> If you teach at a madrassa or run a fatwa service, your logo, letterhead and disclaimer go on every export.</li>
  <li><strong>English and Arabic.</strong> Full right-to-left support, with Arabic set in Noto Naskh.</li>
</ul>

<h2>The engine</h2>
<p>The calculator is a TypeScript port of the Swift package behind the iOS app. It uses exact fractions (BigInt), runs entirely in your browser, and is tested against a set of classical cases that includes all the named edge cases. The methodology pages go through each madhab's rulings in detail.</p>

<h2>Who it's for</h2>
<p>Imams, muftis who take consultations, scholars who work on inheritance questions, and madrassas that teach Fara'id. We offer institutional pricing, so get in touch if you need licenses for a madrassa.</p>`,
      cta: { primary: "See pricing", secondary: "Read the methodology" },
    },
    ar: {
      kicker: "للعلماء والمدارس الشرعية",
      title: "فيرشير للعلماء والأئمّة والمدارس الشرعية",
      lede: "لمن يجيب عن مسائل الميراث في الدرس أو في المسجد أو في الاستشارات الخاصة. استخدمه في التدريس، أو للمساعدة في فضّ خلاف، أو للتحقّق من جواب.",
      metaDescription:
        "كيف يستخدم العلماء والأئمّة والمدارس الشرعية فيرشير في تدريس الفرائض: مقارنة بين نتائج المذاهب، والآية التي يستند إليها كل نصيب، وشرح للحساب خطوة بخطوة.",
      body: `<h2>كيف يُستخدم</h2>
<ul>
  <li><strong>تدريس الفرائض.</strong> أدخل أي مسألة ودَع الطلاب يتابعون الشرح خطوة بخطوة لكل نصيب: الفروض المقدّرة أولًا، ثم العَوْل أو الرَّد، ثم الباقي.</li>
  <li><strong>الإجابة عن الأسئلة.</strong> حين يسألك أحدهم بعد الصلاة "كم تأخذ البنتان والزوجة؟"، تحسب الجواب في ثوانٍ والآية أمامك.</li>
  <li><strong>التحكيم في النزاعات.</strong> حين تختلف العائلة في المذهب الذي يُطبَّق، تُظهر شاشة المقارنة مواضع الاختلاف بين المذاهب بدقّة، فلا تضطر إلى حساب أربع مسائل يدويًا.</li>
</ul>

<h2>ما الذي يتضمّنه</h2>
<ul>
  <li><strong>خمسة أعمدة للعائلة نفسها.</strong> نتائج الرأي العام والحنفي والمالكي والشافعي والحنبلي متجاورة. وتنبّهك الحاسبة إلى الحالات الخاصة (العمريتان، المشتركة، الجد مع الإخوة) حين تنطبق.</li>
  <li><strong>الإحالات القرآنية.</strong> كل فرض مقدّر مربوط بآية سورة النساء التي تنصّ عليه (4:11، 4:12، 4:176).</li>
  <li><strong>ملخّص بلغة بسيطة.</strong> مع كل نتيجة فقرة قصيرة تشرحها دون مصطلحات فقهية، وهذا يفيد حين تتحدّث مع عائلة فقدت عزيزًا.</li>
  <li><strong>تقارير PDF باسم مؤسستك.</strong> إن كنت تدرّس في مدرسة شرعية أو تدير خدمة فتوى، يظهر شعارك ورأس الورق وإخلاء المسؤولية في كل ملف تصدّره.</li>
  <li><strong>العربية والإنجليزية.</strong> دعم كامل للكتابة من اليمين إلى اليسار، والنص العربي بخط نوتو نسخ.</li>
</ul>

<h2>المحرّك</h2>
<p>حاسبة فيرشير نسخة TypeScript من حزمة Swift التي يعمل بها تطبيق iOS. تستخدم كسورًا دقيقة (عبر BigInt)، وتعمل داخل متصفّحك بالكامل، ونختبرها على مجموعة من المسائل الكلاسيكية تشمل كل الحالات الخاصة المعروفة. وتشرح صفحات المنهجية أحكام كل مذهب بالتفصيل.</p>

<h2>لمن هو</h2>
<p>للأئمّة، والمفتين الذين يستقبلون الاستفتاءات، والعلماء المشتغلين بمسائل الميراث، والمدارس الشرعية التي تدرّس الفرائض. لدينا تسعير مؤسسي، فتواصل معنا إن احتجت إلى تراخيص لمدرستك.</p>`,
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
