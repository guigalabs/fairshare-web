<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { i18n } from "$lib/i18n/index.svelte";
  import { pageUrl } from "$lib/i18n/url";
  import { page } from "$app/state";

  const LAST_UPDATED = "2026-05-01";

  const CONTENT = {
    en: {
      kicker: "Privacy",
      title: "Privacy policy",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
      metaDescription:
        "Privacy policy for FairShare web. The app is offline-first, collects no personal data, and stores everything locally on your device.",
      body: `<h2>Summary</h2>
<p>FairShare web is an offline-first calculator. We do not collect, transmit, or sell any personal data. All calculations run entirely in your browser.</p>

<h2>Information we do not collect</h2>
<p>FairShare does <strong>not</strong> collect, store, or transmit any of the following:</p>
<ul>
  <li>Personal identifiers (name, email, IP address linkage, device fingerprint)</li>
  <li>Account information (there are no accounts)</li>
  <li>Family-composition details from your calculations</li>
  <li>Geolocation data</li>
  <li>Advertising identifiers</li>
  <li>Health, financial account, or payment information</li>
</ul>
<p>The web app makes no outbound API calls during normal use. Loading the page itself goes through Cloudflare's CDN, which logs basic request metadata (browser user-agent, country, referer) for abuse prevention; that data is governed by <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy policy</a> and not accessible to us individually.</p>

<h2>Information stored locally</h2>
<p>The following lives <strong>only on your device</strong>, in your browser's storage:</p>
<ul>
  <li><strong>Saved calculations</strong> you explicitly choose to save (heir counts, selected school, calculation name). Stored in IndexedDB.</li>
  <li><strong>Theme preference</strong> (light / dark / system) and <strong>language preference</strong> (English / Arabic). Stored in localStorage.</li>
</ul>
<p>You can delete saved calculations at any time from the Settings page. Clearing your browser's site data removes everything FairShare has stored.</p>

<h2>Sharing and PDF export</h2>
<p>When you tap <strong>Share</strong>, your calculation is encoded as a URL fragment and passed to your device's native share sheet (or copied to your clipboard). We never see the URL; it goes directly between your browser and whoever you share it with.</p>
<p>When you tap <strong>Export PDF</strong>, the PDF is generated entirely in your browser and downloaded as a file. Nothing is uploaded.</p>

<h2>Third-party SDKs</h2>
<p>FairShare web uses <strong>no third-party analytics, advertising, or tracking SDKs</strong>.</p>

<h2>Children's privacy</h2>
<p>FairShare does not knowingly collect information from anyone, including children under 13. The app is suitable for educational use at any age.</p>

<h2>Changes to this policy</h2>
<p>If we change this policy, we will update the "Last updated" date above. Substantive changes will be announced on <a href="https://guigalabs.com/blog">guigalabs.com/blog</a>.</p>`,
    },
    ar: {
      kicker: "الخصوصية",
      title: "سياسة الخصوصية",
      lastUpdated: `آخر تحديث: ${LAST_UPDATED}`,
      metaDescription:
        "سياسة الخصوصية لتطبيق فيرشير على الويب. التطبيق يعمل دون اتصال، ولا يجمع أي بيانات شخصية، ويحفظ كل شيء محليًا على جهازك.",
      body: `<h2>الموجز</h2>
<p>فيرشير على الويب حاسبة تعمل دون اتصال. لا نجمع أي بيانات شخصية ولا نرسلها ولا نبيعها. تتم جميع الحسابات داخل متصفّحك بالكامل.</p>

<h2>المعلومات التي لا نجمعها</h2>
<p>فيرشير <strong>لا</strong> يجمع أو يحفظ أو يرسل أيًا مما يلي:</p>
<ul>
  <li>المعرّفات الشخصية (الاسم، البريد، ربط عنوان IP، بصمة الجهاز)</li>
  <li>بيانات الحساب (لا توجد حسابات أصلًا)</li>
  <li>تفاصيل تشكيلة العائلة من حساباتك</li>
  <li>بيانات الموقع الجغرافي</li>
  <li>معرّفات الإعلانات</li>
  <li>بيانات صحية أو مالية أو معلومات دفع</li>
</ul>
<p>لا يصدر التطبيق أي طلبات API إلى الإنترنت في الاستخدام العادي. يمرّ تحميل الصفحة نفسها عبر شبكة Cloudflare التي تسجّل بيانات وصفية أساسية (وكيل المتصفح، البلد، الإحالة) لأغراض منع الإساءة؛ وتخضع هذه البيانات لـ<a href="https://www.cloudflare.com/privacypolicy/">سياسة خصوصية Cloudflare</a> وليست متاحة لنا بشكل فردي.</p>

<h2>المعلومات المحفوظة محليًا</h2>
<p>يبقى ما يلي <strong>على جهازك فقط</strong>، في تخزين متصفّحك:</p>
<ul>
  <li><strong>الحسابات المحفوظة</strong> التي تختار حفظها (أعداد الورثة، المذهب المختار، اسم الحساب). تُخزَّن في IndexedDB.</li>
  <li><strong>تفضيل المظهر</strong> (فاتح / داكن / النظام) و<strong>تفضيل اللغة</strong> (عربي / إنجليزي). تُخزَّن في localStorage.</li>
</ul>
<p>يمكنك حذف الحسابات المحفوظة في أي وقت من صفحة الإعدادات. مسح بيانات الموقع من متصفّحك يزيل كل ما خزّنه فيرشير.</p>

<h2>المشاركة وتصدير PDF</h2>
<p>عند الضغط على <strong>مشاركة</strong>، تُشفَّر حسابك في جزء من الرابط ويُمرَّر إلى لوحة المشاركة الأصلية في جهازك (أو يُنسخ إلى الحافظة). لا نرى الرابط أبدًا؛ ينتقل مباشرة من متصفّحك إلى من تشاركه معه.</p>
<p>عند الضغط على <strong>تصدير PDF</strong>، يُنشَأ ملف PDF داخل متصفّحك بالكامل ويُنزَّل كملف. لا يُرفع أي شيء.</p>

<h2>أدوات الطرف الثالث</h2>
<p>لا تستخدم فيرشير على الويب <strong>أي أدوات تحليل أو إعلانات أو تتبّع من طرف ثالث</strong>.</p>

<h2>خصوصية الأطفال</h2>
<p>لا تجمع فيرشير معلومات عن قصد من أي شخص، بمن فيهم الأطفال دون الثالثة عشرة. التطبيق مناسب للاستخدام التعليمي في أي سن.</p>

<h2>تغييرات على هذه السياسة</h2>
<p>إن غيّرنا هذه السياسة سنحدّث تاريخ "آخر تحديث" أعلاه. ستُعلَن التغييرات الجوهرية على <a href="https://guigalabs.com/blog">guigalabs.com/blog</a>.</p>`,
    },
  } as const;

  const content = $derived(CONTENT[i18n.current]);
</script>

<svelte:head>
  <title>{content.kicker} · FairShare</title>
  <meta name="description" content={content.metaDescription} />
  <link rel="canonical" href={pageUrl(page.url.pathname)} />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">{content.kicker}</p>
    <h1>{content.title}</h1>
    <p class="meta">{content.lastUpdated}</p>
  </header>

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
    margin-bottom: 2rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .meta {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
</style>
