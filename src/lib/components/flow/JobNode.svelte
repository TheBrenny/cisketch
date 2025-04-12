<script>
    import {edges, nodes} from "$lib/store";
    import { Handle, Position } from "@xyflow/svelte";

    /** @type {{ name: string; parent: string|undefined; }} */
    export let data;
    export let selected = false;

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

<div class="block" class:selected>
    <Handle type="target" position={Position.Left} id="d" style="top:20px;width:10px;height:10px;" />
    <Handle type="source" position={Position.Right} id="b" style="top:20px;width:10px;height:10px;" />
    <div class="header">
        <span class="codicon codicon-symbol-method"></span>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span on:dblclick={(e) => editContent(e.target)}>{data.name}</span>
    </div>
    <hr />
</div>

<style>
    .block {
        color: var(--color);
        background-color: var(--background);

        padding: 5px;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        border-radius: 3px;
        width: 200px;
        min-height: 50px;
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
</style>
