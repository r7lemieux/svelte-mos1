<script lang="ts">
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {toDisplayString} from '../../../services/common/util/string.utils.js'
  import type {MoViewMode} from '../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {page} from '$app/state'
  import {CommonFieldDefs as fd} from '../../../models/fields/CommonFieldDefinition.js'
  import Field from '../field/Field.svelte'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  
  let {mo, autoSave = false}: { mo: Mo, autoSave: boolean } = $props()
  let viewMode: MoViewMode = $state(extractViewMode())
  // let disabled = $derived(viewMode === 'view')
  let moMeta = mo.moMeta
  let moDef = mo.moMeta.moDef
  const title = toDisplayString(moDef.name)
  const fieldDefs: FieldDefinition<any>[] = Array.from(moDef.fieldDefs.values()) as FieldDefinition<any>[]
  const fieldnames = moDef.showFieldnames
  const ui = {}
  
  function extractViewMode(): MoViewMode {
    const pathParts = page.url.pathname.split('/')
    const pathTail = pathParts[pathParts.length - 1]
    if (pathTail === 'edit') return 'edit'
    if (pathTail === 'create') return 'create'
    return 'view'
  }
  
  const onChange = (fieldId: string, val: any): void => {
    if (autoSave) {
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
      save()
    }
  }
  const cancel = () => {
    if (viewMode === 'edit') {
      viewMode = 'view'
      goto(`/mo/${moDef.name}/${mo.id}`)
    } else if (viewMode === 'create') {
      goto(`/mo/${moDef.name}`)
    }
    // history.replaceState(history.state, '', `/mo/${moDef.name}/${mo.id}/edit`);
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
    mo[fname] = mo[fname].filter((item, index) => index != i)
    goto(`/mo/${moDef.name}`)
  }
</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h2 class="title">
  <a href="/mo/{moMeta.name}">{moDef.name}</a>
  <span>{mo.getDisplayName()}</span>
</h2>

<div class="mo">
  <div class="fields">
    {#each fieldnames as fname}
      {@const fieldDef = fieldDefs.find(fd => fd.name === fname)}
      {@const value = mo[fname]}
      {#key value}
        <Field fieldDef={fieldDef} {value} {viewMode} {onChange} level={0}/>
      {/key}
    {/each}
  </div>
  <div class="button-bar">
    {#if viewMode === 'view' }
      <button onclick={edit}>Edit</button>
    {:else if viewMode === 'edit' && !autoSave}
      <button onclick={save}>Save</button>
      <button onclick={cancel}>Cancel</button>
    {:else if viewMode === 'create' && !autoSave}
      <button onclick={save}>Save</button>
      <button onclick={cancel}>Cancel</button>
    {/if}
  </div>
</div>
<style>
  .title {
    display: flex;
    justify-content: left;
    justify-items: left;
    
    a {
      text-decoration: none;
      flex-basis: 8.4rem;
      max-width: 12.3rem;
      flex-shrink: 0;
      flex-grow: 0.2;
      display: inline-block;
      color: var(--field-label-color);
      /*@media screen and (max-width: 800px) {*/
      /*  flex-basis: 9.2rem;*/
      /*  min-width: auto;*/
      /*}*/
    }
  }
  
  .mo {
    max-width: 40rem;
    padding: 0 1rem 0 0;
    
    .fields {
      display: flex;
      flex-direction: column;
    }
  }
  
  .button-bar {
    margin: 2rem 0;
  }

</style>