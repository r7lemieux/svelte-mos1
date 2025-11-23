<script lang="ts">
  import type {MoViewMode} from '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import {onMount} from 'svelte'
  import './field.css'
  
  let {
    fieldDef,
    value,
    level = 1,
    viewMode = 'view',
    onChange
  } = $props()
  
  // export let fieldDef: FieldDefinition<any>
  // export let value
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  
  let disabled = $derived(viewMode === 'view')
  const fd = fieldDef
  const fname = fieldDef.name
  
  let changed = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  let height
  onMount(() => {
    const ele = document.querySelector('.field') as HTMLElement
    height = ele!.offsetHeight
  })
</script>
<div class="field SimpleField" data-fdtype={fieldDef.type} style="margin-left:{level*12}px;">
  <label for={fname}>{fd.getDisplayName()} </label>
  <span class=" tree-line"></span>
  <span class="value simple-value">
    <input type={fd.inputType} name={fd.name} id="{fd.name}" value={fd.valueToString(value) || ''} onchange={changed}
           {disabled}/>
    </span>
</div>
{#if false}
  <div class="field tree-line open">
    <div class="detail-icon count tree-line open tree-branch delete-x array-value single map-detail-icon">
      <input class="array-item detail-arrow open empty-value"/>
    </div>
  </div>
{/if}
<style>
</style>
