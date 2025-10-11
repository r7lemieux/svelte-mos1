<script lang="ts">
  import type { MoViewMode } from '../../../constants/ui.js'
  import type { FieldDefinition } from '../../../models/fields/FieldDefinition.js'
  import { onMount } from 'svelte'
  import './field.css'

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
<style>
</style>