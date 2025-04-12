<script>
    import { nodes } from "$lib/store";
    import JobDetails from "./JobDetails.svelte";
    import StageDetails from "./StageDetails.svelte";

    export let open = false;
</script>

<div class="wrapper" class:open>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="tab" on:click={() => (open = !open)}>
        <span class="codicon codicon-book"></span>
    </div>
    <div class="panel">
        {#each $nodes.filter((n) => n.selected) as node (node.id)}
            <!-- content here -->
            {#if node.data.type == "stage"}
                <StageDetails node={node.data} />
            {:else}
                <JobDetails node={node.data} />
            {/if}
        {:else}
            <i>Nothing's here...</i>
        {/each}
    </div>
</div>

<style>
    .wrapper {
        --gutter-size: 15px;
        --panel-size: 300px;
        --tab-button-size: 30px;

        top: var(--gutter-size);
        right: calc(0px - var(--panel-size));
        min-height: calc(var(--tab-button-size) * 2);
        max-height: calc(100% - var(--gutter-size) * 2);
        width: calc(var(--panel-size) + var(--tab-button-size));
        position: fixed;
        transition: right 0.2s ease;
    }
    .wrapper.open {
        right: var(--gutter-size);
    }
    .wrapper .panel {
        background: #457;
        top: 0;
        left: var(--tab-button-size);
        position: absolute;
        height: 100%;
        width: var(--panel-size);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border-radius: 0px 5px 5px 5px;
    }
    .wrapper .tab {
        height: var(--tab-button-size);
        width: calc(var(--tab-button-size) + 1px); /* add 1px because of a weird rendering thing */
        background: linear-gradient(to right, #457 0%, #457 50%, #457);
        transition: background 0.2s ease;
        border-radius: 3px 0px 0px 3px;
        border: none;
        color: white;
        cursor: pointer;
        text-align: center;
        line-height: var(--tab-button-size);
    }
    .wrapper .tab:hover {
        background: linear-gradient(to right, #568 0%, #568 50%, #457);
    }
    .wrapper .tab:active {
        background: linear-gradient(to right, #346 0%, #346 50%, #457);
    }
    .wrapper .tab span {
        text-align: center;
        line-height: var(--toolbar-button-size);
        width: var(--toolbar-button-size);
        font-size: calc(var(--toolbar-button-size) - 10px);
    }
</style>
