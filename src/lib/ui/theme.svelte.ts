// Theme controller. Persists to localStorage; reactive via Svelte 5 runes.
// Three settings: "system" (follow OS), "light", "dark".

import { browser } from "$app/environment";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "fairshare:theme";

function readStored(): ThemeMode {
  if (!browser) return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

function applyTheme(mode: ThemeMode): void {
  if (!browser) return;
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

class ThemeStore {
  mode: ThemeMode = $state(readStored());

  constructor() {
    if (browser) {
      applyTheme(this.mode);
      $effect.root(() => {
        $effect(() => {
          applyTheme(this.mode);
          localStorage.setItem(STORAGE_KEY, this.mode);
        });
      });
    }
  }

  set(mode: ThemeMode): void {
    this.mode = mode;
  }
}

export const theme = new ThemeStore();
