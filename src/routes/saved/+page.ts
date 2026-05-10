import { redirect } from "@sveltejs/kit";

// Saved calculations are a Pro feature now (cloud-synced cases at /app/cases).
// Bookmarked /saved URLs route to the pricing page so visitors see the upgrade.
export const prerender = false;

export const load = () => {
  redirect(308, "/pricing");
};
