<script>
    import { onMount } from "svelte";
    import Details from "./Details.svelte";
    import JobDetails from "./JobDetails.svelte";

    export let node;
    export let open = true;

    // BUG: When we dynamically chage the size of child panels, this panel doesn't get updated!
    // HACK: We are fixing this by pulling the jobs out of the stage for now...
</script>

<div class="stage">
    <Details {node} {open}></Details>
    {#each node.data.children as child}
        <JobDetails node={child} open={false} />
    {/each}
</div>

<style>
    .stage {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
    }
</style>
