<script lang="ts">
  import MapValueField from './MapValueField.svelte'
  import {onMount} from 'svelte'
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  import './field.css'
  
  let {
    fieldDef,
    value,
    level = 1,
    onChange,
    viewMode = 'view'
  } = $props()
  const fd = $derived(fieldDef)
  const fname = $derived(fieldDef.name)
  const size = $derived((Array.from(value.keys())).length)
  const valueType = $derived(fieldDef.itemValueType)
  let changed = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  let showDetails = $state(false)
  const toggle = () => {
    showDetails = !showDetails
    sizeLabels()
  }
  const deleteItem = (i) => {
    value = value.filter((item, index) => index != i)
  }
  
  $effect(sizeLabels)
  let height
  onMount(() => {
    const ele = document.querySelector('.field') as HTMLElement
    console.log(`==>SimpleField.svelte:21 ele `, ele)
    height = ele.offsetHeight
    console.log(`==>SimpleField.svelte:21  height `, height)
  })
</script>
<div class="field MapField">
  <label for={fname}>{fd.getDisplayName()} </label>
  <span class=" tree-line {showDetails?'open':'closed'}" onclick={toggle} onkeydown={toggle} role="button"
        tabindex="0">
<!--    <span class="top tree-line1"/>-->
<!--    <span class="arrow {showDetails?'open':'closed'}"/>-->
<!--    <span class="bot {showDetails?'open tree-line':'closed'}"/>-->
  </span>
  <span class="value">
      <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="0">
        <span>{size}</span>
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
        </span>
      </span>
  </span>
</div>
{#if showDetails}
  {#each Array.from(value.keys()) as key, i}
    <MapValueField {fieldDef} value={value.get(key)} {valueType} {key} {viewMode} level={level + 1} onChange={changed}
                   {deleteItem}/>
  {/each}
{/if}
<!--        <span class="map-value">-->
<!--          <input class="array-item" name={fd.name + '.' + key} value={key} disabled/>-->
<!--        <span class="map-detail-icon">-->
<!--          <Icon src={ui[fname+showDetails]?AiOutlineCaretDown:AiOutlineCaretRight}/>-->
<!--        </span>-->
<!--        </span>-->
{#if false}
  <div class="field">
    <div class="tree-branch array-value single map-detail-icon count delete-x">
      <input disabled class="array-item empty-value"/>
    </div>
  </div>
{/if}
<style>
</style>