<script lang="ts">
  import { MoViewMode, type MoViewModeEnum } from '../../../constants/ui.js'
  import type { FieldDefinition } from '../../../models/fields/FieldDefinition.js'
  // import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
  // import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import './field.css'
  import Field from './Field.svelte'
  import { CommonFieldDefs } from '../../../models/fields/CommonFieldDefinition.js'
  import { type MoidInterface } from '../../../models/managedObjects/MoidInterface.js'
  import type { MoMeta } from '../../../models/managedObjects/MoMeta.js'
  import ObjectField from '../../generics/field/ObjectField.svelte'
  import type { MoFieldDefinition } from '../../../models/fields/MoFieldDefinition.js'
  import { getMoMeta } from '../../../services/mo/moManagement.js'
  import MoField from './MoField.svelte'

  let {
    fieldDef,
    value = [],
    level = 1,
    viewMode = MoViewMode.view,
    onChange,
  }: {fieldDef: FieldDefinition<any>, value: any, level: number, viewMode: MoViewModeEnum, onChange:any} = $props()

  // console.log(`==> MoArrayField.svelte:23 value `, value);
  // console.log(`==> MoArrayField.svelte:24 typeof value `, typeof value);
  let values = value as Array<MoidInterface>
  let disabled = $state(viewMode)
  const fd: MoFieldDefinition = fieldDef as MoFieldDefinition
  const fname = fieldDef.name
  const moName = fd.moName
  const moMeta = getMoMeta(moName)
  const inArray = true
  let newItem = $state()
  const changed = (fieldId, item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const index = Number.parseInt(fieldId)
    if (index === -2) {
      value.push(item)
    } else {
      value[index] = item
    }
    value = [...value]
    onChange(fieldDef.name, value)
    newItem = ''
  }

  const size = value?.length

  let showDetails = $state(false)
  const toogle = () => showDetails = !showDetails
  const deleteItem = (i) => {
    value = value.filter((item, index) => index != i)
    onChange(fieldDef.name, value)
  }
  const moFieldDefs = values.map(v => CommonFieldDefs.mo.clone())
  // const moFieldDef = new MoFieldDefinition(moName)

</script>
<div class="field ArrayField MoArrayField" data-fieldtype={fd.type} style="margin-left:{level*12}px;">
  <label for={fname}>{fd.getDisplayName()}</label>
  <span class=" tree-line {showDetails?'open':'closed'}"></span>
  <span class="value">
    <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="0">
      <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
<!--      <Icon src={showDetails?AiOutlineCaretDown:AiOutlineCaretRight}/>-->
      </span>
    </span>
      <span class="size">{size}</span>
  </span>
</div>
{#if showDetails}
  {#each (values || []) as item, index}
    <MoField {fieldDef} value={item} {viewMode} level={level + 1} onChange={changed} {inArray} />
  {/each}
<!--  <ObjectField fieldDef={moFieldDef} value={newItem} {viewMode} level={level + 1} onChange={changed} />-->
{/if}
{#if false}
  <div class="field tree-line open">
    <div class="detail-icon count tree-line open tree-branch delete-x array-value single map-detail-icon">
      <input disabled class="array-item detail-arrow open empty-value"/>
    </div>
  </div>
{/if}
<style>
</style>
