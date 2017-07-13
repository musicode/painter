/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  let drawHover = require('./function/drawHover')
  let drawActive = require('./function/drawActive')
  let Rect = require('./shapes/Rect')

  let { devicePixelRatio } = window

  class Canvas {

    constructor(canvas) {
      this.canvas = canvas
      this.context = canvas.getContext('2d')
      this.resize(canvas.width, canvas.height)
      this.shapes = [ ]

      let me = this

      let x, y, selection

      canvas.addEventListener(
        'mousedown',
        function (event) {
          let { hoverShape } = me
          if (hoverShape) {
            me.setActiveShape(hoverShape)
          }
          else {
            if (me.activeShape) {
              me.setActiveShape(null)
            }
            selection = new Rect({
              x: x,
              y: y,
              selection: true,
              strokeThickness: 2,
              strokeColor: '#D6D6D6',
              fillColor: 'rgba(60,60,60,0.1)'
            })
            me.addShape(selection)
          }
        }
      )

      canvas.addEventListener(
        'mousemove',
        function (event) {

          x = event.offsetX
          y = event.offsetY

          if (devicePixelRatio > 1) {
            x *= devicePixelRatio
            y *= devicePixelRatio
          }


          let { shapes, hoverShape } = me

          let shape, needRefresh
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (!shapes[ i ].selection && shapes[ i ].isPointInPath(context, x, y)) {
              shape = shapes[ i ]
              break
            }
          }

          // 先设置 active shape
          if (selection) {
            needRefresh = true
            selection.width = x - selection.x
            selection.height = y - selection.y
            me.setActiveShape(shape, true)
          }

          // 再设置 hover shape
          if (me.setHoverShape(shape, true)) {
            needRefresh = true
          }

          if (needRefresh) {
            me.refresh()
          }

        }
      )

      document.addEventListener(
        'mouseup',
        function (event) {
          if (selection) {
            selection = null
            me.shapes.pop()
            me.refresh()
          }
        }
      )

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

      let { context, shapes, hoverShape, activeShape } = this

      this.clear()
      shapes.forEach(
        function (shape) {
          shape.draw(context)
        }
      )

      if (activeShape) {
        drawActive(context, activeShape)
      }
      if (hoverShape && hoverShape !== activeShape) {
        drawHover(context, hoverShape)
      }
    }

    setHoverShape(shape, silent) {
      if (shape !== this.hoverShape) {
        this.hoverShape = shape
        if (shape !== this.activeShape) {
          if (!silent) {
            this.refresh()
          }
          return true
        }
      }
    }

    setActiveShape(shape, silent) {
      if (shape !== this.activeShape) {
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