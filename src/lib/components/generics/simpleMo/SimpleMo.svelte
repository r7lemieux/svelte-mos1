<script lang="ts">
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {toDisplayString} from '../../../services/common/util/string.utils.js'
  import type {MoViewMode} from '../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {page} from '$app/state'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import Field from '../field/Field.svelte'
  import { enhance } from '$app/forms';
  
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
  async function enhancedSave({ form, data, action, cancel }) {
    // 'data' contains the FormData object
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries())
    moMeta.dataSource?.saveMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
    })
    cancel();
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
      goto(`/mo/${moMeta.name}/${mo.id}`)
    } else if (viewMode === 'create') {
      goto(`/mo/${moMeta.name}`)
    }
    // history.replaceState(history.state, '', `/mo/${moMeta.name}/${mo.id}/edit`);
  }
  const edit = () => {
    viewMode = 'edit'
    goto(`/mo/${moMeta.name}/${mo.id}/edit`)
    // history.replaceState(history.state, '', `/mo/${moMeta.name}/${mo.id}/edit`);
  }
  const save = () => {
    moMeta.dataSource?.saveMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
      //viewMode = 'view'
    })
  }
  const create = event => {
    moMeta.dataSource?.addMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
      // viewMode = 'view'
    })
  }
  const deleteItem = (fname, i) => {
    mo[fname] = mo[fname].filter((item, index) => index != i)
    goto(`/mo/${moMeta.name}`)
  }
</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h2 class="pageHeader">
  <a class="label" href="/mo/{moMeta.name}">{moMeta.name}</a>
  <span class="separator"></span>
  <span class="displayName">
  {#if viewMode !== 'create'}
    {mo.getDisplayName()}
  {/if}
  </span>
</h2>
<!--<form use:enhance={enhancedSave} class="mo">-->
<form method="POST" class="mo">
  <div class="form-example">
<!--    <label for="firstName">Enter your name: </label>-->
<!--    <input type="text" name="firstName" id="firstName" required />-->
<!--    <label for="lastName">Enter your name: </label>-->
<!--    <input type="text" name="lastName" id="lastName" required />-->
<!--    <label for="email1">Email:</label>-->
<!--    <input type="email" id="email1" name="email1" />-->
<!--    <button type="submit">Submit</button>-->
  </div>
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
      <button type="submit" formaction="?/remove" >Delete</button>
    {:else if viewMode === 'edit' && !autoSave}
      <button type="submit" formaction="?/save">Save</button>
      <button type="submit" formaction="?/remove" >Delete</button>
      <button onclick={cancel}>Cancel</button>
    {:else if viewMode === 'create' && !autoSave}
      <button type="submit">Save</button>
      <button onclick={cancel}>Cancel</button>
    {/if}
    <!--{#if viewMode === 'view' }-->
    <!--  <button onclick={edit}>Edit</button>-->
    <!--{:else if viewMode === 'edit' && !autoSave}-->
    <!--  <button onclick={save} type="submit">Save</button>-->
    <!--  <button onclick={cancel}>Cancel</button>-->
    <!--{:else if viewMode === 'create' && !autoSave}-->
    <!--  <button onclick={save}>Save</button>-->
    <!--  <button onclick={cancel}>Cancel</button>-->
    <!--{/if}-->
  </div>
</form>
<style>
  .pageHeader {
    max-width: 40rem;
    padding: 0 1rem 0 0;
    display: flex;
    justify-content: left;
    justify-items: left;
    .label {
      display: flex;
      flex: 120px 1 0;
      margin: 0 8px 7px 0;
      justify-content: flex-end;
      width: 120px;
      align-self: center;
      color: var(--title-label-color)
    }
    a {
      text-decoration: none;
      /*flex-basis: 8.4rem;*/
      /*max-width: 12.3rem;*/
      /*flex-shrink: 0;*/
      /*flex-grow: 0.2;*/
      /*display: inline-block;*/
    }
    .separator {
      display: block;
      width: 7px;
    }
    .displayName {
      flex: 200px 4 2;
      margin-left: 3px;
    }
  }
  
  .mo {
    max-width: 40rem;
    padding: 0;
    
    .fields {
      display: flex;
      flex-direction: column;
    }
  }

</style>