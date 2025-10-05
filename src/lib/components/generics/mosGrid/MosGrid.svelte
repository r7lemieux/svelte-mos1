<script lang='ts'>
  import type {Column} from 'ag-grid-community'
  import {createGrid} from 'ag-grid-community'
  
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import {onMount} from 'svelte'
  import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community' // does it work here? I had to put that in the app
  import {type GridReadyEvent, type GridApi} from 'ag-grid-community'
  import type {FirstDataRenderedEvent, GridSizeChangedEvent} from 'ag-grid-community'
  import type {GridOptions} from 'ag-grid-community'
  import type {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
  import type {MoListModel} from '../../../models/managedObjects/MoList.model.js'
  import {BtnCellRenderer} from '../../../components/common/BtnCellRenderer.js'
  import {buildIconColDef, IconCellRenderer} from '../../common/IconCellRenderer.js'
  import {CgArrowRight} from 'svelte-icons-pack/cg'
  import {goto} from '$app/navigation'
  import {Icon} from 'svelte-icons-pack'
  import {AiOutlineArrowRight} from 'svelte-icons-pack/ai'
  import {Rezult} from '../../../services/common/message/rezult.js'
  import {ErrorName} from '../../../services/common/message/index.js'
  
  export let height = '100px'
  export let gridId = 'grid'
  let grid
  export let model: MoListModel | null = null
  let displayName = ''
  let gridOptions: GridOptions
  let emptyGrid = false
  ModuleRegistry.registerModules([AllCommunityModule])
  let gridApi: GridApi | null = null
  let listModel: MoListModel
  /* ----------
   * Build Grid
   * ----------
   */
  // Props
  let {
    modelReady
  }: {modelReady: Promise<MoListModel>} = $props()
  
  // Svelte Ready
  let resolveSvelte: Function
  const svelteReadyPromise = new Promise(resolve => resolveSvelte = resolve)
  onMount(() => {
    resolveSvelte()
  })
  
  
  modelReady.then((listModel:MoListModel) => {
    if (!listModel) return Promise.reject(new Rezult(ErrorName.argument_null))
    const mos = listModel.mos
    displayName = listModel.moDef.getDisplayName()
    emptyGrid = !mos?.length
    const eGridDiv = window.document.getElementById(gridId)
    gridOptions = buildGridOptions(model)
    if (eGridDiv && gridOptions) {
      try {
        grid = createGrid(eGridDiv, gridOptions)
        return true
      } catch (err) {
        console.log(`==>ModelGrid.svelte:33 err`, err)
      }
    
  })
  
  let resolveAggrid: Function
  let resolveModel: Function
  const aggridReadyPromise = new Promise(resolve => resolveAggrid = resolve)
  const modelReadyPromise  = new Promise(resolve => resolveModel = resolve)
 
  const onGridReady = (params: GridReadyEvent) => {
    gridApi = params.api
    resolveAggrid(params.api)
  }
 
  
  Promise.all([svelteReadyPromise, aggridReadyPromise, modelReadyPromise]).then(
      ([sv, gridApi, listModel]) => {
        
        if (!listModel) return false
        displayName = listModel.moDef.getDisplayName()
        emptyGrid = !listModel?.mos?.length
        // if (model && !replaceId) {
        if (model && model.getName() === listModel.getName()) {
          gridApi.setGridOption('rowData', listModel.mos)
          return true
        } else {
          resetGrid()
        }
        model = listModel
        
    const eGridDiv = window.document.getElementById(gridId)
    const onGridReady = params => {
      gridApi = params.api
      const gridColumnApi = params.columnApi
      // The ag-grid is not enlarging based on the page height, so dynamically adjusting the height of the grid
      // gridApi.setDomLayout("autoHeight")
      
      gridOptions = buildGridOptions()
      if (eGridDiv && gridOptions) {
        try {
          grid = createGrid(eGridDiv, gridOptions)
          return true
        } catch (err) {
          console.log(`==>ModelGrid.svelte:33 err`, err)
        }
      }
    }
  })
  
  

  
  /* ------------
  * Grid Options
  * ------------
  */
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
    if (model.moDef.gridFieldnames) {
      gridFieldDefs = gridFieldDefs.filter(d => model?.moDef!.gridFieldnames?.indexOf(d.name) !== -1)
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
    
    function onGridSizeChanged(params: GridSizeChangedEvent) {
      // get the current grids width
      const gridWidth = window?.document?.getElementById('grid-wrapper')?.offsetWidth
      // keep track of which columns to hide/show
      const columnsToShow: string[] = []
      const columnsToHide: string[] = []
      // iterate over all columns (visible or not) and work out how many columns can fit (based on their minWidth)
      let totalColsWidth = 0
      const allColumns = gridApi.columnApi.getColumns()
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
      gridApi.setColumnsVisible(columnsToShow, true)
      // fill out any available space to ensure there are no gaps
      gridApi.sizeColumnsToFit()
    }
    
    const components = {
      btnCellRenderer: BtnCellRenderer,
      iconCellRenderer: IconCellRenderer
    }
    
    return {defaultColDef, columnDefs, rowData, onFirstDataRendered, onGridSizeChanged, onGridReady, components}
    // return {columnDefs, rowData, components}
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

</script>

<svelte:head>
  <title>Profile</title>
  <meta name='description' content='{displayName}'/>
</svelte:head>

<!--<GPicker doc={doc}/>-->
<div id="grid-wrapper" class={(height == '100%')?'grid-wrapper-full':'grid-wrapper'}>
  <!--  <div id="grid-wrapper" class={(height == '100%')?'grid-wrapper-full':'grid-wrapper'} style="height:{height}">-->
  <!--  <div id="grid-wrapper" class="grid-wrapper-full">-->
  <div id="{gridId}" class="grid ag-theme-alpine"></div>
</div>

<style>
  .grid-wrapper {
    margin: 0;
    padding: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .grid-wrapper-full {
    margin: 0;
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
