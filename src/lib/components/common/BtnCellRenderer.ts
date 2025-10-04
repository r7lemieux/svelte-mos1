export class BtnCellRenderer {
  eGui
  params

  // init method gets the details of the cell to be renderer
  init(params) {
    this.params = params
    this.eGui = document.createElement('div')
    this.eGui.innerHTML = params.buildHtml ? params.buildHtml(params.value) : params.value,
      this.btnClickedHandler = this.btnClickedHandler.bind(this)
    this.eGui.addEventListener('click', this.btnClickedHandler)
  }

  getGui() {
    return this.eGui
  }

  destroy() {
    this.eGui.removeEventListener('click', this.btnClickedHandler)
  }

  btnClickedHandler(event) {
    this.params.clicked(this.params.data.id)
  }

  refresh(params) {
    return false
  }
}