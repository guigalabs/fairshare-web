// Stub for `$app/environment` under vitest. SvelteKit's virtual module doesn't
// resolve outside `vite dev` / `vite build`, so vitest needs this alias when
// any test transitively imports a module that reads `browser`.
export const browser = false;
export const dev = false;
export const building = false;
export const version = "test";
