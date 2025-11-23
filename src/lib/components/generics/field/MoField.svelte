<script lang="ts">
  import { setHeightToParent, sizeLabels } from '../../../services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  import './field.css'
  import type { MoViewModeEnum } from '../../../constants/ui.js'
  import type { MoidInterface } from '../../../models/managedObjects/MoidInterface.js'
  import type { FieldDefinitionInterface } from '../../../models/fields/FieldDefinition.interface.js'
  import type { MoFieldDefinition } from '../../../models/fields/MoFieldDefinition.js'
  import { getMoMeta } from '../../../services/mo/moManagement.js'
  import type { MoInterface } from '../../../models/managedObjects/MoInterface.js'
  import Field from './Field.svelte'
  import { goto } from '$app/navigation'

  let {
    fieldDef,
    value,
    level = 1,
    viewMode = 'view',
    onChange,
    inArray = false
  }: {
    fieldDef?: FieldDefinitionInterface<any>,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange: any,
    inArray?: boolean
  } = $props()
  // export let name
  // export let fieldDef: FieldDefinition<any>
  // export let value: any
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  const mofieldDef = $state((fieldDef || value.moMeta.fieldDef) as MoFieldDefinition)
  const moName = $derived(mofieldDef.moName)
  const moMeta = $derived(getMoMeta(moName))
  let fieldDefs: FieldDefinitionInterface<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()))
  let moid = $state(value as MoidInterface)
  const label = inArray? '' : fieldDef?.getDisplayName()
  const displayName = (() => {return moid?.getDisplayName()})()
  let disabled = $derived(!!viewMode)
  const href = $derived(`/mo/${moName}/${moid.id}`)
  let showDetails = $state(false)
  let loading = $state(false)
  let mo: MoInterface | null = $state(null)

  let changed = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  async function fetchDetails() {
    loading = true
    const res = await fetch(`/mo/${moName}/${moid.id}`);
    const obj = await res.json();
    mo = moMeta.objToMo(obj)
    // fieldDefs = moMeta.moDef.fieldDefs.values()
    loading = false
  }
  const getFieldDefs = () => fieldDefs
  async function toggle() {
    showDetails = !showDetails

    if (showDetails && !mo) {
      await fetchDetails()
    }
    //sizeLabels()
  }

  const deleteItem = (key) => {
    delete value[key]
  }

  const onclick = () => goto(`/mo/${moName}/${moid.id}`, {replaceState: true})

  $effect(() => {
    sizeLabels()
  })
</script>

<div class="field SimpleField" data-fdtype={mofieldDef.type} style="margin-left:{level*12}px;">
    <label for="name">{label}</label>
  <span class="tree-line {showDetails?'open':'closed'}" onclick={toggle} onkeydown={toggle} role="button" tabindex="-2">
  </span>
  <span class="value">
      <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="-2">
<!--        <span>{size}</span>-->
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"></span>
      </span>
<!--        <a {href} class='name' aria-label={displayName}> {displayName} </a>-->
        <button type="button"{onclick} class='name' aria-label={displayName}> {displayName} </button>
  </span>
</div>

{#if showDetails}
  {#if loading}
    <span class="loading" style="margin-left:{level*12}px;">Loading…</span>
  {:else if mo}
    {#each getFieldDefs() as fd}
<!--      <div class="field ObjectField-Details" style="margin-left:{(level+1)*12}px;">-->
<!--        <label for="{fd.name}">{fd.getDisplayName()}</label>-->
<!--        <span class="tree-line"></span>-->
<!--        <span class="value">{mo[fd.name]}</span>-->
        <Field fieldDef={fd} value={mo[fd.name]} {viewMode} {onChange} level={level + 1 } />
<!--      </div>-->
    {/each}
  {/if}
{/if}
<style>
  .name {
      position: relative;
      bottom: -0.2rem
  }
</style>
