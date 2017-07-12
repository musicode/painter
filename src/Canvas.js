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

          let { shapes, hoverIndex } = me

          let index
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[ i ].isPointInPath(context, offsetX, offsetY)) {
              index = i
              break
            }
          }

          if (index >= 0) {
            if (index !== hoverIndex
              && !shapes[ index ].active
            ) {
              if (hoverIndex >= 0) {
                delete shapes[ hoverIndex ].hover
              }
              shapes[ index ].hover = true
              me.hoverIndex = index
              me.refresh()
            }
          }
          else if (hoverIndex >= 0) {
            delete shapes[ hoverIndex ].hover
            delete me.hoverIndex
            me.refresh()
          }

        }
      )

      canvas.addEventListener(
        'click',
        function (event) {
          let { hoverIndex } = me

          if (hoverIndex >= 0) {
            if (hoverIndex !== me.activeIndex && me.activeIndex >= 0) {
              delete me.shapes[me.activeIndex].active
              delete me.activeIndex
              me.refresh()
            }
            me.shapes[ hoverIndex ].active = true
            me.activeIndex = hoverIndex
            me.refresh()
          }
          else if (me.activeIndex >= 0) {
            delete me.shapes[me.activeIndex].active
            delete me.activeIndex
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
      let { context, shapes, hoverIndex, activeIndex } = this
      this.clear()
      shapes.forEach(
        function (shape) {
          shape.draw(context)
        }
      )

      if (activeIndex >= 0) {
        drawActive(context, shapes[ activeIndex ])
      }
      if (hoverIndex >= 0 && hoverIndex !== activeIndex) {
        drawHover(context, shapes[ hoverIndex ])
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