// Singleton toast queue. Components push messages with `toast.show("...")`;
// the global <ToastHost /> in the root layout renders them.

export type ToastTone = "info" | "success" | "error";

export interface ToastEntry {
  readonly id: number;
  readonly message: string;
  readonly tone: ToastTone;
}

class ToastStore {
  entries = $state<ToastEntry[]>([]);
  private nextId = 1;

  show(message: string, tone: ToastTone = "info", durationMs = 3000): void {
    const id = this.nextId++;
    this.entries = [...this.entries, { id, message, tone }];
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: number): void {
    this.entries = this.entries.filter((e) => e.id !== id);
  }
}

export const toast = new ToastStore();
