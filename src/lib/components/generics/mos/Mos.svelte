<script lang='ts'>
  import {onMount} from 'svelte'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import {MoListModel} from '../../../models/managedObjects/MoList.model.js'
  import MosGrid from '../mosGrid/MosGrid.svelte'
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {goto} from '$app/navigation'
  import {type MoMetaInterface} from '../../../models/managedObjects/MoMetaInterface.js'
  
  
  export let mos: Mo[] = []
  export let moMeta: MoMetaInterface
  moMeta = moMeta || mos[0]?.moMeta
  if (moMeta && !mos) {
    moMeta.dataSource?.getMos()
      .then(allMos => {
				mos = allMos
			})
  }
  let displayName = moMeta?.moDef.getDisplayName()
  let modelReady: (model: MoListModel) => boolean
  // export class Mos extends SvelteComponentTyped<{propertyName: string;}> {
  const moListModel = new MoListModel(moMeta)
  moListModel.mos = mos

  const createMo = () => {
    goto(`/mo/${moMeta.name}/create`)
  }

  const f2 = (k, v) => (k && v) && (k == 'dataSource' || typeof v !== "number") ? "" + v : v
  let names: string[] = []
  onMount(() => {
    displayName = moMeta.moDef?.getDisplayName()
    names = mos.map( m => `moMeta: ${m.moMeta.name} moDef ${m.moMeta.moDef?.name} dataSource ${m.moMeta.dataSource?.constructor.name}`)
     modelReady(moListModel)
  })


</script>

<svelte:head>
  <title>Mos</title>
  <meta name='description' content={displayName}/>
</svelte:head>

<div class="grid-top">
  {#if moMeta?.moDef.canCreate}
    <button onclick={createMo}>Create {displayName}</button>
  {/if}
</div>

<div>Mos.svelte</div>
<div>{names}</div>
<!--<div>moListModel: {JSON.stringify(moListModel, null, 2)}</div>-->
<MosGrid bind:modelReady/>

<style>
  .grid-top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.2rem;
    
    button {
      height: 2.8rem;
      padding: 0 1rem;
    }
  }
</style>

