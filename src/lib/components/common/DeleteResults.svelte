<script>
  import {page} from '$app/state'
  
  let {results} = $props()
  const deletedMos = results.deleted
  const errors = results.errors
</script>
<svelte:head>
  <title>MoDefs</title>
  <meta name="description" content="metas"/>
</svelte:head>
{#if deletedMos}
  <h3>Deleted</h3>
  <div class="deleted">
    {#each deletedMos as mo}
      <span class="moname">{mo.metaMo.name}</span>
      <span class="id">{mo.id}</span>
      <span class="name">{mo.displayName}</span>
    {/each}
  </div>
{/if}

{#if errors}
  <h3>Failed to delete</h3>
  <div class="errors">
    {#each errors as err}
      <span class="moname">{err.data.moname}</span>
      <span class="id">{err.data.id}</span>
      <span class="name">{err.data.displayName}</span>
      <span class="error">{err.name}</span>
    {/each}
  </div>
{/if}

<style>
  .deleted {
    display: grid;
    grid-template-columns: [mo] 12rem [id] 3rem [name] auto [end];
  }
  
  .errors {
    display: grid;
    grid-template-columns: [mo] 12rem [id] 3rem [name] 12rem [error] 10rem [end]
  }
</style>