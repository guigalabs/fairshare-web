import { error } from "@sveltejs/kit";
import { METHODOLOGY, findEntry } from "$lib/content/methodology";
import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () => {
  return METHODOLOGY.map((e) => ({ group: e.group, topic: e.slug }));
};

export const load: PageLoad = ({ params }) => {
  const entry = findEntry(params.group, params.topic);
  if (!entry) throw error(404, "Article not found");
  return { entry };
};
