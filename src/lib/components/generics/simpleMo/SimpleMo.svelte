<script lang="ts">
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {toDisplayString} from '../../../services/common/util/string.utils.js'
  import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {page} from '$app/state'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import Field from '../field/Field.svelte'
  import {enhance} from '$app/forms'
  import {extractViewMode} from '../../../services/common/util/dom.utils.js'
  
  let paa = page
  let {mo, autoSave = false}: { mo: Mo, autoSave?: boolean } = $props()
  let viewMode: MoViewModeEnum = $state(extractViewMode())
  // let disabled = $derived(viewMode === 'view')
  let smo = $state(mo)
  let moMeta = $derived(mo.moMeta)
  let moDef = $derived(moMeta.moDef)
  let path = $derived(`/${moMeta.name}/${mo.id}/`)
  let title = $derived(toDisplayString(moMeta.moDef.name))
  let fieldDefs: FieldDefinition<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()) as FieldDefinition<any>[])
  let fieldnames = $derived(moMeta.moDef.showFieldnames)
  const ui = {}
  let formElm: HTMLFormElement
  
  async function enhancedSave({form, data, action, cancel}) {
    // 'data' contains the FormData object
    const formData: FormData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    moMeta.dataSource?.saveMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
    })
    cancel()
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
  $effect(() => {
      // console.log(`==> SimpleMo.svelte:57 title `, title)
    }
  )
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
    // const form = document.getElementById('myForm');
    const formData = new FormData(formElm)
    // const uri = formElm.baseURI.split('/').slice(0, -1).join('/') + '/save'
    fetch(formElm.action, {
      method: 'PATCH',
      body: formData
    })
      .then(response => response.json())
      .then(responseData => {
        const newMo = moMeta.moDef.newMo()
        newMo.hydrate(responseData)
        mo = newMo
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  const create = () => {
    // const form = document.getElementById('myForm');
    const formData = new FormData(formElm)
    // const uri = formElm.baseURI.split('/').slice(0, -1).join('/') + '/save'
    fetch(formElm.action, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(responseData => {
        const id = responseData['id']
        if (!id) throw new Rezult(ErrorName.missing_param, {responseData}, 'createMo')
        //const newMo = moMeta.moDef.newMo()
        // const fields = {}
        // formData.forEach((v, k) => fields[k] = v)
        // newMo.hydrate(fields)
        // mo = newMo
        goto(`/mo/${moMeta.name}/${id}`)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  const del = () => {
    fetch(formElm.action, {
      method: 'DELETE',
    })
      .then(response => {
        goto(`/mo/${moMeta.name}`)
      })
      .catch(error => {
        console.error('Error:', error)
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
  <a class="label" href="/mo/{moMeta.name}">{title}</a>
  <span class="separator"></span>
  <span class="displayName">
  {#if viewMode !== 'create'}
    {mo.getDisplayName()}
  {/if}
  </span>
</h2>
<!--<form use:enhance={enhancedSave} class="mo">-->
<form method="POST" class="mo" bind:this={formElm}>
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
      <button type="button" formaction="delete">Delete</button>
    {:else if viewMode === 'edit' && !autoSave}
      <button type="button" onclick={save}>Save</button>
      <button type="button" onclick={del}>Delete</button>
      <button onclick={cancel}>Cancel</button>
    {:else if viewMode === 'create' && !autoSave}
      <button type="button" onclick={create}>Save</button>
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
