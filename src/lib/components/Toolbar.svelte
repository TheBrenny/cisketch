<script>
    import { colorMode, useDnD, addJobNode } from "$lib/store.js";
    import { useStore, useSvelteFlow } from "@xyflow/svelte";
    import { onMount } from "svelte";

    const { zoomIn, zoomOut, fitView, nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
    const { screenToFlowPosition } = useSvelteFlow();
    const viewportMoveSpeed = 250;

    const type = useDnD();

    const flowControl = {
        switchColorMode: () => {
            $colorMode = $colorMode === "light" ? "dark" : "light";
        },
        zoomIn: () => zoomIn({ duration: viewportMoveSpeed }),
        zoomOut: () => zoomOut({ duration: viewportMoveSpeed }),
        fitView: () => fitView({ duration: viewportMoveSpeed }),
        lockObjects() {
            flowControl.isLocked = !flowControl.isLocked;
            nodesDraggable.set(!flowControl.isLocked);
            nodesConnectable.set(!flowControl.isLocked);
            elementsSelectable.set(!flowControl.isLocked);
        },
        isLocked: false,
    };

    /** @type {{ [key: string]: HTMLElement | undefined }} */
    const groups = {
        home: undefined,
        flowControl: undefined,
    };

    /** @param {HTMLElement|undefined} group @param {boolean|undefined} [force=undefined] */
    function toggleGroup(group, force = undefined) {
        if (group === undefined) return;

        let open = group.classList.toggle("open", force);
        group.style.height = open ? `${group.scrollHeight}px` : "0px";
    }

    /** @param {DragEvent} event @param {string} nodeType  */
    function onDragStart(event, nodeType) {
        if (!event.dataTransfer) return null;

        type.set(nodeType);
        event.dataTransfer.effectAllowed = "move";
    }

    /** @param {string} type */
    function addNodeInMiddle(type) {
        const position = screenToFlowPosition({ x: document.body.clientWidth / 2, y: document.body.clientHeight / 2 });
        addJobNode({ id: `${Date.now()}`, type, position, data: { name: "Humble " + type } });
    }

    onMount(() => {
        toggleGroup(groups.home, true);
        toggleGroup(groups.flowControl, true);
    });
</script>

<div class="toolbar">
    <button aria-label="Add Job" on:click={() => addNodeInMiddle("job")} on:dragstart={(event) => onDragStart(event, "job")} draggable={true}>
        <span class="codicon codicon-symbol-method"></span>
    </button>
    <button aria-label="Add Stage" on:click={() => addNodeInMiddle("stage")} on:dragstart={(event) => onDragStart(event, "stage")} draggable={true}>
        <span class="codicon codicon-browser"></span>
    </button>
    <hr />
    <button aria-label="Open Group" on:click={() => toggleGroup(groups.home)}>
        <span class="codicon codicon-menu"></span>
    </button>
    <div class="toolbar-group open" bind:this={groups.home} data-elements="9">
        <button disabled aria-label="Home">
            <span class="codicon codicon-home"></span>
        </button>
        <button disabled aria-label="Account">
            <span class="codicon codicon-account"></span>
        </button>
        <button disabled aria-label="Settings">
            <span class="codicon codicon-gear"></span>
        </button>
        <hr />
        <button disabled aria-label="New">
            <span class="codicon codicon-new-file"></span>
        </button>
        <button disabled aria-label="Load">
            <span class="codicon codicon-go-to-file"></span>
        </button>
        <button disabled aria-label="Save">
            <span class="codicon codicon-save"></span>
        </button>
        <button disabled aria-label="Duplicate">
            <span class="codicon codicon-copy"></span>
        </button>
        <button aria-label="Export">
            <span class="codicon codicon-export"></span>
        </button>
    </div>
    <hr />
    <button aria-label="Open Group" on:click={() => toggleGroup(groups.flowControl)}>
        <span class="codicon codicon-compass"></span>
    </button>
    <div class="toolbar-group open" bind:this={groups.flowControl} data-elements="5">
        <button aria-label="Colour Mode" on:click={flowControl.switchColorMode}>
            <span class="codicon codicon-color-mode"></span>
        </button>
        <button aria-label="Zoom In" on:click={flowControl.zoomIn}>
            <span class="codicon codicon-zoom-in"></span>
        </button>
        <button aria-label="Zoom Out" on:click={flowControl.zoomOut}>
            <span class="codicon codicon-zoom-out"></span>
        </button>
        <button aria-label="Reset View" on:click={flowControl.fitView}>
            <span class="codicon codicon-symbol-variable"></span>
        </button>
        <button aria-label="Lock Objects" on:click={flowControl.lockObjects}>
            <span class="codicon {flowControl.isLocked ? 'codicon-lock' : 'codicon-unlock'}"></span>
        </button>
    </div>
</div>

<style>
    .toolbar {
        --hr-color: #FFF;
        --toolbar-size: 40px;
        --toolbar-padding: 5px;
        --toolbar-button-size: calc(var(--toolbar-size) - var(--toolbar-padding) * 2);

        position: fixed;
        top: 15px;
        left: 15px;
        border-radius: 5px;
        width: var(--toolbar-size);
        min-height: var(--toolbar-size);
        background-color: #346;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.75);
        color: white;
        padding: 5px;
        opacity: 0.85;
        transition: opacity 0.2s ease;
    }

    .toolbar,
    .toolbar-group {
        display: flex;
        gap: 5px;
        flex-flow: column;
        align-items: center;
        justify-content: start;
    }

    .toolbar-group {
        --toolbar-size: 34px;
        --toolbar-button-size: calc(var(--toolbar-size) - var(--toolbar-padding) * 2);
        padding: 0px 3px;
        overflow: hidden;
        border: 1px solid #00000033;
        transition:
            height 0.2s ease,
            padding 0.2s ease;
    }

    .toolbar-group.open {
        padding: 3px 3px;
    }

    .toolbar:hover {
        opacity: 1;
    }

    .toolbar button {
        width: var(--toolbar-button-size);
        height: var(--toolbar-button-size);
        background: #457;
        transition: all 0.2s ease;
        border-radius: 3px;
        border: none;
        color: white;
        cursor: pointer;
        text-align: center;
        line-height: var(--toolbar-button-size);
    }
    .toolbar button[disabled] {
        filter: brightness(0.65);
        cursor: default;
    }
    .toolbar button:not([disabled]):hover {
        background: #568;
    }
    .toolbar button:not([disabled]):active {
        background: #457;
    }
    .toolbar button span {
        text-align: center;
        line-height: var(--toolbar-button-size);
        width: var(--toolbar-button-size);
        font-size: calc(var(--toolbar-button-size) - 10px);
    }
</style>
