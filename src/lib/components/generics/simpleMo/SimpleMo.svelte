<script lang="ts">
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {toDisplayString} from  '../../../services/common/util/string.utils.js'
  import type {MoViewMode} from  '../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {page} from '$app/state'
  import {CommonFieldDefs as fd} from '../../../models/fields/CommonFieldDefinition.js'
  import Field from  '../field/Field.svelte'
  import {Rezult} from  '../../../services/common/message/rezult.js'
  import {ErrorName} from  '../../../services/common/message/errorName.js'
  import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  
  export let mo: Mo
  let viewMode: MoViewMode = extractViewMode()
  $: disabled = viewMode === 'view'
  let moMeta = mo.moMeta
  let moDef = mo.moMeta.moDef
  const title = toDisplayString(moDef.name)
  const fieldDefs: FieldDefinition<any>[] = Array.from(moDef.fieldDefs.values()) as FieldDefinition<any>[]
  const ui = {}

  function extractViewMode(): MoViewMode {
    const pathParts = page.url.pathname.split('/')
    const pathTail = pathParts[pathParts.length - 1]
    if (pathTail === 'edit') return 'edit'
    if (pathTail === 'create') return 'create'
    return 'view'
  }
  
  const onChange = (fieldId: string, val: any): void => {
    const fieldPathNames = fieldId.split('.')
    let targetObj: any = mo
    if (fieldPathNames.length === 0) throw new Rezult(ErrorName.missing_param, {
      method: 'Mo.svelte.onChange()',
      fieldId
    })
    let fname: any = fieldPathNames.pop()
    for (const pathName of fieldPathNames) {
      // for (let i=0; i<fieldPathNames.length -1 ; i++) {
      //   const pathName = fieldPathNames[i]
      const pathval = (Array.isArray(pathName)) ? Number.parseInt(pathName) : pathName
      targetObj = targetObj[pathval]
    }
    targetObj[fname] = val
  }

  const edit = () => {
    viewMode = 'edit'
    goto(`/mo/${moDef.name}/${mo.id}/edit`)
    // history.replaceState(history.state, '', `/mo/${moDef.name}/${mo.id}/edit`);
  }
  const save = () => {
    moMeta.dataSource?.saveMo(mo).then(mo => {
      goto(`/mo/${moDef.name}/${mo.id}`)
      // viewMode = 'view'
    })
  }
  const create = event => {
    moMeta.dataSource?.addMo(mo).then(mo => {
      goto(`/mo/${moDef.name}/${mo.id}`)
      // viewMode = 'view'
    })
  }
  const deleteItem = (fname, i) => {
    mo[fname] = mo[fname].filter((item,index) => index != i)
    goto(`/mo/${moDef.name}`)
  }
</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1>SimpleMo</h1>
<div class="mo">
  <div class="fields">
  {#each fieldDefs as fieldDef}
    {@const fname = fieldDef.name}
    {@const value = mo[fieldDef.name]}
<!--    <Field value="aaa"></Field>-->
    <Field fieldDef={fieldDef} {value} {viewMode} {onChange} level={0} />
  {/each}
  </div>
  <div class="button-bar">
    {#if viewMode === 'view' }
      <button onclick={edit}>Edit</button>
    {:else if viewMode === 'edit'}
      <button onclick={save}>Save</button>
    {:else if viewMode === 'create'}
      <button onclick={create}>Create</button>
    {/if}
  </div>
</div>
<style>
  .mo {
    max-width: 40rem;
    padding: 0 1rem 0 0;
    
    .fields {
      display: flex;
      flex-direction: column;
    }
  }
  .button-bar {
    display: flex;
    margin: 1rem 0;
    justify-content: flex-end;
  
    button {
      height: 2rem;
    }
  }

</style>