<script context="module">
</script>

<script>
    import { edges, nodes } from "$lib/store";
    import { Handle, Position } from "@xyflow/svelte";
    import JobNode from "./JobNode.svelte";
    import { useSvelteFlow } from "@xyflow/svelte";

    const { getNodesBounds } = useSvelteFlow();

    /** @type {{ name: string; intersecting: boolean; children: any[] }} */
    export let data;
    export let selected = false;

    let { id } = $$props;
    console.log(id);

    /** @param {any} child @param {number} index */
    function popoutChild(child, index) {
        console.log(id);
        let position = getNodesBounds([id]);
        console.log(position);
        data.children.splice(index, 1);
        data = {
            ...data,
            children: data.children,
        };
        $nodes.push({
            id: child.id,
            type: "job",
            data: child.data,
            selected: false,
            position: { x: position.x + position.width + 10, y: position.y + 50 + index * 50 },
        });
    }

    /** @param {EventTarget|null} element */
    function editContent(element) {
        if (!element) return;
        if (element instanceof HTMLElement) {
            // set editable
            element.contentEditable = "plaintext-only";
            element.focus();
            // select everything
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(element);
            sel?.removeAllRanges();
            sel?.addRange(range);
            // on blur, stop editing
            element.onblur = () => {
                element.contentEditable = "false";
                // update the data and the nodes/edges
                data.name = element.textContent ?? "ERROR: missing!";
                $nodes = $nodes;
                $edges = $edges;
            };
        }
    }
</script>

<div class="block" class:intersecting={data.intersecting} class:selected>
    <Handle type="target" position={Position.Left} id="d" style="top:20px;width:10px;height:10px;" />
    <Handle type="source" position={Position.Right} id="b" style="top:20px;width:10px;height:10px;" />

    <div class="header">
        <span class="codicon codicon-browser"></span>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span on:dblclick={(e) => editContent(e.target)}>{data.name}</span>
    </div>
    <hr />
    <div class="children">
        {#each data.children as child, i}
            <div class="child">
                <JobNode data={child.data} />
                <button aria-label="Pop out" on:click={() => popoutChild(child, i)}>
                    <span class="codicon codicon-redo"></span>
                </button>
            </div>
        {/each}
    </div>
    <div class="placeholder">
        <i>Drag and drop a job...</i>
    </div>
</div>

<style>
    .block {
        color: var(--color);
        background-color: var(--background);

        padding: 5px;
        gap: 5px;

        display: flex;
        flex-direction: column;
        border-radius: 3px;
        width: 260px;
        min-height: 110px;
        border: 1px solid var(--node-border);
    }
    .block.selected {
        border-color: #0000ff;
    }
    .block .header {
        font-weight: 600;

        height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .block hr {
        margin-top: calc(-3px + 0.2em);
    }
    .block .children {
        padding: 0 5px;
        display: flex;
        flex-flow: column;
        gap: 5px;
    }
    .block .children .child {
        --button-size: 30px;

        display: flex;
        flex-flow: row;
        gap: 5px;
        align-items: center;
        justify-content: space-between;
    }
    .block .children .child button {
        width: var(--button-size);
        height: var(--button-size);
        color: var(--color);
        background: #ddddee55;
        transition: all 0.2s ease;
        border-radius: 3px;
        border: none;
        cursor: pointer;
        text-align: center;
        line-height: var(--button-size);
    }
    .block .children .child button[disabled] {
        filter: brightness(0.65);
        cursor: default;
    }
    .block .children .child button:not([disabled]):not(:active):hover {
        background: #eeeeff88;
    }
    .block .children .child button span {
        text-align: center;
        line-height: var(--button-size);
        width: var(--button-size);
        font-size: calc(var(--button-size) - 10px);
    }
    .block .placeholder {
        justify-self: end;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #2222aa;
        min-height: 50px;
        background: #6666ff66;
        border: #2222aaaa 3px dashed;
        border-radius: 10px;
        margin-top: auto;
        flex-grow: 1;

        opacity: 0.6;
        font-size: 0.8em;

        transition: opacity 0.2s ease;
    }
    /* .block .placeholder:hover {
        opacity: 1;
    } */
    .block.intersecting .placeholder {
        opacity: 1;
    }

    :global(.app.dark) .block .placeholder {
        color: #000088;
        background: #6666ff66;
        border: #000088aa 3px dashed;
    }
</style>
