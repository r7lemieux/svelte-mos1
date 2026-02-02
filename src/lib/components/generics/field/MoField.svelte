<script lang="ts">
  import {sizeLabels} from '../../../services/common/util/dom.utils.js'
  // import Field from './Field.svelte'
  import './field.css'
  import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
  import type {MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
  import type {FieldDefinitionInterface} from '../../../models/fields/FieldDefinition.interface.js'
  import type {MoFieldDefinition} from '../../../models/fields/MoFieldDefinition.js'
  import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
  import Field from './Field.svelte'
  import {goto} from '$app/navigation'
  import {AiOutlineCloseCircle} from 'svelte-icons-pack/ai'
  import {Icon} from 'svelte-icons-pack'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  import type {FieldMo} from '../../../models/fields/FieldMo.js'
  import MoSelect from './MoSelectField.svelte'
  import {getContext} from 'svelte'
  
  let {
    fieldDef,
    fieldname,
    value,
    parentMo,
    level = 1,
    viewMode = MoViewMode.view,
    onChange,
    inArray = false,
    parentUiPath = [],
    onRemove,
  }: {
    fieldDef: FieldDefinitionInterface<any>,
    fieldname: string,
    value: any,
    parentMo: MoidInterface,
    level: number,
    viewMode: MoViewModeEnum,
    onChange: any,
    inArray?: boolean,
    parentUiPath: string[],
    onRemove?: (fieldMo: FieldMo) => void
  } = $props()
  // export let name
  // export let fieldDef: FieldDefinition<any>
  // export let value: any
  // export let level: number = 1
  // export let viewMode: MoViewModeEnum
  const moFieldDef = $derived(fieldDef as MoFieldDefinition)
  const currentMo = getContext('currentMo') as MoidInterface
  const relation = $derived(parentMo._moMeta.relations[moFieldDef.name])
  const moName = $derived(relation.moMeta2.name)
  const moMeta = $derived(relation.moMeta2)
  // let fieldDefs: FieldDefinitionInterface<any>[] = $derived(Array.from(moMeta.moDef.fieldDefs.values()))
  // let moid = $derived(value as MoidInterface)
  const uiPath = $derived([...parentUiPath])
  const label = $derived(inArray ? '' : moFieldDef?.getDisplayName())
  
  let showDetails = $state(false)
  let loading = $state(false)
  let moid: MoidInterface = $derived(value as MoidInterface)
  let fullMo: MoInterface | null = $state(null)
  let d_fullMo: MoInterface | null = $derived(fullMo)
  let showFieldDefs = $derived(moMeta.moDef.showFieldnames.map(fn => moMeta.moDef.fieldDefs.get(fn)).filter(fd => !!fd))
  let mosOptions: MoInterface[] = []
  // const subViewMode = $derived((viewMode === MoViewMode.view) ? MoViewMode.view : MoViewMode.subEdit)
  // if (viewMode === 'create' || viewMode === 'edit') loadOptions()
  // let changed = event => {
  //   const fieldId = event.srcElement.id
  //   const value = event.srcElement.value
  //   onChange(fieldId, value)
  // }

  async function fetchDetails() {
    loading = true
    const url = `/api/mo/${moName}/${moid?.id}`
    const res = await fetch(url)
    const obj = await res.json()
    fullMo = await moMeta.objToMo(obj)
    loading = false
  }
  
  async function toggleShowDetails() {
    showDetails = !showDetails
    if (showDetails && !fullMo) {
      await fetchDetails()
    }
    //sizeLabels()
  }
  
  const onMoChange = async (selectedMo?: MoidInterface) => {
    if (selectedMo) {
      fullMo = await selectedMo?.toMo({trusted:false})
      onChange(fieldname, fullMo)
    }
  }
  const onLinkClick = () => {
    if (viewMode === MoViewMode.view) {
      goto(`/mo/${moName}/${moid.id}`, {replaceState: true})
    }
  }
  
  const onRemoveClick = () => {
    if (!onRemove || !moid?.id) {
      // console.log(`==>MoField.svelte:onDelete fails onDelete: ${!!onRemove}, !!moid: ${!!moid}, !!moid?.id: ${!!moid?.id}`)
      throw new Rezult(ErrorName.missing_id, {onDelete: !!onRemove, moid: !!moid, id: !!moid?.id}, 'onDelete')
    } else {
      onRemove({fieldname, mo: moid})
    }
  }
  $effect(() => {
    sizeLabels()
    const rel = currentMo._moMeta.relations[moFieldDef.name]
    if (!rel) {
      console.log(`==>MoField.svelte:111 no relations for `, currentMo)
    }
    
  })
  const moSelected = $derived(moid as MoInterface)
</script>
<div class="field moField" data-fdtype={moFieldDef.type} style="margin-left:{level*12}px;">
  <label for={fieldname}>{label}</label>
  <span class="tree-line {showDetails?'open':'closed'}" onclick={toggleShowDetails} onkeydown={toggleShowDetails} role="button"
        tabindex="-2">
  </span>
  <span class="value">
      <span class="count" onclick={toggleShowDetails} onkeydown={toggleShowDetails} role="button" tabindex="-2">
<!--        <span>{size}</span>-->
          <span class="detail-icon detail-arrow {showDetails?'open':'closed'}"></span>
      </span>
    {#if viewMode === MoViewMode.view || viewMode === MoViewMode.subEdit}
      <button type="button" onclick={onLinkClick} class='name linkButton' aria-label={moid?.displayName}
              disabled={!moid?.id}> {moid?.id} {moid?.displayName}</button>
    {/if}
    {#if viewMode === MoViewMode.create || viewMode === MoViewMode.edit}
      <MoSelect {moFieldDef} {fieldname} {moSelected} {mosOptions} {level} {viewMode} {parentUiPath} {onMoChange} />
    {/if}
    {#if inArray && viewMode === MoViewMode.edit}
      <button type="button" class="delete" onclick="{onRemoveClick}"><Icon src={AiOutlineCloseCircle}></Icon></button>
    {/if}
  </span>
</div>

  {#if showDetails}
    {#if loading}
      <span class="loading" style="margin-left:{level*12}px;">Loading…</span>
    {:else if d_fullMo}
      <!--    <p>moMeta.moDef.showFieldNames {moMeta.moDef.showFieldnames}</p>-->
      <!--    <p>showFieldDefs {showFieldDefs}</p>-->
      <!--    <p>{moMeta.moDef.fieldDefs.keys()}</p>-->
      {#each showFieldDefs as fd}
        <Field fieldDef={fd} value={d_fullMo[fd.name]} mo={d_fullMo} viewMode={MoViewMode.subEdit} {onChange} parentUiPath={uiPath} level={level + 1 } />
      {/each}
    {/if}
  {/if}
<style>
  
  .delete {
    color: var(--field-delete-color);
    background: transparent;
    border: none;
    padding-inline-start: 3px;
  }

</style>
