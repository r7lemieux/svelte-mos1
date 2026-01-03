<script lang="ts">
  import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
  import {page} from '$app/state'
  import SimpleField from './SimpleField.svelte'
  import SelectField from './SelectField.svelte'
  import ArrayField from './ArrayField.svelte'
  import MapField from './MapField.svelte'
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  import ObjectField from './ObjectField.svelte'
  import './field.css'
  import MoArrayField from './MoArrayField.svelte'
  import MoField from './MoField.svelte'
  import Init from '../../common/Init.svelte'
  import type {FieldDefinitionInterface} from '../../../models/fields/FieldDefinition.interface.js'
  import type {FieldMo} from '../../../models/fields/FieldMo.js'
  
  let {
    fieldDef,
    value,
    viewMode = extractViewMode(),
    level,
    onChange,
    parentUiPath = [],
    onMoRemove,
  }: {
    fieldDef: FieldDefinitionInterface<any>,
    value: any,
    viewMode: MoViewModeEnum,
    level: number,
    onChange: (fieldId: string, val: any) => void,
    parentUiPath?: string[],
    onMoRemove?: (fieldMo: FieldMo) => void,
  } = $props()
  const d_value = $derived(value)
  // export let fieldDef: FieldDefinition<any>
  // export let value: string
  // export let viewMode: MoViewModeEnum = extractViewMode()
  // export let level: number = 1
  // export let onChange: (fieldId: string, value: any) => void
  // viewMode = extractViewMode() // = view
  const fd = fieldDef
  const uiPath = [...parentUiPath, fieldDef.name]
  function extractViewMode(): MoViewModeEnum {
    const pathParts = page.url.pathname.split('/')
    const pathTail = pathParts[pathParts.length - 1]
    if (pathTail === 'edit') return MoViewMode.edit
    if (pathTail === 'create') return MoViewMode.create
    return MoViewMode.view
  }
  $effect(sizeLabels)
</script>
<Init/>

{#if fd.type === 'array'}
  <ArrayField {fieldDef} {value} {viewMode} {level} {onChange} />
{:else if fd.type === 'moArray'}
  <MoArrayField fieldname={fieldDef.name} {fieldDef} value={d_value} {viewMode} {level} {onChange} parentUiPath={uiPath} {onMoRemove} />
{:else if fd.type === 'map'}
  <MapField {fieldDef} {value} {viewMode} {level} {onChange}/>
{:else if fd.type === 'mo'}
  <MoField fieldname={fieldDef.name} {fieldDef} value={d_value} {viewMode} {level} parentUiPath={uiPath} {onChange} />
{:else if fd.type === 'object' }
  <ObjectField {fieldDef} {value} {viewMode} {level} {onChange}/>
{:else if fd.type === 'enum' }
  <SelectField {fieldDef} {value} {viewMode} {level}  parentUiPath={uiPath} {onChange}/>
{:else}
  <SimpleField {fieldDef} {value} {viewMode} {level} {onChange}/>
{/if}

<style>
  /*// @use 'field'*/
  /*//.tree-indicator*/
  /*//  border-left: 4px solid #888*/
  /*//  display: block*/
  /*//  content: ''*/
  /*//  height: 2.5rem*/
  /*//.count, .array-value, .array-item, .simple-value, .map-value*/
  /*//  display: inline-block*/
  /*//  height: 2.5rem*/
  /*//  width: 100%*/

</style>
