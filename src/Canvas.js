/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  let Selection = require('./states/Selection')
  let Active = require('./states/Active')
  let Hover = require('./states/Hover')

  let array = require('./util/array')

  let { devicePixelRatio } = window

  class Emitter {

    constructor(canvas) {

      this.listeners = { }

      let rect = canvas.getBoundingClientRect()
      let me = this, cursorX, cursorY

      document.addEventListener(
        'mousedown',
        function () {
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
        function () {
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
        for (let i = 0, len = list.length, handler; i < len; i++) {
          handler = list[ i ]
          if (handler && handler(data) === false) {
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

    off(type, listener) {
      let list = this.listeners[ type ]
      if (list) {
        let index = list.indexOf(listener)
        if (index >= 0) {
          list.splice(index, 1)
        }
      }
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
      me.states = [ ]

      let offsetX, offsetY, draggingShape

      (me.emitter = new Emitter(canvas))
      .on('mousedown', function (event) {

        let { hoverShape } = me

        if (hoverShape) {
          offsetX = event.x - hoverShape.x
          offsetY = event.y - hoverShape.y
          draggingShape = hoverShape
          me.setHoverShape(null, true)
          me.setActiveShape(draggingShape, true)
          me.refresh()
        }
        else {
          me.setActiveShape(null)
          me.selection = new Selection(event)
        }

      })
      .on('mousemove', function (event) {

        let { activeShape, selection, shapes, states } = me

        if (draggingShape) {
          draggingShape.x = event.x - offsetX
          draggingShape.y = event.y - offsetY
          if (draggingShape === activeShape) {
            states[ 0 ].x = draggingShape.x
            states[ 0 ].y = draggingShape.y
          }
          me.refresh()
          return
        }

        if (selection) {
          selection.width = event.x - selection.x
          selection.height = event.y - selection.y
          me.refresh()
          return
        }

        let hoverShape, isStateShape, hoverResult
        array.each(
          [ states, shapes ],
          function (list) {
            array.each(
              list,
              function (shape) {
                if (shape && shape.isPointInPath(context, event.x, event.y) !== false) {
                  hoverShape = shape
                  isStateShape = shape.state
                  return hoverResult = false
                }
              }
            )
            return hoverResult
          }
        )

        if (!isStateShape) {
          me.setHoverShape(hoverShape)
        }


      })
      .on('mouseup', function () {
        if (draggingShape) {
          draggingShape = null
        }
        if (me.selection) {
          delete me.selection
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

    /**
     * 添加图形
     *
     * @param {Shape} shape
     */
    addShape(shape) {
      shape.draw(this.context)
      this.shapes.push(shape)
    }

    /**
     * 全量刷新画布
     */
    refresh() {

      const { context, canvas, shapes, states } = this

      context.clearRect(0, 0, canvas.width, canvas.height)

      const drawShape = function (shape) {
        if (shape) {
          shape.draw(context)
        }
      }

      shapes.forEach(drawShape)
      states.forEach(drawShape)

    }

    /**
     * 清空画布
     */
    clear() {
      let { context, canvas, shapes } = this
      shapes.length = 0
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    /**
     * @param {Shape} shape
     * @param {?silent} silent
     */
    setHoverShape(shape, silent) {
      let { hoverShape, activeShape, states } = this
      if (shape != hoverShape) {
        console.log(shape)
        this.hoverShape = shape

        if (states[ 1 ]) {
          states[ 1 ].destroy()
          states[ 1 ] = null
        }
        if (shape) {
          states[ 1 ] = new Hover({ shape })
        }
        if (!silent) {
          if (!activeShape || shape != activeShape) {
            this.refresh()
          }
        }
        return true
      }
    }

    /**
     * @param {Shape} shape
     * @param {?silent} silent
     */
    setActiveShape(shape, silent) {
      let { activeShape, states } = this
      if (shape != activeShape) {
        this.activeShape = shape
        if (states[ 0 ]) {
          states[ 0 ].destroy()
          states[ 0 ] = null
        }
        if (shape) {
          states[ 0 ] = new Active(shape, this.emitter, this.canvas)
        }
        if (!silent) {
          this.refresh()
        }
        return true
      }
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