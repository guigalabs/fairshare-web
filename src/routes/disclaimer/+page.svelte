<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { Banner } from "$lib/ui";
  import { i18n } from "$lib/i18n/index.svelte";

  const CONTENT = {
    en: {
      kicker: "Disclaimer",
      title: "Educational use only.",
      metaDescription:
        "Important disclaimer for FairShare. The app is an educational reference, not a substitute for a qualified mufti or licensed attorney.",
      banner: `<strong>FairShare is not a substitute for a qualified scholar or attorney.</strong> Please read the full disclaimer below before relying on any calculation.`,
      body: `<h2>The calculator is educational</h2>
<p>FairShare illustrates how an estate would be distributed under the classical rules of <em>Fara'id</em> for the five schools we support. It implements the rules accurately (the engine is tested against the canonical worked examples), but a real estate distribution involves facts the calculator cannot know:</p>
<ul>
  <li><strong>Outstanding debts.</strong> Debts are paid before any inheritance is distributed. The calculator assumes a clean estate.</li>
  <li><strong>Bequests (wasiyyah).</strong> Up to one-third of the estate may be willed outside the Fara'id distribution. The calculator does not handle bequests.</li>
  <li><strong>Jurisdictional law.</strong> Local civil and tax law often shapes how an estate is actually settled, regardless of the religious calculation.</li>
  <li><strong>Family-specific facts.</strong> Adopted children, missing heirs, simultaneous deaths, divorces in waiting period: all require scholarly judgement.</li>
</ul>

<h2>What you should do</h2>
<p>For any actual estate distribution, please consult two professionals:</p>
<ol>
  <li>A <strong>qualified mufti</strong> familiar with your family's specific circumstances and the school of thought you follow.</li>
  <li>A <strong>licensed attorney</strong> in your jurisdiction for the legal and tax aspects of estate settlement.</li>
</ol>
<p>FairShare is most useful for understanding <em>why</em> a distribution looks the way it does. The verse-level citations and side-by-side school comparison let you see the reasoning. Treat the output as a teaching aid, not a binding decree.</p>

<h2>Limitation of liability</h2>
<p>FairShare is provided "as is", without warranty of any kind. Guiga Labs is not liable for any loss or harm arising from reliance on the calculator's output. Use of the app implies acceptance of these limits.</p>

<h2>Sectarian scope</h2>
<p>FairShare currently covers the four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) and a "General" majority Sunni position. The Ja'fari (Shia) inheritance system is substantially different and is not yet supported.</p>`,
    },
    ar: {
      kicker: "إخلاء المسؤولية",
      title: "للاستخدام التعليمي فقط.",
      metaDescription:
        "إخلاء مسؤولية مهم لتطبيق فيرشير. التطبيق مرجع تعليمي ولا يغني عن استشارة مفتٍ مؤهّل أو محامٍ مرخّص.",
      banner: `<strong>فيرشير لا يُغني عن عالم مؤهّل أو محامٍ.</strong> يرجى قراءة إخلاء المسؤولية الكامل أدناه قبل الاعتماد على أي حساب.`,
      body: `<h2>الحاسبة وسيلة تعليمية</h2>
<p>تُوضّح فيرشير كيفية توزيع التركة وفق أحكام <em>الفرائض</em> الكلاسيكية للمذاهب الخمسة التي ندعمها. تطبّق هذه الأحكام بدقّة (المحرّك مختبَر على الأمثلة الكلاسيكية المعتمدة)، لكن قسمة التركة الفعلية تتضمّن وقائع لا تعرفها الحاسبة:</p>
<ul>
  <li><strong>الديون المستحقّة.</strong> تُسدَّد الديون قبل أي قسمة للتركة. تفترض الحاسبة أن التركة خالية من الديون.</li>
  <li><strong>الوصايا.</strong> يجوز أن يُوصى بثُلث التركة خارج قسمة الفرائض. لا تتعامل الحاسبة مع الوصايا.</li>
  <li><strong>القانون المحلي.</strong> كثيرًا ما يحدّد القانون المدني والضريبي طريقة التسوية الفعلية للتركة، بصرف النظر عن الحساب الشرعي.</li>
  <li><strong>وقائع خاصة بالعائلة.</strong> التبنّي، والوارث المفقود، ووفاة عدّة أشخاص في وقت واحد، والطلاق في العدّة: كلها تستلزم اجتهادًا شرعيًا.</li>
</ul>

<h2>ماذا ينبغي أن تفعل</h2>
<p>لأي قسمة فعلية للتركة، يرجى استشارة جهتين مهنيّتين:</p>
<ol>
  <li><strong>مفتٍ مؤهّل</strong> يعرف ظروف عائلتك بدقّة والمذهب الذي تتّبعه.</li>
  <li><strong>محامٍ مرخّص</strong> في بلدك للجوانب القانونية والضريبية للتسوية.</li>
</ol>
<p>أكثر ما تنفع فيه فيرشير هو فهم <em>السبب</em> وراء صورة القسمة. توفّر إحالات الآيات ومقارنة المذاهب جنبًا إلى جنب قراءة الحجّة وراء الحكم. تعامل مع المخرجات كأداة تعليمية، لا كحكم مُلزم.</p>

<h2>تحديد المسؤولية</h2>
<p>تُقدَّم فيرشير "كما هي"، دون أي ضمان من أي نوع. لا تتحمّل غيغا لابز أي خسارة أو ضرر ناتج عن الاعتماد على مخرجات الحاسبة. استخدامك للتطبيق يعني قبولك بهذه الحدود.</p>

<h2>النطاق المذهبي</h2>
<p>تشمل فيرشير حاليًا المذاهب السنية الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) إضافة إلى موقف "عام" لجمهور أهل السنة. نظام الميراث الجعفري (الشيعي) يختلف اختلافًا جوهريًا ولم يُدعم بعد.</p>`,
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.kicker} · FairShare</title>
  <meta name="description" content={content.metaDescription} />
  <link rel="canonical" href="https://fairshare.guigalabs.com/disclaimer/" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">{content.kicker}</p>
    <h1>{content.title}</h1>
  </header>

  <Banner tone="warning">
    {#snippet children()}
      {#if i18n.current === "ar"}
        {@html CONTENT.ar.banner}
      {:else}
        {@html CONTENT.en.banner}
      {/if}
    {/snippet}
  </Banner>

  <Prose>
    {#snippet children()}
      {#if i18n.current === "ar"}
        {@html CONTENT.ar.body}
      {:else}
        {@html CONTENT.en.body}
      {/if}
    {/snippet}
  </Prose>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 1.5rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-warning-text);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
</style>
