// Read once at module load. Svelte transitions are JS-driven and bypass the
// global CSS reduced-motion override, so callsites that drive transitions need
// to gate them on this value explicitly.
export const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
