<script>
    import { onMount } from "svelte";
    import Details from "./Details.svelte";
    import JobDetails from "./JobDetails.svelte";

    export let node;
    export let open = true;

    // BUG: When we dynamically chage the size of child panels, this panel doesn't get updated!
</script>

<Details {node} {open}>
    {#each node.data.children as child}
        <JobDetails node={child} open={false} />
    {/each}
</Details>
