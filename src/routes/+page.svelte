<script>
    import { SvelteFlowProvider } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import "@vscode/codicons/dist/codicon.css";
    import Flow from "$lib/components/Flow.svelte";
    import Toolbar from "$lib/components/Toolbar.svelte";

    import { colorMode } from "$lib/store";
    import Sidebar from "$lib/components/sidebar/Sidebar.svelte";
</script>

<div class="app {$colorMode}">
    <SvelteFlowProvider>
        <Flow />
        <Toolbar />
        <Sidebar />
    </SvelteFlowProvider>
</div>

<style>
    .app {
        --color: #000;
        --background: #ddd;

        --node-border: #999;

        width: 100%;
        height: 100%;
    }
    .app.dark {
        --color: #fff;
        --background: #333;
    }
</style>
