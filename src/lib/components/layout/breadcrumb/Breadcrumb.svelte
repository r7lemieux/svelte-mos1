<script lang="ts">
  export let nodes: { id: any, name: string }[] = []
  export let nodeSelected: (id: number) => Promise<boolean>
  export const addChild = (id: number, name: string, replace = false) => {
    // if (parentIds) {
    //   const parentIndex = parentIds.find(parentId => nodes.findIndex(n => n.id === parentId))
    //   if (parentIndex) {
    //     nodes = [...nodes.slice(0, parentIndex + 1)]
    //   }
    // }
    if (replace) {
      nodes = nodes.slice(0, nodes.length - 1)
    }
    nodes = [...nodes, {id, name}]
  }
  
  const nodeClicked = id => () => {
    nodeSelected(id)
      .then(success => {
        if (success) {
          const index = nodes.findIndex(n => n.id === id)
          nodes = [...nodes.slice(0, index + 1)]
        }
      })
  }

</script>

<svelte:head>
  <title>Profile</title>
  <meta name="breadcrumb" content="breadcrumb"/>
</svelte:head>
<div>
  {#each nodes as node, i}
    {#if i == nodes.length - 1 }
      <span class="last-node">{node.name}</span>
    {:else}
      <span class="node" onclick={nodeClicked(node.id)} onkeydown={nodeClicked(node.id)} role="button"
            aria-pressed="false" tabindex="0">{node.name} > </span>
    {/if}
  {/each}
</div>
<style>
  .node {
    display: inline;
    margin: 2px 0;
  }
  .last-node {
    display: inline;
    margin: 2px 0;
    font-weight: bold;
  }
</style>