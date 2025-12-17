<script lang="ts">
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  import './field.css'
  import type {MoViewModeEnum} from '../../../constants/ui.js'
  import type {MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
  import type {FieldDefinitionInterface} from '../../../models/fields/FieldDefinition.interface.js'
  import type {MoFieldDefinition} from '../../../models/fields/MoFieldDefinition.js'
  import {getMoMeta} from '../../../services/mo/moManagement.js'
  import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
  import Field from './Field.svelte'
  import {goto} from '$app/navigation'
  import {AiOutlineCloseCircle} from 'svelte-icons-pack/ai'
  import {Icon} from 'svelte-icons-pack'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import type {FieldMo} from '../../../models/fields/FieldMo.js'
  
  let {
    fieldDef,
    fieldname,
    value,
    level = 1,
    viewMode = 'view',
    onChange,
    inArray = false,
    onRemove = (fieldMo: FieldMo) => {},
  }: {
    fieldDef: FieldDefinitionInterface<any>,
    fieldname: string,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange: any,
    inArray?: boolean,
    onRemove?: (fieldMo: FieldMo) => void
  } = $props()
  // export let name
  // export let fieldDef: FieldDefinition<any>
  // export let value: any
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  const mofieldDef = $state((fieldDef || value.moMeta.fieldDef) as MoFieldDefinition)
  const moName = $derived(mofieldDef.moName)
  const moMeta = $derived(getMoMeta(moName))
  // let fieldDefs: FieldDefinitionInterface<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()))
  let moid = $state(value as MoidInterface)
  const label = inArray ? '' : fieldDef?.getDisplayName()
  const displayName = (() => {
    return moid?.getDisplayName()
  })()
 
  let showDetails = $state(false)
  let loading = $state(false)
  let mo: MoInterface | null = $state(null)
  let showFieldDefs = $derived(moMeta.moDef.showFieldnames.map(fn => moMeta.moDef.fieldDefs.get(fn)).filter(fd => !!fd))
  
  // let changed = event => {
  //   const fieldId = event.srcElement.id
  //   const value = event.srcElement.value
  //   onChange(fieldId, value)
  // }
  
  async function fetchDetails() {
    loading = true
    const res = await fetch(`/mo/${moName}/${moid?.id}`)
    const obj = await res.json()
    mo = moMeta.objToMo(obj)
    // fieldDefs = moMeta.moDef.fieldDefs.values()
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
  
  const onclick = () => {
    console.log(`==>MoField.svelte:80 /mo/${moName}/${moid.id}`)
    goto(`/mo/${moName}/${moid.id}`, {replaceState: true})
  }
  const onRemoveClick = () => {
    if (!onRemove || !moid?.id) {
      console.log(`==>MoField.svelte:onDelete fails onDelete: ${!!onRemove}, !!moid: ${!!moid}, !!moid?.id: ${!!moid?.id}`)
      throw new Rezult(ErrorName.missing_id, {onDelete: !!onRemove, moid: !!moid, id: !!moid?.id}, 'onDelete')
    } else {
      onRemove({fieldname, mo:moid})
    }
  }
  // const removeMos = () => {
  //     if (mofieldDef.compositePart) {
  //       const deleteResult = await mo.moMeta.dataSource.deleteMo(mo.id)
  //       if (deleteResult.errors) {
  //       }
  //
  //     onDelete(mo.id)
  //   }
  // }
  $effect(() => {
    sizeLabels()
  })
</script>

<div class="field moField" data-fdtype={mofieldDef.type} style="margin-left:{level*12}px;">
  <label for="name">{label}</label>
  <span class="tree-line {showDetails?'open':'closed'}" onclick={toggle} onkeydown={toggle} role="button" tabindex="-2">
  </span>
  <span class="value">
      <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="-2">
<!--        <span>{size}</span>-->
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"></span>
      </span>
      <button type="button" {onclick} class='name linkButton' aria-label={displayName}
              disabled={!moid?.id}> {displayName}</button>
    {#if inArray}
      <button class="delete" onclick="{onRemoveClick}"><Icon src={AiOutlineCloseCircle}></Icon></button>
    {/if}
  </span>
</div>

{#if showDetails}
  {#if loading}
    <span class="loading" style="margin-left:{level*12}px;">Loading…</span>
  {:else if mo}
    <!--    <p>moMeta.moDef.showFieldNames {moMeta.moDef.showFieldnames}</p>-->
    <!--    <p>showFieldDefs {showFieldDefs}</p>-->
    <!--    <p>{moMeta.moDef.fieldDefs.keys()}</p>-->
    {#each showFieldDefs as fd}
      <Field fieldDef={fd} value={mo[fd.name]} {viewMode} {onChange} level={level + 1 }/>
    {/each}
  {/if}
{/if}
<style>
  .name {
    position: relative;
    bottom: -0.2rem
  }
  
  .delete {
    color: var(--field-delete-color)
  }
</style>
