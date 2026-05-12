// Stub for `$app/state` under vitest. SvelteKit's virtual module doesn't
// resolve outside `vite dev` / `vite build`, so vitest needs this alias
// for any module that transitively reads the reactive `page` store
// (e.g. i18n.current → page.data.lang).
export const page = {
  url: new URL("https://fairshare.guigalabs.com/"),
  params: {},
  route: { id: null },
  status: 200,
  error: null,
  data: { lang: "en" },
  state: {},
  form: null,
};

export const navigating = null;
export const updated = { current: false, check: async () => false };
