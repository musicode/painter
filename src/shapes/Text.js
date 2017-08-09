/**
 * @file 文字
 * @author wangtianhua
 */
define(function (require) {

  const Shape = require('./Shape')
  const containRect = require('../contain/rect')
  const array = require('../util/array')
  const Emitter = require('../Emitter')
  const getDevicePixelRatio = require('../function/getDevicePixelRatio')

  const TRANSPARENT = 'rgba(0,0,0,0)'
  const CURSOR_COLOR = 'rgba(0,0,0,1)'

  const dpr = getDevicePixelRatio()

  let textarea
  let p

  function getTextSize (shape, text) {

    const { fontSize, fontFamily, lineHeight, x, y } = shape
    const parentElement = document.body
    p = document.createElement('p')
    p.style.cssText = `
      position: absolute;
      visibility: hidden;
      font: ${fontSize * dpr}px ${fontFamily};
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

    const { fontSize, fontFamily, lineHeight, x, y } = shape
    const parentElement = document.body

    textarea = document.createElement('textarea')
    textarea.style.cssText = `
      position: absolute;
      left: ${event.pageX}px;
      top: ${event.pageY}px;
      color: ${TRANSPARENT};
      caret-color: ${CURSOR_COLOR};
      background-color: ${TRANSPARENT};
      font: ${fontSize}px ${fontFamily};
      line-height: ${lineHeight}px;
      border: none;
      outline: none;
      resize: none;
      padding: 0;
      overflow: hidden;
      width: ${fontSize}px;
      wrap: physical;
    `
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

    textarea.addEventListener('input', function () {

      let length = textarea.value.length
      let textareaSize = getTextSize(shape, textarea.value)

      textarea.style.width = (textareaSize.width / dpr + fontSize) + 'px'

      if (!textareaIsInCanvas(painter, textareaSize.width + x, textareaSize.height + y)) {
        textarea.maxLength = length
        textarea.blur()
        return
      }

      if (!locked) {
        updateCanvas()
      }
    })

    textarea.addEventListener('compositionstart', function () {
      locked = true
    })

    textarea.addEventListener('compositionend', function (e) {
      locked = false
      updateCanvas()
    })

    textarea.addEventListener('blur', function () {

      parentElement.removeChild(textarea)

      p = textarea = null
      emitter.fire(
        Emitter.DRAWING_END,
        {
          shape,
        }
      )
    })

    emitter.fire(
      Emitter.DRAWING_START,
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

  class Text extends Shape {

    isPointInPath(painter, x, y) {
      return containRect(this.getRect(painter), x, y)
    }

    drawPath(painter) {
      const rect = this.getRect(painter)
      painter.drawRect(rect.x, rect.y, rect.width, rect.height)
    }

    fill(painter) {
      const { x, y, fontSize, fontFamily, text} = this
      painter.setFillStyle(this.fillStyle)
      painter.setFont(
        fontSize * dpr,
        fontFamily
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
      const { x, y, fontSize, fontFamily, text, strokeThickness, strokeStyle } = this
      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.setFont(
        fontSize * dpr,
        fontFamily
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

      const { x, y, text, fontSize, fontFamily } = this
      let row = text.split('\n')
      painter.setFont(
        fontSize * dpr,
        fontFamily
      )

      let width = getTextSize(this, text).width
      let height = getTextSize(this, text).height

      return {
        x: x,
        y: y,
        width: width,
        height: height,
      }
    }

  }

  return Text

})