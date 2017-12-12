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
    font: ${fontSize * constant.DEVICE_PIXEL_RATIO}px ${fontFamily};
    line-height: ${lineHeight}px;
  `
  parentElement.appendChild(p)

  let textLines = (text + '').split('\n')
  let width = 0
  let height = 0
  let rows = textLines.length
  for (let i = 0, l = rows; i < l; i++) {
    p.innerHTML = textLines[i]
    height = Math.max(p.offsetHeight, height)
    width = Math.max(p.offsetWidth, width)
  }
  parentElement.removeChild(p)

  return {
    width: width,
    height: height * rows
  }
}

function createTextarea(painter, emitter, event, shape) {

  const { fontSize, fontFamily, lineHeight, x, y, fontItalic, fontWeight, caretColor, fillStyle } = shape
  const parentElement = document.body
  const fontHeight = getTextSize(shape, 'W').height

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
    outline: none;
    resize: none;
    padding: 0;
    overflow: hidden;
    width: ${fontSize}px;
    height: ${fontHeight} + 'px';
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

    let length = textarea.value.length
    let textareaSize = getTextSize(shape, textarea.value)

    textarea.style.width = (textareaSize.width / constant.DEVICE_PIXEL_RATIO + fontSize) + 'px'
    textarea.style.height = textareaSize.height + 'px'

    if (!textareaIsInCanvas(painter, textareaSize.width + x, textareaSize.height + y)) {
      textarea.maxLength = length
      textarea.blur()
      return
    }

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
      textarea.style.height = getTextSize(shape, textarea.value).height + 'px'
    }
  )
}

function textareaIsInCanvas(painter, offsetWidth, offsetHeight) {
  const { width, height } = painter.getCanvasSize()
  return offsetWidth < width
      && offsetHeight < height
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

  startDrawing (painter, emitter, event) {

    if (!textarea) {

      const { fontSize } = this

      this.x = event.x
      this.y = event.y
      this.lineHeight = fontSize + fontSize / 6
      if (!textareaIsInCanvas(painter, fontSize + this.x, this.lineHeight + this.y)) {
        return
      }
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
    let row = text.split('\n')
    painter.setFont(
      fontSize * constant.DEVICE_PIXEL_RATIO,
      fontFamily,
      fontItalic,
      fontWeight
    )

    let rect = getTextSize(this, text)
    rect.x = x
    rect.y = y

    return rect

  }

  toJSON() {
    return super.toJSON({
      name: 'Text',
      x: this.x,
      y: this.y,
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontItalic: this.fontItalic,
      fontWeight: this.fontWeight,
      lineHeight: this.lineHeight,
    })
  }

}
