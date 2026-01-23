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

  let {
    fieldDef,
    fieldname,
    value,
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
  // let values = $state(value as Array<MoidInterface> | [] as Array<MoidInterface>)
  let mos = $derived(value.filter(v => !fieldsMoToRemove.find(m => m.mo.id === v.id)))
  let fieldsMoToRemove: FieldMo[] = $state([])
  const fd: MoFieldDefinition = fieldDef as MoFieldDefinition
  const fname = fieldDef.name
  const inArray = true
  const moItemFieldDef = fieldDef.clone()
  moItemFieldDef.type = 'mo'
  const uiPath = $state(parentUiPath)
  const changed = (fieldId: string, item: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const index = Number.parseInt(fieldId)
    // if (index === -2) {
    //   values.push(item)
    // } else {
    //   values[index] = item
    // }
    // values = [...values]
    // onChange(fieldDef.name, values)
  }

  const size = $derived(value?.length)
  let showDetailToggle = $state(false)
  let openPaths = getContext('openPaths') as string[] // path of the open branches in the tree
  let showDetails = $derived(showDetailToggle || !!openPaths[uiPath.join('_')])
  const toggle = () => {
    showDetailToggle = !showDetailToggle
    openPaths[uiPath.join('_')] = showDetailToggle
  }
 
  const onRemove = (fieldMo: FieldMo) => {
    if (!onMoRemove) return {}
    const index = value.indexOf(mo => !mo.isSameAs(fieldMo.mo) )
    value.splice(index, 1)
    fieldsMoToRemove = [...fieldsMoToRemove, fieldMo]
    // console.log(`==>MoArrayField.svelte:74 fieldsMoToRemove`, fieldsMoToRemove.map(fm => `${fm.fieldname}.${fm.mo.displayName}`))
    return onMoRemove(fieldMo)
  }
  $effect(() => {
    // console.log(`==>MoArrayField.svelte.effect:74 `)
    // console.log(`==>MoArrayField.svelte.effect:75 mos`, $inspect(mos))
    // console.log(`==>MoArrayField.svelte.effect:76 mos`, $state.snapshot(mos))
  })

</script>
<div class="field ArrayField MoArrayField" data-fieldtype={fd.type} style="margin-left:{level*12}px;">
  <span class="label">{fd.getDisplayName()}</span>
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
  {#each mos as item (item.id)}
    <MoField {fieldname} fieldDef={moItemFieldDef} value={item} {viewMode} level={level + 1} onChange={changed} parentUiPath={uiPath} {inArray} {onRemove} />
  {/each}
{/if}

<style>
</style>
