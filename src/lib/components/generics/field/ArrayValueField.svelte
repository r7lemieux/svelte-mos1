<script lang="ts">
  import type { MoViewMode } from '../../../constants/ui.js'
  import type { FieldDefinition } from '../../../models/fields/FieldDefinition.js'
  import { onMount } from 'svelte'

  export let fieldDef: FieldDefinition<never>
  export let value
  export let viewMode: MoViewMode
  export let single = false
  $: disabled = viewMode === 'view'
  const fd = fieldDef
  const fname = fieldDef.name
  export let onChange
  export let index
  export let deleteItem
  export let level
  const del = () => deleteItem(index)
  let changed = (event) => {
    const val = event.srcElement.value
    onChange(index, val)
  }
  let added = (event) => {
    const val = event.srcElement.value
    onChange(index, val)
    event.srcElement.value = ''
  }
  let height
  onMount(() => {
    const ele = document.querySelector('.field') as HTMLElement
    console.log(`==>SimpleField.svelte:21 ele `, ele)
    height = ele!.offsetHeight
    console.log(`==>SimpleField.svelte:21  height `, height)
  })
</script>
<div class="field ArrayValueField" style="margin-left:{level*12}px;">
  <label for={fname}></label>
  <span class="tree-line" ></span>
  <!--{showDetails?'open':'closed'}"></span>-->
  <span class="value">
     {#if index >= 0}
<!--        <span class="array-value">-->
        <input class="array-item" type={fd.inputType} name={fname}
               id={index} value={value} onchange={changed} {disabled}/>
        <span class="delete-x" onclick={del} onkeydown={del} role="button" tabindex="0"
              style="display:{viewMode==='view'?'none':'inline'}">X</span>
<!--        </span>-->
     {:else if viewMode !== 'view' }
    {value} <input class="array-item {!single?'single':''}" type={fd.inputType} name={fname} id="-2"
            value={value} onchange={added} {disabled}/>
    {/if}
    </span>
</div>
{#if false}
  <div class="field">
    <div class="detail-icon count tree-branch map-detail-icon array-value single">
      <input class="empty-value tree-line detail-arrow open" />
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

.field {
    display: flex;
  }
</style>