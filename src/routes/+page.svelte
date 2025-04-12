<script>
    import { SvelteFlowProvider } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import "@vscode/codicons/dist/codicon.css";
    import Flow from "$lib/components/Flow.svelte";
    import Toolbar from "$lib/components/Toolbar.svelte";

    import { onMount } from "svelte";
    import DnDProvider from "$lib/components/DnDProvider.svelte";
    import { colorMode } from "$lib/store";

    let mouseX = 0;
    let mouseY = 0;

    onMount(() => {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    });
</script>

<div class="wrapper {$colorMode}">
    <SvelteFlowProvider>
        <DnDProvider>
            <Flow />
            <Toolbar />
        </DnDProvider>
    </SvelteFlowProvider>
</div>

<style>
    .wrapper {
        --color: #000;
        --background: #ddd;

        --node-border: #999;

        width: 100%;
        height: 100%;
    }
    .wrapper.dark {
        --color: #fff;
        --background: #333;
    }
</style>
