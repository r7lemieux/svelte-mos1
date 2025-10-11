<script lang="ts">
  import {setHeightToParent, sizeLabels} from '../../../services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  import './field.css'
  
  let {
    fieldDef,
    value,
    level = 1,
    viewMode = 'view',
    onChange
  } = $props()
  // export let name
  // export let fieldDef: FieldDefinition<any>
  // export let value: any
  // export let level: number = 1
  // export let viewMode: MoViewMode
  const fd = fieldDef
  
  let disabled = $derived(!!viewMode)
  const size = value ? Object.keys(value).length : 0
  const ui = {}
  let changed = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  let showDetails = $state(false)
  
  const displayName = value ? (value.getDisplayName()) : (value.name || value.constructor.name)
  const toogle = () => {
    showDetails = !showDetails
    sizeLabels()
  }
  const deleteItem = (key) => {
    delete value[key]
  }
  
  $effect(() => {
    sizeLabels()
    setHeightToParent('.tree-line')
  })
  
  const getParentHeight = (ele: Element) => ele?.parentElement?.offsetHeight
  const getParentHeight1 = (e) => {
    console.log(`==>ObjectField.svelte:45 e`, e)
    return 15
  }
  const seTreeLineHeight = (ele: Element) => ele?.parentElement?.offsetHeight
  
  const keys = value ?
               (Object.keys(value).filter(k => typeof value[k] !== 'function')) :
    []
</script>

<div class="field ObjectField">
  <!--  <label for={name}>{name}</label>-->
  <label for={fd.name}>{fd.displayName}</label>
  <span class="tree-line {showDetails?'open':'closed'}" onclick={toogle} onkeydown={toogle} role="button" tabindex="-2">
  </span>
  <span class="value">
      <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="-2">
        <span>{size}</span>
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"></span>
      </span>
      <span class="name">{displayName}</span>
  </span>
</div>
{#if showDetails}
  {#each keys.sort() as key}
    <!--<div>fieldDef {fieldDef.name}:  {value}</div>
-->
    <!--
    <Field {fieldDef} {value} {viewMode} {onChange} level={level + 1 } />
    -->
    <div class="field ObjectField-Details" style="margin-left:{(level+1)*12}px;">
      
      <label for="{key}">{key}</label>
      <span class="tree-line"></span>
      <span class="value">{value[key]?.toString()}</span>
    </div>
  {/each}
{/if}
{#if false}
  <div class="field tree-line open name value">
    <div class="detail-icon count tree-line open tree-branch delete-x array-value single map-detail-icon">
      <input disabled class="array-item detail-arrow open empty-value"/>
    </div>
  </div>
{/if}
<style>
.ObjectField {
    label {
      align-self: center;
      
      /*.value {*/
      /*  .name {*/
      /*    position: relative;*/
      /*    bottom: -0.1rem;*/
      /*  }*/
      /*}*/
    }
  }

.ObjectField-Details {
    label {
      align-self: start;
    }
  }
</style>