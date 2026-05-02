// PWA install prompt helper.
//
// Listens for `beforeinstallprompt` (Chrome/Edge/Android), holds the deferred
// event reactively so the UI can offer an Install button. iOS Safari has no
// programmatic install — for that audience we surface a hint to use the
// Share -> Add to Home Screen flow instead.

import { browser } from "$app/environment";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

class PwaStore {
  promptEvent: BeforeInstallPromptEvent | null = $state(null);
  installed: boolean = $state(false);
  isStandalone: boolean = $state(false);
  isIos: boolean = $state(false);

  init(): void {
    if (!browser) return;

    this.isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.promptEvent = e as BeforeInstallPromptEvent;
    });

    window.addEventListener("appinstalled", () => {
      this.promptEvent = null;
      this.installed = true;
    });
  }

  /** True when we have a deferred prompt OR can show iOS instructions. */
  get canInstall(): boolean {
    if (this.installed || this.isStandalone) return false;
    return this.promptEvent !== null || this.isIos;
  }

  /** Triggers the native install prompt (desktop/Android only). */
  async install(): Promise<"accepted" | "dismissed" | "ios"> {
    if (this.isIos) return "ios";
    if (!this.promptEvent) return "dismissed";
    await this.promptEvent.prompt();
    const choice = await this.promptEvent.userChoice;
    this.promptEvent = null;
    return choice.outcome;
  }
}

export const pwa = new PwaStore();
