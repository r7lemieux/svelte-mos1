<script lang="ts">
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {toDisplayString} from '../../../services/common/util/string.utils.js'
  import {type MoViewModeEnum} from '../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {OK, Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import Field from '../field/Field.svelte'
  import {extractViewMode} from '../../../services/common/util/dom.utils.js'
  import Init from '../../common/Init.svelte'
  import Status from '../../common/Status.svelte'
  import {DeletePermission} from '../../../models/managedObjects/MoDefinitionInterface.js'
  import type {FieldDefinitionInterface} from '../../../models/fields/FieldDefinition.interface.js'
  import type {FieldMo} from '../../../models/fields/FieldMo.js'
  import type {MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
  import {setContext} from 'svelte'
  import {page} from '$app/state'
  
  let {
    mo,
    autoSave = false,
    parentUiPath = [],
  }: {
    mo: Mo,
    autoSave?: boolean,
    parentUiPath?: string[]
  } = $props()
  const openPathList = page.url.searchParams.getAll('openPath')
  const openPaths = {}
  openPathList.forEach((openPath) => openPaths[openPath] = true)
  setContext('openPaths', openPaths)
  let viewMode: MoViewModeEnum = $state(extractViewMode())
  let moMeta = $derived(mo.moMeta)
  let title = $derived(toDisplayString(moMeta.moDef.name))
  let fieldDefs: FieldDefinitionInterface<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()) as FieldDefinition<any>[])
  let showFieldDefs = $derived(moMeta.moDef.showFieldnames.map(fn => fieldDefs.find(fd => fd.name === fn))) as FieldDefinition<any>[]
  let formElm: HTMLFormElement
  let sfetchError = $state(OK)
  let fetchError = $derived(() => sfetchError)
  const uiPath = [...parentUiPath, mo.moMeta.name + '-' + mo.id]
  const showDelete = () => moMeta.moDef.deletePermission !== DeletePermission.no
  
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
  const onMoRemove = (fieldMo: FieldMo) => {
    const fieldname = fieldMo.fieldname
    const moRem = fieldMo.mo
    mo[fieldname] = mo[fieldname].filter((fmo: MoidInterface) => !fmo.isSameAs(moRem))
  }
  
  const buildQueryParams = ():string => {
    if (openPaths) {
      return '?' + Object.keys(openPaths).filter(k => !!openPaths[k]).map(k => `openPath=${k}`).join('&')
    }
    return ''
  }
  const cancel = () => {
    if (viewMode === 'edit') {
      viewMode = 'view'
      goto(`/mo/${moMeta.name}/${mo.id}${buildQueryParams()}`)
    } else if (viewMode === 'create') {
      goto(`/mo/${moMeta.name}`)
    }
  }
  const edit = () => {
    viewMode = 'edit'
    goto (`/mo/${moMeta.name}/${mo.id}/edit${buildQueryParams()}`)
    // history.replaceState(history.state, '', `/mo/${moMeta.name}/${mo.id}/edit`);
  }
  const save = () => {
    // const form = document.getElementById('myForm');
    const formData = new FormData(formElm)
    // const payload = Object.fromEntries(formData.entries())
    // const uri = formElm.baseURI.split('/').slice(0, -1).join('/') + '/save'
    const partialMo = {}
    formData.forEach((v, k) => partialMo[k] = v)
    mo.hydrate(partialMo)
    const body = JSON.stringify(mo.toObj())
    fetch(formElm.action, {
      method: 'PATCH',
      body
    })
      .then(response => response.json())
      .then(responseData => {
        const newMo = moMeta.moDef.newMo()
        newMo.hydrate(responseData)
        mo = newMo
        goto(`/mo/${moMeta.name}/${newMo.id}`)
        
      })
      .catch(err => {
        console.error('Error:', err)
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
        let url = `/mo/${moMeta.name}/${id}`
        goto(url)
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }
  const del = async () => {
    const response = await fetch(formElm.action, {
      method: 'DELETE',
    })
    if (response.ok) {
      sfetchError = OK
      await goto(`/mo/${moMeta.name}`)
    } else {
      const json = await response.json()
      const rezult = Rezult.fromObj(json)
      console.log(`==>SimpleMo.svelte:130 rezult`, rezult)
      sfetchError = rezult
    }
    console.log(`==>SimpleMo.svelte:del:142 fetchError`, fetchError())
    // console.log(`==>SimpleMo.svelte:del:142 fetchError`, $state.snapshot(fetchError))
  }
  // const deleteItem = (fname, i) => {
  //     mo[fname] = mo[fname].filter((item, index) => index != i)
  //     goto(`/mo/${moMeta.name}`)
  // }
  // const printlogs = (ln: string) => {
  //   console.log(`==> SimpleMo.svelte:${ln} moMeta `, moMeta.name)
  //   console.log(`==> SimpleMo.svelte:${ln} title `, title)
  //   console.log(`==> SimpleMo.svelte:${ln} fieldDefs `, fieldDefs.length)
  //   console.log(`==> SimpleMo.svelte:${ln} showFieldDefs `, showFieldDefs.length)
  //   console.log(`==> SimpleMo.svelte:${ln} fetchError `, fetchError)
  //   console.log(`==> SimpleMo.svelte:${ln} mo displayName`, mo.displayName)
  // }

</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<Init/>
<h2 class="pageHeader">
  <a class="label" href="/mo/{moMeta.name}">{title}</a>
  <span class="separator"></span>
  <span class="displayName">
  {#if viewMode !== 'create'}
    {mo.getDisplayName()}
  {/if}
  </span>
</h2>
<Status error={fetchError()}></Status>
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
    {#each showFieldDefs as fieldDef}
      {@const value = mo[fieldDef?.name]}
      {#key value}
        <Field {fieldDef} {value} {viewMode} {onChange} {onMoRemove} parentUiPath={uiPath} level={0}/>
      {/key}
    {/each}
  </div>
  <div class="button-bar">
    {#if viewMode === 'view' }
      <button onclick={edit}>Edit</button>
      <button type="button" class={{ hide: !showDelete()}} onclick={del}>Delete</button>
    {:else if viewMode === 'edit' && !autoSave}
      <button type="button" onclick={save}>Save</button>
      <button type="button" class={{ hide: !showDelete()}} onclick={del}>Delete</button>
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
  h2 {
    margin-block-end: 0;
  }
  
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
