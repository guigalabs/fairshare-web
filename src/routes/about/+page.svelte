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
        "Offline-first Islamic inheritance calculator from Guiga Labs. Five madhabs side by side, every share linked to its Quranic source. No accounts, no tracking.",
      body: `<p>FairShare is a free, offline-first calculator for Islamic inheritance (<em>Fara'id</em>), built by <a href="https://guigalabs.com">Guiga Labs</a>. It's available as a web app at <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a> and as a native iOS app.</p>

<h2>Why we built it</h2>
<p>Islamic inheritance is one of the most precisely specified legal systems in the Quran. More verses are devoted to it than to prayer, fasting, or zakat. But existing calculators either silently follow a single school of thought, fail on well-known edge cases (Awl, Radd, Umariatan), or hide the reasoning behind opaque numbers.</p>
<p>FairShare exists to do two things at once: produce the <em>right</em> answer for each of the five Sunni schools (General, Hanafi, Maliki, Shafi'i, Hanbali), and <em>show its work</em>. Every share is linked to the Quranic verse that prescribes it.</p>

<h2>How the calculator works</h2>
<p>Every calculation runs entirely in your browser. The inheritance engine is a pure TypeScript port of the Swift package that powers the iOS app, with BigInt-backed exact fractions to guarantee parity with the iOS calculations. We test against 28+ classical scenarios, including the named edge cases, to catch regressions.</p>
<p>Saved calculations live in your browser's IndexedDB. Nothing is uploaded anywhere. There are no accounts, no analytics SDKs, no advertising. The only outbound network request FairShare ever makes is downloading the page itself.</p>

<h2>The team</h2>
<p>FairShare is built by <strong>Mohammed Guiga</strong>, a software engineer based in California. The project is open to contributions and feedback. For press kits, see <a href="https://guigalabs.com/fairshare/press">guigalabs.com/fairshare/press</a>.</p>

<h2>Important caveat</h2>
<p>FairShare is an educational tool, not a religious or legal authority. Real estate distributions involve facts (debts, wasiyyah, jurisdictional law) that no calculator can capture. Please consult a qualified mufti and a licensed attorney for any actual distribution. See the <a href="/disclaimer">full disclaimer</a> for details.</p>`,
      cta: { primary: "Try the calculator", secondary: "Read the methodology" },
    },
    ar: {
      kicker: "عن فيرشير",
      title: "فيرشير",
      pageTitle: "عن فيرشير",
      metaDescription:
        "فيرشير حاسبة ميراث إسلامي تعمل دون اتصال، من غيغا لابز. خمسة مذاهب جنبًا إلى جنب، كل نصيب مربوط بمصدره القرآني، بدون حسابات، بدون تتبع.",
      body: `<p>فيرشير حاسبة مجانية للميراث الإسلامي (<em>الفرائض</em>) تعمل دون اتصال، طوّرتها <a href="https://guigalabs.com">غيغا لابز</a>. متوفّرة كتطبيق ويب على <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a> وكتطبيق أصلي على iOS.</p>

<h2>لماذا بنيناها</h2>
<p>الميراث الإسلامي من أكثر الأنظمة القانونية تفصيلًا في القرآن، بل خُصّصت له آيات أكثر مما خُصّص للصلاة أو الصيام أو الزكاة. ومع ذلك فإن الحاسبات القائمة إما تتّبع مذهبًا واحدًا دون توضيح، أو تفشل في الحالات الخاصة المعروفة (العَوْل، الرَّد، العمريتان)، أو تخفي المنطق وراء أرقام مبهمة.</p>
<p>وُجدت فيرشير لتفعل أمرين معًا: تُنتج النتيجة <em>الصحيحة</em> لكل من المذاهب السنية الخمسة (العام، الحنفي، المالكي، الشافعي، الحنبلي)، و<em>تُظهر طريقة حسابها</em>. كل نصيب مربوط بالآية القرآنية التي تنصّ عليه.</p>

<h2>كيف تعمل الحاسبة</h2>
<p>تتم كل عملية حساب داخل متصفّحك بالكامل. محرّك الميراث هو نسخة TypeScript خالصة من حزمة Swift التي تشغّل تطبيق iOS، مع كسور دقيقة مدعومة بـ BigInt لضمان التطابق مع حسابات iOS. نختبر النظام على أكثر من 28 سيناريو كلاسيكيًا تشمل الحالات الخاصة المسماة، حتى نرصد أي انحراف.</p>
<p>تُحفظ الحسابات في قاعدة بيانات المتصفح (IndexedDB). لا يُرفع أي شيء إلى أي خادم. لا توجد حسابات، ولا أدوات تحليل، ولا إعلانات. الطلب الوحيد الذي يصدر عن فيرشير إلى الإنترنت هو تنزيل الصفحة نفسها.</p>

<h2>الفريق</h2>
<p>طوّر فيرشير <strong>محمد قيقة</strong>، مهندس برمجيات مقيم في كاليفورنيا. المشروع مفتوح للمساهمات والملاحظات. للحصول على المواد الإعلامية، انظر <a href="https://guigalabs.com/fairshare/press">guigalabs.com/fairshare/press</a>.</p>

<h2>تحفّظ مهم</h2>
<p>فيرشير أداة تعليمية لا مرجع شرعي ولا قانوني. تتضمّن قسمة التركات الفعلية وقائع (ديون، وصايا، قانون محلي) لا تستطيع أي حاسبة الإحاطة بها. يرجى استشارة مفتٍ مؤهّل ومحامٍ مرخّص قبل تطبيق أي قسمة فعلية. للمزيد، انظر <a href="/ar/disclaimer">إخلاء المسؤولية الكامل</a>.</p>`,
      cta: { primary: "جرّب الحاسبة", secondary: "اقرأ المنهجية" },
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.pageTitle} · FairShare</title>
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
