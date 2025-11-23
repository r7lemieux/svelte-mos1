<script lang="ts">
  import type { MoViewMode, MoViewModeEnum } from '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
	// import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
	// import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import ArrayValueField from  './ArrayValueField.svelte'
  import './field.css'

  export let fieldDef: FieldDefinition<any>
  export let value
  export let viewMode: MoViewModeEnum
  $: disabled = viewMode === 'view'
  const fd = fieldDef
  const fname = fieldDef.name
  export let onChange
  export let level: number = 1
  let newItem = ''
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

  let showDetails = false
  const toogle = () => showDetails = !showDetails
  const deleteItem = (i) => {
    value = value.filter((item, index) => index != i)
    onChange(fieldDef.name, value)
  }
</script>
<div class="field ArrayField" style="margin-left:{level*12}px;">
  <label for={fname}>{fd.getDisplayName()}</label>
  <span class=" tree-line {showDetails?'open':'closed'}"></span>
  <span class="value">
    <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="0">
      <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
<!--      <Icon src={showDetails?AiOutlineCaretDown:AiOutlineCaretRight}/>-->
      </span>
      <span class="size">{size}</span>
    </span>
  </span>
</div>
{#if showDetails}
  {#each (value || []) as item, index}
    <ArrayValueField {fieldDef} value={item} {index} {viewMode} single={!size} level={level + 1} onChange={changed} {deleteItem}/>
  {/each}
  <ArrayValueField {fieldDef} value={newItem} index={-2} {viewMode} single={!size} level={level + 1} onChange="{changed}" {deleteItem}/>
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
