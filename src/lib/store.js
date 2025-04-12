import {getContext} from "svelte";
import {writable} from "svelte/store";
import JobNode from "./components/flow/JobNode.svelte";
import StageNode from "./components/flow/StageNode.svelte";

/** @type {import("svelte/store").Writable<import("@xyflow/svelte").ColorMode>} */
export const colorMode = writable("light");

export const useDnD = () => {
    return getContext("dnd");
}

/** @type {Object<string,any>} */
export const nodeTypes = {
    job: JobNode,
    stage: StageNode,
};

/** @param {import("svelte/store").Writable<import("@xyflow/svelte").NodeProps[]>} node */
export const nodes = writable([]);
export const edges = writable([]);


/** @param {import("@xyflow/svelte").Node} node */
export function addJobNode(node) {
    // @ts-ignore
    nodes.update((nodes) => [...nodes, node]);
}

/** @param {string[]} nodeIDs */
export function deleteNodes(nodeIDs) {
    // @ts-ignore
    nodes.update((n) => n.filter((node) => !nodeIDs.includes(node.id)));
}