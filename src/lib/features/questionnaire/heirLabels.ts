import type { HeirType } from "$engine";
import { t } from "$lib/i18n/index.svelte";

export function labelFor(type: HeirType, count: number): string {
  const label = t(`heir.${type}`);
  if (count === 1) return label;
  return t("heir.count", { count, label });
}
