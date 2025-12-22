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
  import {getContext} from 'svelte'
  import type {OpenPathsContext} from '../../../services/common/util/pathContext.js'
  import {areArraysEqual} from '../../../services/common/util/array.utils.js'
  import {get} from 'svelte/store'
  
  let {
    fieldDef,
    fieldname,
    value = [],
    level = 1,
    viewMode = MoViewMode.view,
    onChange,
    parentUiPath = [],
    onMoRemove,
  }: {
    fieldDef: FieldDefinition<any>,
    fieldname: string,
    value: any,
    level: number,
    viewMode: MoViewModeEnum,
    onChange:any,
    parentUiPath: string[]
    onMoRemove?: (fieldMo: FieldMo) => void
  } = $props()

  // console.log(`==> MoArrayField.svelte:23 value `, value);
  // console.log(`==> MoArrayField.svelte:24 typeof value `, typeof value);
  let values = $state(value as Array<MoidInterface>)
  let fieldsMoToRemove: FieldMo[] = $state([])
  
  const fd: MoFieldDefinition = fieldDef as MoFieldDefinition
  const fname = fieldDef.name
  const inArray = true
  const moItemFieldDef = fieldDef.clone()
  moItemFieldDef.type = 'mo'
  const uiPath = parentUiPath
  const removeMos = (vs, fields) => {
    return vs.filter(v => !fields.find(fm => fm.mo.isSameAs(v)))
  }
  let mos = $derived(removeMos(values, fieldsMoToRemove))
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

  let openPaths = getContext('openPaths') as string[]
  let showDetails = $derived(!!openPaths[uiPath.join('_')])
  
  const toggle = () => {
    showDetails = !showDetails
    openPaths[uiPath.join('_')] = showDetails
  }
 
  const onRemove = (fieldMo: FieldMo) => {
    if (!onMoRemove) return {}
    // values = values.filter(mo => !mo.isSameAs(fieldMo.mo) )
    fieldsMoToRemove = [...fieldsMoToRemove, fieldMo]
    console.log(`==>MoArrayField.svelte:74 fieldsMoToRemove`, fieldsMoToRemove.map(fm => `${fm.fieldname}.${fm.mo.displayName}`))
    //return onMoRemove(fieldMo)
  }
  $effect(() => {
    // console.log(`==>MoArrayField.svelte:79 fieldsMoToRemove`, fieldsMoToRemove.map(fm => `${fm.fieldname}.${fm.mo.displayName}`))
    //mos = values.filter(v => !fieldsMoToRemove.find(fm => fm.mo.isSameAs(v)))
    console.log(`==>MoArrayField.svelte:80 mos`, mos.map(m => m.displayName))
  })

</script>
<div class="field ArrayField MoArrayField" data-fieldtype={fd.type} style="margin-left:{level*12}px;">
  <label for={fname}>{fd.getDisplayName()}</label>
  <span class=" tree-line {showDetails?'open':'closed'}"></span>
  <span class="value">
    <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="0">
      <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
      </span>
    </span>
      <span class="size">{size}</span>
  </span>
</div>
{#if showDetails}
  {#each (mos || []) as item}
    <MoField {fieldname} fieldDef={moItemFieldDef} value={item} {viewMode} level={level + 1} onChange={changed} parentUiPath={uiPath} {inArray} {onRemove} />
  {/each}
{/if}
${mos.map(m=>m.displayName)}
<style>
</style>
