<script lang="ts">
  import {sizeLabels} from '$lib/services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  import './field.css'
  import type {MoViewModeEnum} from '$lib/constants/ui.js'
  import type {MoidInterface} from '$lib/models/managedObjects/MoidInterface.js'
  import type {FieldDefinitionInterface} from '$lib/models/fields/FieldDefinition.interface.js'
  import type {MoFieldDefinition} from '$lib/models/fields/MoFieldDefinition.js'
  import {getMoMeta} from '$lib/services/mo/moManagement.js'
  import type {MoInterface} from '$lib/models/managedObjects/MoInterface.js'
  import Field from './Field.svelte'
  import {goto} from '$app/navigation'
  import {AiOutlineCloseCircle} from 'svelte-icons-pack/ai'
  import {Icon} from 'svelte-icons-pack'
  import {Rezult} from '$lib/services/common/message/rezult.js'
  import {ErrorName} from '$lib/services/common/message/errorName.js'
  import type {FieldMo} from '$lib/models/fields/FieldMo.js'
  import MoSelect from '$lib/components/generics/field/MoSelect.svelte'
  
  let {
    fieldDef,
    fieldname,
    value,
    level = 1,
    viewMode = 'view',
    onChange,
    inArray = false,
    parentUiPath = [],
    onRemove,
  }: {
    fieldDef: FieldDefinitionInterface<any>,
    fieldname: string,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange: any,
    inArray?: boolean,
    parentUiPath: string[],
    onRemove?: (fieldMo: FieldMo) => void
  } = $props()
  // export let name
  // export let fieldDef: FieldDefinition<any>
  // export let value: any
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  const moFieldDef = $state((fieldDef || value.moMeta.fieldDef) as MoFieldDefinition)
  const moName = $derived(moFieldDef.moName)
  const moMeta = $derived(getMoMeta(moName))
  // let fieldDefs: FieldDefinitionInterface<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()))
  let smoid = $state(value as MoidInterface)
  let moid = $derived(smoid as MoidInterface)
  const uiPath = [...parentUiPath]
  const label = inArray ? '' : fieldDef?.getDisplayName()
  
  let showDetails = $state(false)
  let loading = $state(false)
  let mo: MoInterface | null = $state(null)
  let showFieldDefs = $derived(moMeta.moDef.showFieldnames.map(fn => moMeta.moDef.fieldDefs.get(fn)).filter(fd => !!fd))
  let mosSelected: MoInterface[] = $state([value as MoInterface])
  let mosOptions: MoInterface[] = []
  
  // if (viewMode === 'create' || viewMode === 'edit') loadOptions()
  // let changed = event => {
  //   const fieldId = event.srcElement.id
  //   const value = event.srcElement.value
  //   onChange(fieldId, value)
  // }
  async function fetchDetails() {
    loading = true
    const res = await fetch(`/mo/${moName}/${moid?.id}`)
    const obj = await res.json()
    mo = await moMeta.objToMo(obj)
    loading = false
  }
  
  async function toggle() {
    if (viewMode === 'edit') return
    showDetails = !showDetails
    
    if (showDetails && !mo) {
      await fetchDetails()
    }
    //sizeLabels()
  }
  
  const onLinkClick = () => {
    // console.log(`==>MoField.svelte:80 /mo/${moName}/${moid.id}`)
    goto(`/mo/${moName}/${moid.id}`, {replaceState: true})
  }
  
  const onRemoveClick = () => {
    if (!onRemove || !moid?.id) {
      console.log(`==>MoField.svelte:onDelete fails onDelete: ${!!onRemove}, !!moid: ${!!moid}, !!moid?.id: ${!!moid?.id}`)
      throw new Rezult(ErrorName.missing_id, {onDelete: !!onRemove, moid: !!moid, id: !!moid?.id}, 'onDelete')
    } else {
      onRemove({fieldname, mo: moid})
    }
  }
  $effect(() => {
    sizeLabels()
  })
</script>

<div class="field moField" data-fdtype={moFieldDef.type} style="margin-left:{level*12}px;">
  <label for={fieldname}>{label}</label>
  <span class="tree-line {showDetails?'open':'closed'}" onclick={toggle} onkeydown={toggle} role="button"
        tabindex="-2">
  </span>
  <span class="value">
      <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="-2">
<!--        <span>{size}</span>-->
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"></span>
      </span>
    {#if viewMode === 'view' || viewMode === 'edit'}
      <button type="button" onclick={onLinkClick} class='name linkButton' aria-label={moid?.displayName}
              disabled={!moid?.id || viewMode === 'edit'}> {moid?.id} {moid?.displayName}</button>
    {/if}
    {#if viewMode === 'create' || viewMode === 'edit'}
      <MoSelect {moFieldDef} {fieldname} {mosSelected} {mosOptions} {level} {viewMode} {parentUiPath}/>
    {/if}
    {#if inArray && viewMode === 'edit'}
      <button type="button" class="delete" onclick="{onRemoveClick}"><Icon src={AiOutlineCloseCircle}></Icon></button>
    {/if}
  </span>
</div>

{#if viewMode === 'view'}
  {#if showDetails}
    {#if loading}
      <span class="loading" style="margin-left:{level*12}px;">Loading…</span>
    {:else if mo}
      <!--    <p>moMeta.moDef.showFieldNames {moMeta.moDef.showFieldnames}</p>-->
      <!--    <p>showFieldDefs {showFieldDefs}</p>-->
      <!--    <p>{moMeta.moDef.fieldDefs.keys()}</p>-->
      {#each showFieldDefs as fd}
        <Field fieldDef={fd} value={mo[fd.name]} {viewMode} {onChange} parentUiPath={uiPath} level={level + 1 }/>
      {/each}
    {/if}
  {/if}
{/if}
<style>
  
  .delete {
    color: var(--field-delete-color);
    background: transparent;
    border: none;
    padding-inline-start: 3px;
  }

</style>
