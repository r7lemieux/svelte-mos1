<script lang="ts">
  import type {MoViewMode, MoViewModeEnum} from '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import {onMount} from 'svelte'
  import './field.css'
  import type {FieldDefinitionInterface} from '../../../models/fields/FieldDefinition.interface.js'
  
  let {
    fieldDef,
    value,
    level = 1,
    viewMode = 'view',
    onChange
  }: {
    fieldDef: FieldDefinitionInterface<any>,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange: (fieldId: string, any) => void
  } = $props()
  const val = 5
  // export let fieldDef: FieldDefinition<any>
  // export let value
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  
  let disabled = $derived(viewMode === 'view' || viewMode === 'subEdit')
  const fd = $derived(fieldDef)
  const fname = $derived(fieldDef.name)
  const labelText = $derived(fieldDef.getDisplayName())
  let onchange = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  let height
  onMount(() => {
    const ele = document.querySelector('.field') as HTMLElement
    height = ele!.offsetHeight
  })
  const fn = 'fname' + Math.floor(Math.random() * 10000)
</script>
<div class="field SimpleField" data-fdtype={fieldDef.type} style="margin-left:{level*12}px;">
  <label for={fn}>{labelText}</label>
  <span class=" tree-line"></span>
  <span class="value simple-value">
<!--      <input type={fd.inputType} name={fn} id={fn} value={val} {onchange} {disabled} />-->
      <input type={fd.inputType} name={fname} id={fname} value={fd.valueToString(value) || ''} {onchange} {disabled} />
  </span>
</div>
<style>
</style>
