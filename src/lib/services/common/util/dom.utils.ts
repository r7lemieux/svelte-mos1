import {MoViewMode, type MoViewModeEnum} from '../../../constants/ui.js'
import {page} from '$app/state'

export const computeHeight = () => Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
)
export type InputTypes = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' |
  'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' |
  'time' | 'url' | 'week'

export const sizeLabels = () => {
  return
  const elems = Array.from(document.getElementsByTagName('label'))
  for (const elem of elems) {
    const txt = elem.innerText
    const testElem = document.createElement('span')
    document.body.appendChild(testElem)
    testElem.innerText = txt
    const fontStyle = window.getComputedStyle(elem, null).getPropertyValue('font')
    testElem.style.font = fontStyle
    const textWidth = testElem.offsetWidth
    const elemWidth = elem.offsetWidth
    if (textWidth > elemWidth - 10) {
      const fontSizeStyle = window.getComputedStyle(elem, null).getPropertyValue('font-size')
      const fontSize = Number.parseInt(fontSizeStyle.match(/\d*/)![0])
      elem.style.fontSize = `${fontSize! - 2}px`
    }
    document.body.removeChild(testElem)
  }
}

export const setHeightToParent = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector))
  for (let ele of elements) {
    const height = ele.parentElement.offsetHeight
    ele.style.height = height + 'px'
  }
}

export function extractViewMode(): MoViewModeEnum {
  const pathParts = page.url.pathname.split('/')
  const pathTail = pathParts[pathParts.length - 1]
  if (pathTail === 'edit') return MoViewMode.edit
  if (pathTail === 'create') return MoViewMode.create
  return MoViewMode.view
}

export const formDataToObj = (formData: FormData): any => {
  const partialMo = {}
  formData.forEach((v, k) => {
    if (partialMo[k]) {
      if (!(partialMo[k] instanceof Array)) {
        partialMo[k] = [partialMo[k]]
      }
      partialMo[k].push(v)
    }
  })
  return partialMo
}


export const getDocumentHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
