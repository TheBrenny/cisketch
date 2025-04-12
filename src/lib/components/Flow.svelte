<script>
    import { colorMode, useDnD, nodeTypes, nodes, edges, addJobNode, deleteNodes } from "$lib/store";
    import { Background, BackgroundVariant, MiniMap, SvelteFlow, useSvelteFlow } from "@xyflow/svelte";

    /** @type {[number,number]} */
    const snapGrid = [10, 10];

    const { screenToFlowPosition, getIntersectingNodes, deleteElements } = useSvelteFlow();
    const type = useDnD();

    /** @param {DragEvent} e */
    function onDragOver(e) {
        e.preventDefault();

        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    }
    /** @param {DragEvent} e */
    function onDrop(e) {
        e.preventDefault();
        if (!$type) return;

        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        addJobNode({ id: `${Date.now()}`, type: $type, position, data: { name: "Humble " + $type } });
    }

    /** @param {CustomEvent<{targetNode: any, nodes: any[], event: MouseEvent|TouchEvent}>} e */
    function onNodeDrag({}) {
        let targets = $nodes.filter((n) => n.type === "job" && n.selected);
        if (targets.length === 0) return;
        const intersections = targets.flatMap((t) => getIntersectingNodes(t).map((n) => n.id)).filter((n, i, a) => a.indexOf(n) === i); // gets all items and dedupes

        let found = false;
        for (const n of $nodes) {
            if (n.type === "stage") {
                if (!found && intersections.includes(n.id)) {
                    n.data = {
                        ...n.data,
                        intersecting: true,
                    };
                    found = true;
                } else n.data = { ...n.data, intersecting: false };
            }
        }

        $nodes = $nodes;
        $edges = $edges;
    }
    /** @param {CustomEvent<{targetNode: any, nodes: any[], event: MouseEvent|TouchEvent}>} e */
    function onNodeDrop({}) {
        // returns an array of selected nodes in the form of [target, index in $nodes]
        let targets = $nodes.map((n, i) => [n, i]).filter(([n, _]) => n.type === "job" && n.selected);
        if (targets.length === 0) return;
        const intersections = targets.flatMap(([t, _]) => getIntersectingNodes(t).map((n) => n.id)).filter((n, i, a) => a.indexOf(n) === i); // gets all intersecting ids and dedupe

        let found = false;

        for (let i = 0; i < $nodes.length; i++) {
            let n = $nodes[i];
            if (n.type === "stage" && intersections.includes(n.id)) {
                // add all our targets as children
                n.data = {
                    ...n.data,
                    children: [...(n.data.children ?? []), ...targets.map(([t, _]) => ({ id: t.id, data: t.data }))],
                };
                
                deleteNodes(targets.map(([t, _]) => t.id));
                found = true;
                break;
            }
        }

        if (!found) {
            // remove parent, and remove from children
            /** @type {string[]} */
            let parents = [];
            targets.forEach(([t, i]) => {
                if (t.data.parent) {
                    parents.push(t.data.parent);
                    t.data = {
                        ...t.data,
                        parent: undefined,
                    };
                    t = { ...t, parentId: undefined, extent: undefined };
                    $nodes[i] = t;
                }
            });
            // dedupe parents
            parents = parents.filter((p, i, a) => a.indexOf(p) === i);

            // remove nodes from the childrens
            $nodes.forEach((n) => {
                if (!parents.includes(n.id)) return;
                n.data = {
                    ...n.data,
                    children: n.data.children.filter((/** @type {any} */ c) => targets.find(([t]) => t.id === c.id) === undefined), // filter in targets that don't match
                };
            });
        }

        console.log($nodes);

        $nodes = $nodes;
        $edges = $edges;
    }
</script>

<div style:height="100%">
    <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        {snapGrid}
        colorMode={$colorMode}
        proOptions={{ hideAttribution: true }}
        on:dragover={onDragOver}
        on:drop={onDrop}
        on:nodedrag={onNodeDrag}
        on:nodedragstop={onNodeDrop}
        selectionKey="Shift"
        multiSelectionKey="Shift"
        deleteKey={"Delete"}
    >
        <Background gap={10} variant={BackgroundVariant.Dots} />
        <MiniMap position="bottom-left" />
    </SvelteFlow>
</div>

<style>
</style>
