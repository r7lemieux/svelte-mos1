<script lang="ts">
  import {toDisplayString} from  '../../../services/common/util/string.utils.js'
  import type {MoDefinition} from '../../../models/managedObjects/MoDefinition.js'
  import type {MoMeta} from '../../../models/managedObjects/MoMeta.js'
  import Init from '../../common/Init.svelte'

  export let moMeta: MoMeta
  const title = toDisplayString(moMeta.name)
  const fieldDefs = Array.from(moMeta.moDef.fieldDefs.values())
  const mo = moMeta.newMo()
  const onChange = event => {
    const fieldname = event.srcElement.id
    const value = event.srcElement.value
    mo[fieldname] = value
  }
  const create = event => {
    moMeta.dataSource?.addMo(mo)
  }
</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<Init/>
<div class="create">
  {#each fieldDefs as fd}
    <div class="field">
      <label for={fd.name}>{fd.getDisplayName()}</label>
      <input type={fd.inputType} id="{fd.name}" value={mo[fd.name]|| ''} onchange={onChange}/>
    </div>
  {/each}
  <div class="button-bar">
    <button onclick={create}>Create</button>
  </div>
</div>
<style>
  .create {
    max-width: 40rem;
    
    .field {
      display: grid;
      grid-template-columns: minmax(5rem, 10rem) 1fr;
      grid-template-rows: 2.5rem;
      gap: 0.5rem;
      
      label {
        place-self: center end;
      }
      
      input {
        place-self: center stretch;
        height: 2rem;
        border: 1px solid #DDE;
        padding: 0 0.5rem;
      }
    }
  }
</style>