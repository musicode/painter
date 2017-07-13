/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  let drawHover = require('./function/drawHover')
  let drawActive = require('./function/drawActive')

  let { devicePixelRatio } = window

  class Canvas {

    constructor(canvas) {
      this.canvas = canvas
      this.context = canvas.getContext('2d')
      this.resize(canvas.width, canvas.height)
      this.shapes = [ ]

      let me = this

      canvas.addEventListener(
        'mousemove',
        function (event) {

          let { offsetX, offsetY } = event
          if (devicePixelRatio > 1) {
            offsetX *= devicePixelRatio
            offsetY *= devicePixelRatio
          }

          let { shapes, hoverShape } = me

          let shape
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[ i ].isPointInPath(context, offsetX, offsetY)) {
              shape = shapes[ i ]
              break
            }
          }

          if (shape) {
            me.setHoverShape(shape)
          }
          else if (hoverShape) {
            me.setHoverShape(null)
          }

        }
      )

      canvas.addEventListener(
        'click',
        function (event) {
          let { hoverShape, activeShape } = me
          if (hoverShape) {
            me.setActiveShape(hoverShape)
          }
          else if (activeShape) {
            me.setActiveShape(null)
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

    setHoverShape(shape) {

      let { hoverShape } = this

      if (shape) {
        if (shape && shape !== hoverShape) {
          this.hoverShape = shape
        }
      }
      else if (hoverShape) {
        delete this.hoverShape
      }

      if (hoverShape !== this.hoverShape) {
        this.refresh()
      }

    }

    setActiveShape(shape) {

      let { activeShape } = this

      if (shape) {
        if (shape && shape !== activeShape) {
          this.activeShape = shape
        }
      }
      else if (activeShape) {
        delete this.activeShape
      }

      if (activeShape !== this.activeShape) {
        this.refresh()
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