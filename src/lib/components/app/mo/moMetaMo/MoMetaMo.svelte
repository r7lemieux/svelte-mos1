<script lang="ts">
  import {toDisplayString} from '../../../../services/common/util/string.utils.js'
  import type { MoViewMode, MoViewModeEnum } from '../../../../constants/ui.js'
  import {goto} from '$app/navigation'
  import {page} from '$app/state'
  import Field from '../../../generics/field/Field.svelte'
  import {Rezult} from '../../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../../services/common/message/errorName.js'
  import {extractViewMode} from '../../../../services/common/util/dom.utils.js'
  import type {FieldDefinition} from '../../../../models/fields/FieldDefinition.js'
  
  let {mo} = $props()
  let viewMode: MoViewModeEnum = $derived(extractViewMode())
  let disabled = $derived(viewMode)
  let moMeta = mo //._moMeta
  const title = toDisplayString(moMeta.name)
  const fieldDefs: FieldDefinition<any>[] = Array.from(mo._moMeta.moDef.fieldDefs.values()) as unknown as FieldDefinition<any>[]
  const ui = {}

  const onChange = (fieldId: string, val: any) => {
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
    goto(`/mo/${moMeta.name}/${mo.id}/edit`)
    // history.replaceState(history.state, '', `/mo/${moMeta.name}/${mo.id}/edit`);
  }
  const cancel = () => {
    viewMode = 'view'
    goto(`/mo/${moMeta.name}/${mo.id}`)
  }
  const save = () => {
    moMeta.dataSource?.saveMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
      // viewMode = 'view'
    })
  }
  const create = event => {
    moMeta.dataSource?.addMo(mo).then(mo => {
      goto(`/mo/${moMeta.name}/${mo.id}`)
      // viewMode = 'view'
    })
  }
  const deleteItem = (fname, i) => {
    mo[fname] = mo[fname].filter((item,index) => index != i)
  }
</script>
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1>MoMetaMo component</h1>
<div class="mo">
  <div class="fields">
    {#each fieldDefs as fieldDef}
      {@const fname=fieldDef.name}
      {@const value=mo[fieldDef.name]}
      <Field {fieldDef} {value} {viewMode} {onChange} level={0} />
    {/each}
  </div>
  <div class="button-bar">
    {#if viewMode === 'view' }
      <button onclick={edit}>Edit</button>
    {:else if viewMode === 'edit'}
      <button onclick={save}>Save</button>
      <button onclick={cancel}>Cancel</button>
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

</style>
