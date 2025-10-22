<script lang='ts'>
  import {onMount} from 'svelte'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import type {Mo} from '../../../models/managedObjects/Mo.js'
  import {goto} from '$app/navigation'
  import {type MoMetaInterface} from '../../../models/managedObjects/MoMetaInterface.js'
  import type {Column, FirstDataRenderedEvent, GridOptions, GridSizeChangedEvent} from 'ag-grid-community'
  import {createGrid, type GridApi} from 'ag-grid-community' // does it work here? I had to put that in the app
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import {MoListModel} from '../../../models/managedObjects/MoList.model.js'
  import {BtnCellRenderer} from '../../../components/common/BtnCellRenderer.js'
  import {buildIconColDef, IconCellRenderer} from '../../common/IconCellRenderer.js'
  import {CgArrowRight} from 'svelte-icons-pack/cg'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  
  let {mos, moMeta, title = null, topButtons = false, height = '100px'}: {
    mos: Mo[],
    moMeta: MoMetaInterface,
    title?: string | null,
    topButtons?: boolean,
    height?: string
  } = $props()
  
  moMeta = moMeta || mos[0]?.moMeta
  title = title || moMeta.name
  
  const gridId = 'grid'
  let gridApi: GridApi
  let listModel = $derived(new MoListModel(moMeta, mos))
  let displayName = $state(moMeta?.moDef.getDisplayName())
  
  const createMo = () => goto(`/mo/${moMeta.name}/create`)

  let names: string[] = $state([])
  let eGridDiv
  onMount(() => {
    displayName = moMeta.moDef?.getDisplayName()
    names = mos.map(m => `moMeta: ${m.moMeta.name} moDef ${m.moMeta.moDef?.name} dataSource ${m.moMeta.dataSource?.constructor.name}`)
    eGridDiv = window.document.getElementById(gridId)
    if (!eGridDiv) throw new Rezult(ErrorName.missing_value)
    gridApi = createGrid(eGridDiv, gridOptions)
  })
  
  /* ------------
    * Grid Options
    * ------------
    */
  function onGridSizeChanged(params: GridSizeChangedEvent) {
    // get the current grids width
    const gridWrapper = window?.document?.getElementById('grid-wrapper')
    if (!gridWrapper) { return }
    const gridWidth = gridWrapper?.offsetWidth
    // keep track of which columns to hide/show
    const columnsToShow: string[] = []
    const columnsToHide: string[] = []
    // iterate over all columns (visible or not) and work out how many columns can fit (based on their minWidth)
    let totalColsWidth = 0
    const allColumns = gridApi?.getColumns()
    if (allColumns && allColumns.length > 0) {
      for (let i = 0; i < allColumns.length; i++) {
        const column: Column = allColumns[i]
        totalColsWidth += column.getMinWidth() || 0
        if (!column.isVisible() || (gridWidth && column && totalColsWidth > gridWidth)) {
          columnsToHide.push(column.getColId())
        } else {
          columnsToShow.push(column.getColId())
        }
      }
    }
    // show/hide columns based on current grid width
    gridApi?.setColumnsVisible(columnsToShow, true)
    // fill out any available space to ensure there are no gaps
    gridApi?.sizeColumnsToFit()
  }
  
  const goToView = (mo) => goto(`/mo/${mo.moMeta.name}/${mo.id}`)
  
  const buildGridOptions = (model): GridOptions<any> => {
    let gridFieldDefs: FieldDefinition<any>[] = Array.from(model.getFieldDefs().values())
    if (!gridFieldDefs.length) {
      gridFieldDefs = Array.from(model.moDef.fieldDefs.values())
    }
    if (model.moDef.gridFieldnames) {
      gridFieldDefs = gridFieldDefs.filter(d => model.moDef.gridFieldnames?.indexOf(d.name) !== -1)
    }
    const columnDefs = gridFieldDefs
      .map((def: FieldDefinition<any>) => def.buildColDef())
    const viewColumnDefs = buildIconColDef(CgArrowRight, goToView)
    columnDefs.push(viewColumnDefs)
    const rowData = model.mos
    const defaultColDef = {
      resizable: true
    }
    
    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit()
    }
    
    const components = {
      btnCellRenderer: BtnCellRenderer,
      iconCellRenderer: IconCellRenderer
    }
    
    return {defaultColDef, columnDefs, rowData, onFirstDataRendered, onGridSizeChanged, components}
  }
  
  let gridOptions: GridOptions = $derived(buildGridOptions(listModel))

  $effect(() => {
    if (gridApi && mos) {
      gridApi.setGridOption('rowData', mos);
    }
  })
</script>

<svelte:head>
  <title>Mos</title>
  <meta name='description' content={displayName}/>
</svelte:head>
<div class="grid-top">
  {#if title}
    <h2 class="title">{title}</h2>
  {/if}
  <span class="button-bar">
  {#if moMeta?.moDef.canCreate && topButtons}
    <button onclick={createMo}>Create {displayName}</button>
  {/if}
</span>
</div>
<div id="grid-wrapper" class={(height == '100%')?'grid-wrapper-full':'grid-wrapper'}>
  <div id="{gridId}" class="grid ag-theme-alpine"></div>
</div>
<style>
  .grid-top {
    display: flex;
    justify-content: space-between;
    .title {
      margin: 1rem 1rem 1rem 0;
      align-content: center;
    }
  }

  .button-bar {
  /*  display: flex;*/
  /*  justify-content: flex-end;*/
    margin: 1rem 2rem  1rem 0;
    @media(max-width: 800px) {
      margin-right: 0.8rem;
    }
  }
  
  .grid-wrapper {
    margin: 0 0.8rem 0 0;
    padding: 0;
    left: 0;
    width: calc(100% - 2rem);
    height: 100%;
    @media (max-width: 800px) {
      width: calc(100% - 0.8rem);
    }
  }
  
  .grid-wrapper-full {
    margin: 0 0.8rem 0 0;
    padding: 0;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    
    .grid {
      height: 100%;
    }
  }
  
  :global(.ag-root-wrapper-body.ag-layout-normal) {
    height: auto;
  }
</style>

