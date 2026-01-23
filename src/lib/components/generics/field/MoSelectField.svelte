<script lang="ts">
  import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
  // import { AiOutlineCaretDown } from 'svelte-icons-pack/ai'
  // import { AiOutlineCaretRight } from 'svelte-icons-pack/ai'
  // import AiOutlineCaretDown from 'svelte-icons-pack/ai/AiOutlineCaretDown'
  // import AiOutlineCaretRight from 'svelte-icons-pack/ai/AiOutlineCaretRight'
  import './field.css'
  import {type MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
  import type {MoFieldDefinition} from '../../../models/fields/MoFieldDefinition.js'
  import {getContext, onMount} from 'svelte'
  import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
  import {page} from '$app/state'
  import {objectToMoidSync} from '../../../services/mo/moTransport.implementation.js'
  import {RelationMetas} from '../../../models/managedObjects/RelationMeta.js'
  
  let {
    moFieldDef,
    fieldname,
    moSelected, // $bindable<MoidInterface[]>(),
    mosOptions = [],
    viewMode = MoViewMode.view,
    parentUiPath = [],
    onMoChange = () => {}
  }: {
    moFieldDef: MoFieldDefinition,
    fieldname: string,
    moSelected: MoidInterface | undefined,
    mosOptions: MoInterface[],
    level: number,
    viewMode: MoViewModeEnum,
    parentUiPath: string[],
    onMoChange?: (smo: MoidInterface | undefined) => void,
  } = $props()
  
  const fd = moFieldDef
  const fname = moFieldDef.name
  // const relationMeta = RelationMetas[]
  let s_options = $state(!!mosOptions.length? mosOptions: moSelected? [moSelected] : [] )
  // moItemFieldDef.type = 'mo' // delete
  const uiPath = parentUiPath
  let sSelected: MoidInterface | undefined = $state(moSelected)
  
  let openPaths = getContext('openPaths') as string[]
  let showDetails = $derived(!!openPaths[uiPath.join('_')])
  
  const toggle = () => {
    showDetails = !showDetails
    openPaths[uiPath.join('_')] = showDetails
  }
  let loading = false
  let loaded = false
  const currentMo = getContext('currentMo') as MoInterface
  const relation = currentMo.moMeta.relations[moFieldDef.name]
  const isSelected = (moid: MoidInterface) => !!moSelected?.isSameAs(moid)
  // let inputFormEl: HTMLInputElement
  // let inputUiEl: HTMLInputElement
  const loadOptions = () => {
    if (loading || loaded) return
    loading = true
    const url = `${page.url.origin}/api/mo/${relation.moMeta2.name}`
    fetch(url)
      .then(response => response.json())
      .then((responseData) => Promise.all(responseData.map((obj:any) => objectToMoidSync(obj))))
      .then(mos => {
        s_options = mos
        loaded = true
      })
  }
  let selectElm: HTMLSelectElement
  const onchange = () => {
    // const optionEls = inputEl.querySelector('option')
    const optionElms = selectElm?.querySelectorAll('option')
    const selectedOptionElm = Array.from(optionElms).find(elm => elm.selected)
    const selectedId = selectedOptionElm?.value
    sSelected = s_options?.find(o => o?.id?.toString() === selectedId)
    //sSelected = mosOptions.filter(mo => mo.displayName === selectElm.value)
    console.log(`==>MoSelect.svelte:74 sSelected`, sSelected)
    onMoChange(sSelected)
  }
  
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

<span class="value">
  {#if relation.relationDef.max1 > 1}
    <span class="count" onclick={toggle} onkeydown={toggle} role="button" tabindex="0">
      <span class="detail-icon detail-arrow {showDetails?'open':'closed'}">
      </span>
     </span>
  {/if}
  
  <!--  <input name={fname} id={fname} bind:this={inputFormEl} />-->
  <select class="value" name={fname} onclick={loadOptions} onmouseover={loadOptions} onfocus={loadOptions} {onchange}
   disabled={fd.type === 'moArray'} bind:this={selectElm} >
    {#each s_options as optionMo (optionMo.id)}
      <option label={optionMo.displayName} value={optionMo.id} selected="{isSelected(optionMo)}"></option>
    {/each}
  </select>
  
  <!--  <input name={fname} id={fname} bind:this={inputFormEl} />-->
  <!--  <input list={listName} onclick={loadOptions} onmouseover={loadOptions} onfocus={loadOptions}-->
  <!--         bind:this={inputUiEl} {onchange}/>-->
  <!--  <datalist id={listName}>-->
  <!--    {#each mosOptions as optionMo (optionMo.id)}-->
  <!--      <option label={optionMo.displayName} value={optionMo.id} selected="{mosSelected.includes(optionMo)}"></option>-->
  <!--    {/each}-->
  <!--  </datalist>-->

</span>

<style>
</style>
