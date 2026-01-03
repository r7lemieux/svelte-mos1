<script lang="ts">
  import {MoViewMode, type MoViewModeEnum} from '$lib/constants/ui.js'
  // import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
  // import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import './field.css'
  import {onMount} from 'svelte'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import type {EnumFieldDefinition} from '../../../models/fields/EnumFieldDefinition.js'
  
  let {
    fieldDef,
    value,
    options = [],
    level = 1,
    viewMode = MoViewMode.view,
    parentUiPath = [],
    onChange
  }: {
    fieldDef: FieldDefinition<any>,
    value: any,
    options?: any[],
    level: number,
    viewMode: MoViewModeEnum,
    parentUiPath: string[],
    onChange: (fieldId: string, val: any) => void,
  } = $props()
  
  const labelText = $derived(fieldDef.getDisplayName())
  const selected = $derived([value])
  const efd = fieldDef as EnumFieldDefinition
  const fname = fieldDef.name
  let s_options = options.length ? options : Object.keys(efd.validValues)
  // let sSelected: any[] | undefined = $state(selected)
  
  const isSelected = (opt: any) => !!selected.find(sel => sel === opt)
  
  onMount(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'
    script.defer = true
    document.body.appendChild(script)
  })
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
</svelte:head>

<div class="field selectField" data-fdtype={fieldDef.type} style="margin-left:{level*12}px;">
  <label for={fname}>{labelText}</label>
  <span class=" tree-line"></span>
  <span class="value">
    {#if viewMode === 'view'}
      <input class='name' aria-label={value} disabled {value} />
    {/if}
    {#if viewMode === 'create' || viewMode === 'edit'}
      <select name={fname}>
        {#each s_options as option}
          <option label={option} value={option} selected="{isSelected(option)}"></option>
        {/each}
      </select>
    {/if}
  </span>
</div>

<style>
</style>
