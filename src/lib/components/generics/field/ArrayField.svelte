<script lang="ts">
  import type {MoViewMode} from  '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
	// import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
	// import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import ArrayValueField from  './ArrayValueField.svelte'

  export let fieldDef: FieldDefinition<any>
  export let value
  export let viewMode: MoViewMode
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
      <span>{size}</span>
      <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
<!--      <Icon src={showDetails?AiOutlineCaretDown:AiOutlineCaretRight}/>-->
      </span>
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
<style>:root {
  --field-height: 2rem;
  --branch-indentation: 12px;
  --detail-margin: 35px;
  --tree-line-color: #88A;
}

.field {
  display: flex;
  align-items: start;
}

.field .tree-line {
  border-left: 2px solid var(--tree-line-color);
  display: block;
  height: 2.5rem;
  width: 5px;
}

.field .tree-line.open {
  border-bottom: 2px solid var(--tree-line-color);
  width: 10px;
  position: relative;
  left: 1px;
}

.field .tree-branch {
  border-bottom: 2px solid var(--tree-line-color);
  width: var(--branch-indentation);
  position: relative;
  left: 2px;
}

.field label {
  flex: 120px 1 0;
  display: flex;
  margin: 0 8px 7px 0;
  justify-content: flex-end;
  width: 120px;
  color: #244;
  align-self: center;
  text-wrap: balance;
}

.field .value {
  flex: 200px 4 2;
  margin-left: 3px;
}

.field input {
  height: var(--field-height);
  border: none;
  border-bottom: 1px solid #E1E2FF;
  padding: 0 0.3rem;
  width: 100%;
}

.field input[disabled] {
  background: transparent;
}

.field .delete-x {
  color: #822;
  font-weight: bold;
  margin: 0 -30px;
  position: relative;
  right: -15px;
}

.field .count {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  height: var(--field-height);
  align-self: center;
  margin: 0 0.5rem 0 0.4rem;
  width: var(--detail-margin);
  font-family: "Courier 10 Pitch", serif;
  font-size: smaller;
  color: #883;
}

.field .count .detail-arrow::after {
  display: inline-block;
  content: '\25B7';
  font-weight: bold;
  font-size: x-large;
  color: var(--tree-line-color);
  align-self: center;
  margin: 0 0 4px 5px;
}

.field .count .detail-arrow.open::after {
  margin-bottom: 0;
  transform: rotate(90deg);
}

@supports (-webkit-transform: rotate(90deg)) {
  .field .count .detail-arrow.open::after {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}

.field .count .empty-value {
  height: var(--field-height);
  margin: 0 0 6px 0;
  display: block;
}

.field .detail-icon {
  position: relative;
}

.field input.array-item {
  height: var(--field-height);
  width: 100%;
}

.field .array-value {
  border: 1px solid #DDE;
  margin: 0;
  padding: 0;
  width: 100%;
}

.field .array-value.single {
  margin: 1px 0 0 0;
}

.field .array-value input {
  border: none;
}

.field .map-detail-icon {
  position: relative;
  top: 4px;
  right: -8px;
  margin: 0 -30px;
}
</style>