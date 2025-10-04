<script lang="ts">
  import type {MoViewMode} from '../../../constants/ui.js'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import MapValueField from './MapValueField.svelte'
  import {onMount} from 'svelte'
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  let {
    fieldDef,
    value,
    level = 1,
    onChange,
    viewMode = 'view'
  } = $props()
  let disabled = $derived(!!viewMode)
  const fd = fieldDef
  const fname = fieldDef.name
  const size = (Array.from(value.keys())).length
  const ui = {}
  const valueType = fieldDef.mapValueType
  let changed = event => {
    const fieldId = event.srcElement.id
    const value = event.srcElement.value
    onChange(fieldId, value)
  }
  let showDetails = $state(false)
  const toogle = () => {
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
  <span class=" tree-line {showDetails?'open':'closed'}" onclick={toogle} onkeydown={toogle} role="button"
        tabindex="0">
<!--    <span class="top tree-line1"/>-->
<!--    <span class="arrow {showDetails?'open':'closed'}"/>-->
<!--    <span class="bot {showDetails?'open tree-line':'closed'}"/>-->
  </span>
  <span class="value">
      <span class="count" onclick={toogle} onkeydown={toogle} role="button" tabindex="0">
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

/*.tree-line.open*/

/*  border-bottom: 2px solid field.$tree-line-color*/

/*  width: 9px*/

/*  position: relative*/

/*  left: 1px*/

/*.tree-indicator*/

/*  &.tree-line.open*/

/*    height: 13px*/

/*  .top.open*/

/*    border-bottom: 2px solid field.$tree-line-color*/

/*    position: relative*/

/*    top: -9.7px*/

/*    left: 1px*/

/*  .arrow*/

/*    color: field.$tree-line-color*/

/*    display: block*/

/*    &.closed::after*/

/*      content: '\25B7'*/

/*      font-size: x-large*/

/*      font-weight: bold*/

/*      display: block*/

/*      left: -2px*/

/*      position: relative*/

/*    &.open::after*/

/*      display: inline-block*/

/*      content: '\25B7'*/

/*      font-weight: bold*/

/*      font-size: x-large*/

/*      color: #88A*/

/*      bottom: -7px*/

/*      left: 1px*/

/*      position: relative*/

/*      display: inline-block*/

/*      -webkit-transform: rotate(90deg)*/

/*      transform: rotate(90deg)*/

/*  .bot.open*/

/*    display: block*/

/*    position: relative*/

/*    height: 10px*/

/*    left: 7.4px*/
</style>