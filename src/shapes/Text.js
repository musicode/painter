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
  function createTextarea(painter, emitter, event, shape) {

    const { fontSize, fontFamily } = shape
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
    `
    parentElement.appendChild(textarea)

    setTimeout(
      function () {
        textarea.focus()
      }
    )

    let p = document.createElement('p')
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
      console.log(p.offsetWidth)
      textarea.style.width = (p.offsetWidth + fontSize) + 'px'
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
      console.log('blur')
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
console.log('create', event)
    emitter.fire(
      Emitter.DRAWING_START,
      {
        cursor: 'text'
      }
    )
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
      painter.setFillStyle(this.fillStyle)
      painter.setFont(
        this.fontSize * dpr,
        this.fontFamily
      )
      painter.fillText(this.x, this.y + this.fontSize * dpr, this.text)
    }

    stroke(painter) {
      const dpr = getDevicePixelRatio()
      painter.setLineWidth(this.strokeThickness)
      painter.setStrokeStyle(this.strokeStyle)
      painter.setFont(
        this.fontSize * dpr,
        this.fontFamily
      )
      painter.strokeText(this.x, this.y + this.fontSize * dpr, this.text)
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