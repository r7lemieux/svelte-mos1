<script lang="ts">
  import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  // import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
  // import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import './field.css'
  import {type MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
  import type {MoFieldDefinition} from '../../../models/fields/MoFieldDefinition.js'
  import MoField from './MoField.svelte'
  import type {FieldMo} from '../../../models/fields/FieldMo.js'
  
  let {
    fieldDef,
    fieldname,
    value = [],
    level = 1,
    viewMode = MoViewMode.view,
    onChange,
    onMoRemove,
  }: {
    fieldDef: FieldDefinition<any>,
    fieldname: string,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange:any,
    onMoRemove?: (fieldMo: FieldMo) => void
  } = $props()

  // console.log(`==> MoArrayField.svelte:23 value `, value);
  // console.log(`==> MoArrayField.svelte:24 typeof value `, typeof value);
  let values = value as Array<MoidInterface>
  const fd: MoFieldDefinition = fieldDef as MoFieldDefinition
  const fname = fieldDef.name
  const inArray = true
  const moItemFieldDef = fieldDef.clone()
  moItemFieldDef.type = 'mo'
  
  const changed = (fieldId: string, item: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const index = Number.parseInt(fieldId)
    if (index === -2) {
      value.push(item)
    } else {
      value[index] = item
    }
    value = [...value]
    onChange(fieldDef.name, value)
  }

  const size = value?.length

  let showDetails = $state(false)
  const toogle = () => showDetails = !showDetails
 
  const onRemove = onMoRemove || ((fieldMo: FieldMo) => { })
  
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
  {#each (values || []) as item}
    <MoField {fieldname} fieldDef={moItemFieldDef} value={item} {viewMode} level={level + 1} onChange={changed} {inArray} {onRemove} />
  {/each}
<!--  <ObjectField fieldDef={moFieldDef} value={newItem} {viewMode} level={level + 1} onChange={changed} />-->
{/if}
<style>
</style>
