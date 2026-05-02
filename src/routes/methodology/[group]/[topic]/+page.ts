import { error } from "@sveltejs/kit";
import { METHODOLOGY, findEntry } from "$lib/content/methodology";

export const prerender = true;

export function entries() {
  return METHODOLOGY.map((e) => ({ group: e.group, topic: e.slug }));
}

export function load({ params }) {
  const entry = findEntry(params.group, params.topic);
  if (!entry) throw error(404, "Article not found");
  return { entry };
}
