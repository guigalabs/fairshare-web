import { signIn } from "$lib/server/auth";

export const prerender = false;

export const actions = { default: signIn };
