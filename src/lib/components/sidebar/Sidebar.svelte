<script>
    import { nodes } from "$lib/store";
    import { onMount } from "svelte";
    import JobDetails from "./JobDetails.svelte";
    import StageDetails from "./StageDetails.svelte";

    export let open = false;

    onMount(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key == "d") open = !open;
        });
    });
</script>

<div class="sidebar" class:open>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="tab" on:click={() => (open = !open)}>
        <span class="codicon codicon-book"></span>
    </div>
    <div class="panel">
        {#each $nodes.filter((n) => n.selected) as node (node.id)}
            <!-- content here -->
            {#if node.type == "stage"}
                <StageDetails {node} />
            {:else}
                <JobDetails {node} />
            {/if}
        {:else}
            <i>Nothing has been selected...</i>
        {/each}
    </div>
</div>

<style>
    .sidebar {
        --gutter-size: 15px;
        --panel-size: 370px;
        --tab-button-size: 32px;

        top: var(--gutter-size);
        right: calc(0px - var(--panel-size));
        /* overflow: auto; */
        width: calc(var(--panel-size) + var(--tab-button-size));
        position: fixed;
        transition:
            right 0.2s ease,
            opacity 0.2s ease;
        filter: drop-shadow(0px 0px 7px 0px rgba(0, 0, 0, 0.75));
        opacity: 0.7;
    }
    .sidebar:hover {
        opacity: 1;
    }
    .sidebar.open {
        right: var(--gutter-size);
    }
    .sidebar > .panel {
        background: #457;
        top: 0;
        left: var(--tab-button-size);
        position: absolute;
        width: var(--panel-size);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border-radius: 0px 5px 5px 5px;
        min-height: calc(var(--tab-button-size));
        max-height: calc(100vh - var(--gutter-size) * 2);
    }
    .sidebar > .tab {
        height: calc(var(--tab-button-size));
        width: calc(var(--tab-button-size) + 10px); /* add 10px to hide the border radius of the panel*/
        background: linear-gradient(to right, #457 0%, #457 50%, #457);
        transition: background 0.2s ease;
        border-radius: 3px 0px 0px 3px;
        border: none;
        color: white;
        cursor: pointer;
        text-align: left;
        line-height: calc(var(--tab-button-size) + 2px);
    }
    .sidebar > .tab:hover {
        background: linear-gradient(to right, #568 0%, #568 50%, #457);
    }
    .sidebar > .tab:active {
        background: linear-gradient(to right, #346 0%, #346 50%, #457);
    }
    .sidebar > .tab > span {
        text-align: center;
        line-height: var(--tab-button-size);
        width: var(--tab-button-size);
        font-size: calc(var(--tab-button-size) - 13px);
    }
</style>
