<script>
    import Details from "./Details.svelte";

    export let node;
    export let open = true;
</script>

<Details {node} {open}>
    ID: {node.id}
</Details>
