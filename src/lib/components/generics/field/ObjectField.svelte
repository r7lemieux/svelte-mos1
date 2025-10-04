<script lang="ts">
  import {setHeightToParent, sizeLabels} from '../../../services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  
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
  
  const displayName = value ? (value.getDisplayName) : (value.name || value.constructor.name)
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