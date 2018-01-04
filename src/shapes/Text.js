/**
 * @file 文字
 * @author wangtianhua
 */
import Shape from './Shape'
import containRect from '../contain/rect'
import array from '../util/array'
import constant from '../constant'
import Emitter from '../Emitter'

const TRANSPARENT = 'rgba(0,0,0,0)'

let textarea
let p

function getTextSize(shape, text) {

  const { fontSize, fontFamily, lineHeight, x, y } = shape
  const parentElement = document.body
  p = document.createElement('p')
  p.style.cssText = `
    position: absolute;
    visibility: hidden;
    font: ${fontSize}px ${fontFamily};
    line-height: ${lineHeight}px;
  `
  parentElement.appendChild(p)

  let lines = (text + '').split('\n')
  if (lines[ lines.length - 1 ] === '') {
    lines[ lines.length - 1 ] = 'W'
  }

  p.innerHTML = lines.join('<br>')

  let { offsetWidth, offsetHeight } = p

  parentElement.removeChild(p)

  return {
    // 避免小数问题导致换行
    width: offsetWidth + 1,
    height: offsetHeight
  }
}

function createTextarea(painter, emitter, event, shape) {

  const { fontSize, fontFamily, lineHeight, x, y, fontItalic, fontWeight, caretColor, fillStyle } = shape
  const parentElement = document.body
  const fontHeight = getTextSize(shape, 'W').height

  const dpr = constant.DEVICE_PIXEL_RATIO
  const { width, height } = painter.getCanvasSize()
  const maxWidth = (width - shape.x) / dpr
  const maxHeight = (height - shape.y) / dpr

  textarea = document.createElement('textarea')

  let style = `
    position: absolute;
    left: ${event.pageX}px;
    top: ${event.pageY}px;
    color: ${TRANSPARENT};
    caret-color: ${caretColor};
    background-color: ${TRANSPARENT};
    font: ${fontSize}px ${fontFamily};
    line-height: ${lineHeight}px;
    border: 1px dashed ${fillStyle};
    box-sizing: content-box;
    outline: none;
    resize: none;
    padding: 0;
    overflow: hidden;
    width: ${fontSize}px;
    height: ${fontHeight}px;
    max-width: ${maxWidth}px;
    max-height: ${maxHeight}px;
    wrap: physical;
  `
  if (fontItalic) {
    style += 'font-style: italic;';
  }
  if (fontWeight) {
    style += 'font-weight: bold;';
  }
  textarea.style.cssText = style
  parentElement.appendChild(textarea)

  setTimeout(
    function () {
      textarea.focus()
    }
  )

  let savedData = painter.save()

  let locked = false

  let updateCanvas = function () {
    painter.restore(savedData)
    shape.text = textarea.value
    shape.draw(painter)
  }

  let onInput = function () {

    let { width, height } = getTextSize(
      shape,
      textarea.value || 'W'
    )

    textarea.style.width = width + 'px'
    textarea.style.height = height + 'px'

    if (!locked) {
      updateCanvas()
    }
  }

  let onCompositionStart = function () {
    locked = true
  }

  let onCompositionEnd = function () {
    locked = false
    updateCanvas()
  }

  let onBlur = function () {

    textarea.removeEventListener('input', onInput)
    textarea.removeEventListener('compositionstart', onCompositionStart)
    textarea.removeEventListener('compositionend', onCompositionEnd)
    textarea.removeEventListener('blur', onBlur)

    parentElement.removeChild(textarea)

    p = textarea = null

    emitter.fire(
      Emitter.SHAPE_DRAWING_END,
      {
        shape,
      }
    )

  }

  textarea.addEventListener('input', onInput)
  textarea.addEventListener('compositionstart', onCompositionStart)
  textarea.addEventListener('compositionend', onCompositionEnd)
  textarea.addEventListener('blur', onBlur)

  emitter.fire(
    Emitter.SHAPE_DRAWING_START,
    {
      cursor: 'text'
    }
  )

  emitter.on(
    Emitter.ACTIVE_SHAPE_ENTER,
    function (event) {
      if (!textarea) {
        return
      }
      textarea.style.height = getTextSize(shape, textarea.value || 'W').height + 'px'
    }
  )
}

export default class Text extends Shape {

  isPointInPath(painter, x, y) {
    return containRect(this.getRect(painter), x, y)
  }

  drawPath(painter) {
    const rect = this.getRect(painter)
    painter.drawRect(rect.x, rect.y, rect.width, rect.height)
  }

  fill(painter) {
    const { x, y, text, fontSize, fontFamily, fontItalic, fontWeight } = this
    const dpr = constant.DEVICE_PIXEL_RATIO

    painter.setFillStyle(this.fillStyle)
    painter.setFont(
      fontSize * dpr,
      fontFamily,
      fontItalic,
      fontWeight
    )
    const height = fontSize * dpr + fontSize * dpr / 6
    array.each(
      text.split('\n'),
      function (value, index) {
        painter.fillText(x, y + fontSize * dpr + height * index, value)
      }
    )
  }

  stroke(painter) {

    const { x, y, text, fontSize, fontFamily, fontItalic, fontWeight, lineWidth, strokeStyle } = this

    const dpr = constant.DEVICE_PIXEL_RATIO

    painter.setLineWidth(lineWidth)
    painter.setStrokeStyle(strokeStyle)
    painter.setFont(
      fontSize * dpr,
      fontFamily,
      fontItalic,
      fontWeight
    )
    const height = fontSize * dpr + fontSize * dpr / 6

    array.each(
      text.split('\n'),
      function (value, index) {
        painter.strokeText(x, y + fontSize * dpr + height * index, value)
      }
    )
  }

  startDrawing(painter, emitter, event) {

    if (!textarea) {

      this.x = event.x
      this.y = event.y
      this.lineHeight = this.fontSize + this.fontSize / 6

      createTextarea(painter, emitter, event, this)
    }

    return false

  }

  validate() {
    const { text } = this
    return text && text.trim().length
  }

  save(rect) {
    return {
      x: (this.x - rect.x) / rect.width,
      y: (this.y - rect.y) / rect.height,
    }
  }

  restore(rect, data) {
    this.x = rect.x + rect.width * data.x
    this.y = rect.y + rect.height * data.y
  }

  getRect(painter) {

    const { x, y, text, fontSize, fontFamily, fontItalic, fontWeight } = this

    painter.setFont(
      fontSize * constant.DEVICE_PIXEL_RATIO,
      fontFamily,
      fontItalic,
      fontWeight
    )

    let rect = getTextSize(this, text)
    rect.x = x
    rect.y = y
    rect.width *= constant.DEVICE_PIXEL_RATIO
    rect.height *= constant.DEVICE_PIXEL_RATIO

    return rect

  }

  toJSON() {
    return super.toJSON({
      name: 'Text',
      x: this.x,
      y: this.y,
      text: this.text,
      fontSize: this.fontSize * constant.DEVICE_PIXEL_RATIO,
      fontFamily: this.fontFamily,
      fontItalic: this.fontItalic,
      fontWeight: this.fontWeight,
      lineHeight: this.lineHeight,
    })
  }

}
