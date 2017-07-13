/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  let Selection = require('./state/Selection')
  let Active = require('./state/Active')
  let Hover = require('./state/Hover')

  let { devicePixelRatio } = window

  class Emitter {

    constructor(canvas) {

      this.listeners = { }

      let rect = canvas.getBoundingClientRect()
      let me = this, cursorX, cursorY

      canvas.addEventListener(
        'mousedown',
        function (event) {
          if (!me.disabled) {
            me.fire(
              'mousedown',
              {
                x: cursorX,
                y: cursorY,
              }
            )
          }
        }
      )

      document.addEventListener(
        'mousemove',
        function (event) {
          if (!me.disabled) {
            cursorX = event.pageX - rect.left
            cursorY = event.pageY - rect.top
            if (devicePixelRatio > 1) {
              cursorX *= devicePixelRatio
              cursorY *= devicePixelRatio
            }
            me.fire(
              'mousemove',
              {
                x: cursorX,
                y: cursorY,
              }
            )
          }
        }
      )

      document.addEventListener(
        'mouseup',
        function (event) {
          if (!me.disabled) {
            me.fire(
              'mouseup',
              {
                x: cursorX,
                y: cursorY,
              }
            )
          }
        }
      )

    }

    enable() {
      this.disabled = false
    }

    disable() {
      this.disabled = true
    }

    fire(type, data) {
      let { listeners } = this
      let list = listeners[ type ]
      if (list) {
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[ i ](data) === false) {
            break
          }
        }
      }
    }

    on(type, listener) {
      let list = this.listeners[ type ] || (this.listeners[ type ] = [ ])
      list.push(listener)
      return this
    }

  }

  class Canvas {

    constructor(canvas) {

      let me = this

      me.canvas = canvas
      me.context = canvas.getContext('2d')
      me.resize(canvas.width, canvas.height)

      me.shapes = [ ]

      let offsetX, offsetY, selection, dragging

      (me.emitter = new Emitter(canvas))
      .on('mousedown', function (event) {

        let { hoverShape } = me
        if (hoverShape) {
          offsetX = event.x - hoverShape.x
          offsetY = event.y - hoverShape.y
          dragging = hoverShape
          me.setActiveShape(hoverShape)
        }
        else {
          if (me.activeShape) {
            me.setActiveShape(null)
          }
          selection = new Selection({
            x: event.x,
            y: event.y,
          })
        }

      })
      .on('mousemove', function (event) {

        let { shapes } = me

        let hoverShape, needRefresh
        for (let i = shapes.length - 1; i >= 0; i--) {
          if (shapes[ i ].isPointInPath(context, event.x, event.y)) {
            hoverShape = shapes[ i ]
            break
          }
        }

        if (dragging) {
          needRefresh = true
          dragging.x = event.x - offsetX
          dragging.y = event.y - offsetY
        }

        // 先设置 active shape
        if (selection) {
          needRefresh = true
          selection.width = event.x - selection.x
          selection.height = event.y - selection.y
          me.setActiveShape(hoverShape, true)
        }

        // 再设置 hover shape
        if (me.setHoverShape(hoverShape, true)) {
          needRefresh = true
        }

        if (needRefresh) {
          me.refresh()
        }

      })
      .on('mouseup', function () {
        if (dragging) {
          dragging = null
        }
        if (selection) {
          selection = null
          me.refresh()
        }
      })

    }

    resize(width, height) {

      if (devicePixelRatio > 1) {
        width *= devicePixelRatio
        height *= devicePixelRatio
      }

      this.canvas.width = Math.floor(width)
      this.canvas.height = Math.floor(height)

    }

    addShape(shape) {
      shape.draw(this.context)
      this.shapes.push(shape)
    }

    refresh() {

      let { context, shapes, activeShape, hoverShape, selection } = this

      this.clear()
      shapes.forEach(
        function (shape) {
          shape.draw(context)
        }
      )

      if (activeShape) {
        let active = new Active(activeShape, this.emitter)
        active.draw(context)
      }
      if (hoverShape && hoverShape !== activeShape) {
        let hover = new Hover(hoverShape.getRect())
        hover.draw(context)
      }
      if (selection) {
        selection.draw(context)
      }

    }

    setHoverShape(shape, silent) {
      if (shape != this.hoverShape) {
        this.hoverShape = shape
        if (!silent && (!this.activeShape || shape != this.activeShape)) {
          this.refresh()
        }
        return true
      }
    }

    setActiveShape(shape, silent) {
      if (shape != this.activeShape) {
        this.activeShape = shape
        if (!silent) {
          this.refresh()
        }
        return true
      }
    }

    clear() {
      let { context, canvas } = this
      context.clearRect(0, 0, canvas.width, canvas.height)
    }











    /**
     * 设置字体
     *
     * @param {string} fontSize 字体大小，如 20px，需自带单位
     * @param {string} fontFamily
     */
    setTextFont(fontSize, fontFamily) {
      this.context.font = `${fontSize} ${fontFamily}`
    }

    /**
     * 设置字体的水平对齐方式
     *
     * @param {string} align 可选值有 start/end/left/right/center
     */
    setTextAlign(align) {
      this.context.textAlign = align
    }

    /**
     * 设置字体的垂直对齐方式
     *
     * @param {string} baseline 可选值有 top/hangling/middle/alphabetic/ideographic/bottom
     */
    setTextBaseline(baseline) {
      this.context.textBaseline = baseline
    }

    /**
     * 设置画布的颜色
     *
     * @param {string} baseline 可选值有 top
     */
    drawColor(color) {
      let { width, height } = this.canvas
      this.context.fillStyle = color
      this.context.fillRect(0, 0, width, height)
    }

    drawRect(left, top, right, bottom) {
      this.context.rect(left, top, right - left, bottom - top)
    }

    drawImage(bitmap, left, top) {
      this.context.drawImage(bitmap, left, top)
    }

    fillText(text, left, top) {
      this.context.fillText(text, left, top)
    }

    strokeText(text, left, top) {
      this.context.strokeText(text, left, top)
    }

    fillRect(left, top, right, bottom) {
      this.context.fillRect(left, top, right - left, bottom - top)
    }

    strokeRect(left, top, right, bottom) {
      this.context.strokeRect(left, top, right - left, bottom - top)
    }

    clearRect(left, top, right, bottom) {
      this.context.clearRect(left, top, right - left, bottom - top)
    }

  }

  return Canvas

})