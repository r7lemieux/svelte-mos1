<script lang="ts">
  import {MoViewMode} from  '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  // import Icon from 'svelte-icons-pack/Icon.svelte'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
	import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
	import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  import SimpleMo from  '../simpleMo/SimpleMo.svelte'
  import ObjectField from  './ObjectField.svelte'
  import { onMount } from 'svelte'
  import './field.css'
  
  let {
    fieldDef,
    key,
    level = 1,
    value,
    valueType,
    onChange,
    deleteItem,
    viewMode = MoViewMode.view,
  } = $props()
  let disabled = $derived(!!viewMode)
  const fd = fieldDef
  const fname = fieldDef.name
  let showDetails = $state(false)
  let toogle = () => showDetails = !showDetails

  const del = () => deleteItem(key)
  let changed = (event) => {
    const val = event.srcElement.value
    onChange(key, val)
  }
  let added = (event) => {
    const val = event.srcElement.value
    onChange(key, val)
    event.srcElement.value = ''
  }
  let height = $state(0)
  onMount(() => {
    const ele = document.querySelector('.field') as HTMLElement
    console.log(`==>SimpleField.svelte:21 ele `, ele)
    height = ele?.offsetHeight
    console.log(`==>SimpleField.svelte:21  height `, height)
  })
</script>
<div class="field MapValueField" style="margin-left:{level*12}px;">
  <label for={fname}>{key}</label>
  <span class="tree-line" style="height: calc({height}px"></span>

  <span class="value">
    {#if valueType === 'mo'}
      <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="0">
        <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"> </span>
      </span>
    {:else if valueType === 'object'}
      <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="0">
        <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"> </span>
      </span>
    {:else}
        <input class="array-item" type={fd.inputType} name={fname}
               id={key} value={value} onchange={changed} {disabled}/>
        <span class="delete-x" onclick={del} onkeydown={del} role="button" tabindex="0"
              style="display:{viewMode==='view'?'none':'inline'}">X</span>
    {/if}
  </span>
</div>
{#if valueType === 'mo' && showDetails}
  <SimpleMo mo={value} />
{:else if valueType === 'object' && showDetails}
  <ObjectField {fieldDef} {value} {level} {viewMode} {onChange} />
{/if}
{#if false}
  <div class="field tree-line open">
    <div class="detail-icon count tree-line open tree-branch delete-x array-value single map-detail-icon">
      <input class="array-item detail-arrow open empty-value"/>
    </div>
  </div>
{/if}
<style>

.count {
    width: var(--tree-detail-margin) + 15px;
  }
</style>
