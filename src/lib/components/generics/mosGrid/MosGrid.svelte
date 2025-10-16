<script lang='ts'>
  import type {Column, FirstDataRenderedEvent, GridOptions, GridSizeChangedEvent} from 'ag-grid-community'
  import {AllCommunityModule, createGrid, type GridApi, ModuleRegistry} from 'ag-grid-community' // does it work here? I had to put that in the app
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import {onMount} from 'svelte'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import type {MoListModel} from '../../../models/managedObjects/MoList.model.js'
  import {BtnCellRenderer} from '../../../components/common/BtnCellRenderer.js'
  import {buildIconColDef, IconCellRenderer} from '../../common/IconCellRenderer.js'
  import {CgArrowRight} from 'svelte-icons-pack/cg'
  import {goto} from '$app/navigation'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/errorName.js'
  
  let {
    height = '100px',
    gridId = 'grid',
    modelReady
  }: {height?: string, gridId?: string, modelReady: Promise<MoListModel>} = $props()
  
  let displayName = $state()
  let gridOptions: GridOptions
  let emptyGrid = false
  ModuleRegistry.registerModules([AllCommunityModule])
  let gridApi: GridApi | null = null

  // OnMount promise
  let resolveSvelte: Function
  const svelteReadyPromise = new Promise(resolve => resolveSvelte = resolve)
  onMount(() => {
    resolveSvelte()
  })
  
  // model and svelte are ready
  Promise.all([modelReady, svelteReadyPromise])
    .then(([listModel]) => {
      if (!listModel) return Promise.reject(new Rezult(ErrorName.argument_null))
      const mos = listModel.mos
      displayName = listModel.moDef.getDisplayName()
      emptyGrid = !mos?.length
      gridOptions = buildGridOptions(listModel)
      if (!gridOptions) throw new Rezult(ErrorName.missing_value)
      return gridOptions
    })
    .then (gridOptions => {
      const eGridDiv = window.document.getElementById(gridId)
      if (!eGridDiv) throw new Rezult(ErrorName.missing_value)
      return createGrid(eGridDiv, gridOptions)
    })
    .then(api => {
      gridApi = api
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
  
  const goToView = (mo) => {
    goto(`/mo/${mo.moMeta.name}/${mo.id}`)
      .then(r => {
        console.log(`==>MosGrid.svelte:67 r`, r)
        return r
      })
      .catch(e => {
        console.log(`==>MosGrid.svelte:71 catch e`, e)
        throw e
      })
  }
  
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
    
    const resetGrid = () => {
      emptyGrid = !model?.mos?.length
      const height = emptyGrid ? '200px' : '100%'
      const grid = window.document.getElementById(gridId)
      const wrapper = grid!.parentElement
      grid!.remove()
      const newGrid = window.document.createElement('div')
      newGrid.setAttribute('id', gridId)
      newGrid.classList.add('grid')
      newGrid.classList.add('ag-theme-alpine')
      newGrid.setAttribute('style', `height: ${height};`)
      // newGrid.setAttribute('class', 'grid ag-theme-alpine')
      wrapper!.appendChild(newGrid)
    }
    return {defaultColDef, columnDefs, rowData, onFirstDataRendered, onGridSizeChanged, components}
    // return {columnDefs, rowData, components}
  }

</script>

<svelte:head>
  <title>Profile</title>
<!--  <meta name="description" content={displayName}/>-->
</svelte:head>

<!--<GPicker doc={doc}/>-->
<div id="grid-wrapper" class={(height == '100%')?'grid-wrapper-full':'grid-wrapper'}>
  <!--  <div id="grid-wrapper" class={(height == '100%')?'grid-wrapper-full':'grid-wrapper'} style="height:{height}">-->
  <!--  <div id="grid-wrapper" class="grid-wrapper-full">-->
  <div id="{gridId}" class="grid ag-theme-alpine"></div>
</div>

<style>
  .grid-wrapper {
    margin: 0 0.8rem 0 0;
    padding: 0;
    left: 0;
    width: calc(100% - 2rem);
    height: 100%;
    @media(max-width: 800px) {
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
