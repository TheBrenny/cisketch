import {writable} from "svelte/store";

/** @type {import("svelte/store").Writable<null|string>} */
export const dndType = writable(null);