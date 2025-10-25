<script lang="ts">
  import type {MoViewMode} from '../../../constants/ui.js'
  import {page} from '$app/state'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import SimpleField from './SimpleField.svelte'
  import ArrayField from './ArrayField.svelte'
  import MapField from './MapField.svelte'
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  import ObjectField from './ObjectField.svelte'
  import {moDefDef} from '../../../models/managedObjects/MoDefinition.js'
  import './field.css'
  
  let {
    fieldDef,
    value,
    viewMode = extractViewMode(),
    level,
    onChange
  } = $props()
  
  // export let fieldDef: FieldDefinition<any>
  // export let value: string
  // export let viewMode: MoViewMode = extractViewMode()
  // export let level: number = 1
  // export let onChange: (fieldId: string, value: any) => void
  viewMode = extractViewMode() // = view
  let disabled = $derived(!!viewMode)
  const fd = fieldDef
  
  function extractViewMode(): MoViewMode {
    const pathParts = page.url.pathname.split('/')
    const pathTail = pathParts[pathParts.length - 1]
    if (pathTail === 'edit') return 'edit'
    if (pathTail === 'create') return 'create'
    return 'view'
  }
  
  $effect(sizeLabels)

</script>
<h2>fd.type {fd.type}</h2>
{#if fd.type === 'array'}
  <ArrayField {fieldDef} {value} {viewMode} {level} {onChange}/>
{:else if fd.type === 'map'}
  <MapField {fieldDef} {value} {viewMode} {level} {onChange}/>
{:else if fd.type === 'object' || fd.type === 'mo' }
  <ObjectField {fieldDef} {value} {viewMode} {level} {onChange}/>
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