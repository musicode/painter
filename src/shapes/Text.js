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

  let textarea
  let p

  function createTextarea(painter, emitter, event, shape) {

    const { fontSize, fontFamily, x, y } = shape
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
      border: none;
      outline: none;
      resize: none;
      padding: 0;
      overflow: hidden;
      wrap:physical;
    `
    parentElement.appendChild(textarea)

    setTimeout(
      function () {
        textarea.focus()
      }
    )

    p = document.createElement('p')
    p.style.cssText = `
      position: absolute;
      visibility: hidden;
      font: ${fontSize}px ${fontFamily};
    `
    parentElement.appendChild(p)

    let savedData = painter.save()

    let locked = false

    let updateCanvas = function () {
      painter.restore(savedData)
      shape.text = textarea.value
      shape.draw(painter)
    }

    textarea.addEventListener('input', function () {
      p.innerHTML = textarea.value

      if (textareaIsInCanvas(painter, p.offsetWidth + x + fontSize, p.offsetHeight + y)) {
        textarea.style.width = (p.offsetWidth + fontSize) + 'px'
      }
      else {
        // 如果超出画布就substring text 之后绘制
        // textarea.style.height = p.offsetHeight * 2 + 'px'
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

      parentElement.removeChild(p)
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
        let row = textarea.value.split('\n').length
        textarea.style.height = p.offsetHeight * row + 'px'
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
      const dpr = getDevicePixelRatio()
      const { x, y, fontSize, fontFamily, text} = this
      painter.setFillStyle(this.fillStyle)
      painter.setFont(
        fontSize * dpr,
        fontFamily
      )

      const height = fontSize + fontSize / 6
      array.each(
        text.split('\n'),
        function (value, index) {
          painter.fillText(x, y + fontSize * dpr + height * index, value)
        }
      )
    }

    stroke(painter) {
      const dpr = getDevicePixelRatio()
      const { x, y, fontSize, fontFamily, text, strokeThickness, strokeStyle } = this
      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.setFont(
        fontSize * dpr,
        fontFamily
      )
      const height = fontSize + fontSize / 6

      array.each(
        text.split('\n'),
        function (value, index) {
          painter.strokeText(x, y + fontSize * dpr + height * index, value)
        }
      )
    }

    startDrawing (painter, emitter, event) {

      if (!textarea) {
        this.x = event.x
        this.y = event.y
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

      painter.setFont(
        fontSize * getDevicePixelRatio(),
        fontFamily
      )

      let width = painter.measureText(text).width
      let height = painter.measureText('W').width
      height += height / 6

      return {
        x: x,
        y: y,
        width: width + 20,
        height: height + 20,
      }
    }

  }

  return Text

})