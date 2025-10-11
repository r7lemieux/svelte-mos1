<script lang='ts'>
  import {onMount} from 'svelte'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import {MoListModel} from '../../../models/managedObjects/MoList.model.js'
  import MosGrid from '../mosGrid/MosGrid.svelte'
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {goto} from '$app/navigation'
  import {type MoMetaInterface} from '../../../models/managedObjects/MoMetaInterface.js'
  
  let {mos, moMeta, title = null, topButtons = false}: {
    mos: Mo[],
    moMeta: MoMetaInterface,
    title?: string | null,
    topButtons?: boolean
  } = $props()
  
  if (title === null) {
    title = moMeta.name
  }
  moMeta = moMeta || mos[0]?.moMeta
  if (moMeta && !mos) {
    moMeta.dataSource?.getMos()
      .then(allMos => {
        mos = allMos
      })
  }
  let displayName = $state(moMeta?.moDef.getDisplayName())
  let modelReadyResolve: (MoListModel) => void
  let modelReady: Promise<MoListModel> = new Promise(resolve => modelReadyResolve = resolve)
  // export class Mos extends SvelteComponentTyped<{propertyName: string;}> {
  const moListModel = new MoListModel(moMeta)
  moListModel.mos = mos
  
  const createMo = () => {
    goto(`/mo/${moMeta.name}/create`)
  }
  
  const f2 = (k, v) => (k && v) && (k == 'dataSource' || typeof v !== 'number') ? '' + v : v
  let names: string[] = $state([])
  onMount(() => {
    displayName = moMeta.moDef?.getDisplayName()
    names = mos.map(m => `moMeta: ${m.moMeta.name} moDef ${m.moMeta.moDef?.name} dataSource ${m.moMeta.dataSource?.constructor.name}`)
    modelReadyResolve(moListModel)
  })


</script>

<svelte:head>
  <title>Mos</title>
  <meta name='description' content={displayName}/>
</svelte:head>

<div class="grid-top">
  {#if title}
    <span class="title">{title}</span>
  {/if}
  <span class="button-bar">
  {#if moMeta?.moDef.canCreate && topButtons}
    <button onclick={createMo}>Create {displayName}</button>
  {/if}
</span>
</div>
<MosGrid modelReady={modelReady}/>

<style>
  .grid-top {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 2rem;
      margin: 1rem 1rem 1rem 0;
      align-content: center;
    }
  }
  
  .button-bar {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
  }
</style>

