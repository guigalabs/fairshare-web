// JSON-LD helpers — used in <svelte:head>{@html serialiseJsonLd(...)}.
// Always escape "</" so a stray closing-script sequence in data can never
// terminate the inline <script> tag.

const SITE = "https://fairshare.guigalabs.com";

export function serialiseJsonLd(data: object): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

interface ArticleArgs {
  url: string;
  title: string;
  description: string;
  publishedISO?: string;
  modifiedISO?: string;
  image?: string;
}

export function articleSchema(a: ArticleArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.publishedISO,
    dateModified: a.modifiedISO ?? a.publishedISO,
    author: { "@type": "Organization", name: "Guiga Labs", url: SITE },
    publisher: { "@type": "Organization", name: "Guiga Labs", url: SITE },
    mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
    image: a.image ? [a.image] : undefined,
  };
}

export function howToSchema(args: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqSchema(qas: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FairShare: Islamic Inheritance Calculator",
    applicationCategory: "ReferenceApplication",
    applicationSubCategory: "EducationalApplication",
    operatingSystem: "Web, iOS",
    url: SITE,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    inLanguage: ["en", "ar"],
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: "Guiga Labs", url: "https://guigalabs.com" },
  };
}

// Site-wide Organization. Lives at @id #organization so other schema
// blocks (Article.publisher, SoftwareApplication.publisher) can reference
// it instead of duplicating fields.
export function organizationSchema(sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://guigalabs.com/#organization",
    name: "Guiga Labs",
    url: "https://guigalabs.com/",
    logo: `${SITE}/icons/pwa-512.png`,
    founder: {
      "@type": "Person",
      name: "Mohammed Guiga",
    },
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "FairShare",
    url: `${SITE}/`,
    inLanguage: ["en", "ar"],
    publisher: { "@id": "https://guigalabs.com/#organization" },
  };
}

export function personSchema(args: {
  name: string;
  jobTitle?: string;
  worksFor?: { name: string; url: string };
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: args.name,
    jobTitle: args.jobTitle,
    worksFor: args.worksFor
      ? { "@type": "Organization", name: args.worksFor.name, url: args.worksFor.url }
      : undefined,
    sameAs: args.sameAs,
  };
}
