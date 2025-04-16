<script>
    import { onMount } from "svelte";

    export let node;
    export let open = true;

    /** @type {HTMLDivElement} */
    let details;

    /** @param {boolean|undefined} [force=undefined] */
    export function toggleDetails(force = undefined) {
        if (details === undefined) return;

        open = details.classList.toggle("open", force);
        details.style.height = open ? `${details.scrollHeight}px` : "0px";
    }

    onMount(() => {
        details.style.minHeight = `${details.querySelector(".header")?.scrollHeight}px`;
        toggleDetails(open);
    });
</script>

<div class="details open" bind:this={details}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="header" aria-label="Open Group" on:click={() => toggleDetails()}>
        <span class="codicon codicon-chevron-right"></span>
        {node.data.name}
    </div>
    <div class="data">
        <slot />
    </div>
</div>

<style>
    .details {
        overflow: hidden;
        transition: height 0.2s ease;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .details > .header {
        /* padding: 5px; */
        display: flex;
        align-items: center;
        justify-self: start;
        width: 100%;
        gap: 5px;
        cursor: pointer;
    }
    .details > .header span {
        transition: transform 0.2s ease;
    }
    .details.open > .header span {
        transform: rotate(90deg);
    }
    .details > .data {
        padding: 0px 0px 0px 18px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>
