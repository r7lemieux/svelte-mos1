export class IconCellRenderer {
  eGui
  params

  // init method gets the details of the cell to be renderer
  init(params) {
    this.params = params
    this.eGui = document.createElement('div')
    this.eGui.innerHTML =
      `<svg width="1em" height="1em" stroke-width="0" class="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
       <g><path fill="none" d="M0 0h24v24H0z"></path>
         ${params.path.c}
       </g></svg>`
    this.btnClickedHandler = this.btnClickedHandler.bind(this)
    this.eGui.addEventListener('click', this.btnClickedHandler)
  }

  getGui() {
    return this.eGui;
  }
  destroy() {
    this.eGui.removeEventListener('click', this.btnClickedHandler)
  }
  btnClickedHandler(event) {
    this.params.onClick(this.params.data)
  }
  refresh(params) {
    return false;
  }
}

export const buildIconColDef = (icon, onClick) => {
  return {
    hide: false,
    headerName: ' ',
    minWidth: 35,
    maxWidth: 35,
    flex: 3,
    cellStyle: {padding: '0.2rem 0.1rem 0 0.5rem'},
    cellRenderer: 'iconCellRenderer',
    cellRendererParams: {
      onClick,
      path: icon
    }
  }
}
