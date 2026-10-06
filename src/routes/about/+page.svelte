<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import { i18n, t } from "$lib/i18n/index.svelte";
  import { loc, pageUrl, localizeBodyHtml } from "$lib/i18n/url";
  import { page } from "$app/state";
  import { serialiseJsonLd, personSchema } from "$lib/seo/jsonld";

  const maintainerSchema = personSchema({
    name: "Mohammed Guiga",
    jobTitle: "Software engineer",
    worksFor: { name: "Guiga Labs", url: "https://guigalabs.com" },
  });

  const CONTENT = {
    en: {
      kicker: "About",
      title: "FairShare",
      pageTitle: "About FairShare",
      metaDescription:
        "A free Islamic inheritance calculator from Guiga Labs. It works offline, compares the four Sunni schools side by side and links every share to the verse behind it.",
      body: `<p>FairShare is a free calculator for Islamic inheritance (<em>Fara'id</em>), made by <a href="https://guigalabs.com">Guiga Labs</a>. You can use it on the web at <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a> or as an iOS app, and it works offline.</p>

<h2>Why we made it</h2>
<p>The Quran spells out inheritance in more detail than almost any other area of law. More verses deal with it than with prayer, fasting or zakat. Yet most calculators we tried picked one school of thought without saying so, got the well-known edge cases wrong (Awl, Radd, Umariatan), or handed back numbers with no explanation.</p>
<p>FairShare tries to fix both problems. It gives the answer under each of the four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) plus a General majority view, and it shows how it got there. Every share links to the Quranic verse that sets it.</p>

<h2>How the calculator works</h2>
<p>The math runs in your browser. The engine is a TypeScript port of the Swift package behind the iOS app, and it uses exact fractions (BigInt under the hood) so the web and iOS results always match. We test it against more than two dozen classical cases, including the named edge cases, so we notice if something breaks.</p>
<p>Calculations you save in the free calculator stay in your browser's IndexedDB and aren't uploaded. You don't need an account to use it, and there are no analytics SDKs or ads. Once the page has loaded, the calculator doesn't talk to a server. FairShare Pro, the paid workspace for attorneys, works differently: it stores your cases in your account.</p>

<h2>Who makes it</h2>
<p>FairShare is made by <strong>Mohammed Guiga</strong>, a software engineer in California. Feedback and contributions are welcome. Press materials are at <a href="https://guigalabs.com/fairshare/press">guigalabs.com/fairshare/press</a>.</p>

<h2>Before you use it on an actual estate</h2>
<p>FairShare is a learning tool. It isn't a religious or legal authority. Dividing an actual estate depends on things a calculator can't know, like debts, bequests (wasiyyah) and local law. For a real distribution, please talk to a qualified mufti and a licensed attorney. The <a href="/disclaimer">disclaimer</a> has the details.</p>`,
      cta: { primary: "Try the calculator", secondary: "Read the methodology" },
    },
    ar: {
      kicker: "عن فيرشير",
      title: "فيرشير",
      pageTitle: "عن فيرشير",
      metaDescription:
        "فيرشير حاسبة مجانية للميراث الإسلامي من غيغا لابز تعمل دون اتصال. تعرض نتائج المذاهب السنية الأربعة متجاورة، وتربط كل نصيب بالآية التي تنص عليه.",
      body: `<p>فيرشير حاسبة مجانية للميراث الإسلامي (<em>الفرائض</em>) من <a href="https://guigalabs.com">غيغا لابز</a>. يمكنك استخدامها على الويب في <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a> أو تطبيقًا على iOS، وهي تعمل دون اتصال بالإنترنت.</p>

<h2>لماذا صنعناها</h2>
<p>فصّل القرآن أحكام الميراث تفصيلًا قلّ أن نجده في باب آخر، وآياته أكثر من آيات الصلاة أو الصيام أو الزكاة. ومع ذلك وجدنا أن أغلب الحاسبات تتّبع مذهبًا واحدًا دون أن تذكر ذلك، أو تخطئ في الحالات المعروفة (العَوْل، الرَّد، العمريتان)، أو تعطيك أرقامًا بلا شرح.</p>
<p>تحاول فيرشير معالجة الأمرين. فهي تعطيك الجواب على كل مذهب من المذاهب السنية الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) وعلى رأي الجمهور العام، وتشرح كيف وصلت إليه. وكل نصيب مربوط بالآية التي تنصّ عليه.</p>

<h2>كيف تعمل الحاسبة</h2>
<p>يجري الحساب كله داخل متصفّحك. المحرّك نسخة TypeScript من حزمة Swift التي يعمل بها تطبيق iOS، ويستخدم كسورًا دقيقة (عبر BigInt) حتى تتطابق نتائج الويب مع نتائج iOS دائمًا. نختبره على أكثر من عشرين مسألة كلاسيكية، منها الحالات الخاصة المعروفة بأسمائها، لنكتشف أي خلل فور حدوثه.</p>
<p>ما تحفظه من حسابات في الحاسبة المجانية يبقى في قاعدة بيانات متصفّحك (IndexedDB) ولا يُرفع إلى أي خادم. لا تحتاج إلى إنشاء حساب لاستخدامها، ولا توجد أدوات تحليل ولا إعلانات. وبعد تحميل الصفحة لا تتصل الحاسبة بأي خادم. أما فيرشير برو، وهي مساحة العمل المدفوعة للمحامين، فتحفظ ملفاتك في حسابك.</p>

<h2>من يطوّرها</h2>
<p>يطوّر فيرشير <strong>محمد قيقة</strong>، مهندس برمجيات يقيم في كاليفورنيا. نرحّب بالملاحظات والمساهمات. المواد الإعلامية متاحة على <a href="https://guigalabs.com/fairshare/press">guigalabs.com/fairshare/press</a>.</p>

<h2>قبل أن تستخدمها في تركة فعلية</h2>
<p>فيرشير أداة للتعلّم، وليست مرجعًا شرعيًا ولا قانونيًا. قسمة التركة الفعلية تتوقّف على أمور لا تعرفها الحاسبة، كالديون والوصايا والقانون المحلي. لأي قسمة حقيقية، استشر مفتيًا مؤهّلًا ومحاميًا مرخّصًا. التفاصيل في <a href="/ar/disclaimer">إخلاء المسؤولية</a>.</p>`,
      cta: { primary: "جرّب الحاسبة", secondary: "اقرأ المنهجية" },
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.pageTitle} | FairShare</title>
  <meta name="description" content={content.metaDescription} />
  <link rel="canonical" href={pageUrl(page.url.pathname)} />
  {@html serialiseJsonLd(maintainerSchema)}
</svelte:head>

<section class="container">
  <ArticleHeader kicker={content.kicker} title={content.title} />

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
    <Button href={loc("/calculate")}>{content.cta.primary}</Button>
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
