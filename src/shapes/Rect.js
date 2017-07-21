/**
 * @file 矩形
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const getRect = require('../function/getRect')
  const containRect = require('../contain/rect')
  const containLine = require('../contain/line')

  /**
   * (x, y) 左上角
   * width 宽
   * height 高
   */
  class Rect extends Shape {

    /**
     * 点是否位于图形范围内
     *
     * @param {Painter} painter
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(painter, x1, y1) {
      if (containRect(this, x1, y1)) {
        if (this.fillStyle) {
          return true
        }
        let { x, y, width, height, strokeThickness } = this
        if (strokeThickness < 8) {
          strokeThickness = 8
        }
        return containLine(x, y, x + width, y, strokeThickness, x1, y1)
          || containLine(x + width, y, x + width, y + height, strokeThickness, x1, y1)
          || containLine(x + width, y + height, x, y + height, strokeThickness, x1, y1)
          || containLine(x, y + height, x, y, strokeThickness, x1, y1)
      }
      return false
    }

    /**
     * 绘制路径
     *
     * @param {Painter} painter
     */
    drawPath(painter) {
      painter.drawRect(this.x, this.y, this.width, this.height)
    }

    /**
     * 描边
     *
     * @param {Painter} painter
     */
    stroke(painter) {

      let {
        x,
        y,
        width,
        height,
        strokeStyle,
        strokePosition,
        strokeThickness,
      } = this

      // Canvas 的描边机制是 center

      // inside
      if (strokePosition === constant.STROKE_POSITION_INSIDE) {
        x += strokeThickness * 0.5
        y += strokeThickness * 0.5
        width -= strokeThickness
        height -= strokeThickness
      }
      // outside
      else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        x -= strokeThickness * 0.5
        y -= strokeThickness * 0.5
        width += strokeThickness
        height += strokeThickness
      }

      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.strokeRect(x, y, width, height)

    }

    /**
     * 填充
     *
     * @param {Painter} painter
     */
    fill(painter) {
      painter.setFillStyle(this.fillStyle)
      painter.fillRect(this.x, this.y, this.width, this.height)
    }

    /**
     * 正在绘制
     *
     * @param {Painter} painter
     * @param {number} startX 起始点 x 坐标
     * @param {number} startY 起始点 y 坐标
     * @param {number} endX 结束点 x 坐标
     * @param {number} endX 结束点 y 坐标
     * @param {Function} 还原为鼠标按下时的画布
     */
    drawing(painter, startX, startY, endX, endY, restore) {
      restore()
      Object.assign(this, getRect(startX, startY, endX, endY))
      this.draw(painter)
    }

    save(rect) {
      return {
        x: (this.x - rect.x) / rect.width,
        y: (this.y - rect.y) / rect.height,
        width: this.width / rect.width,
        height: this.height / rect.height,
      }
    }

    restore(rect, data) {
      this.x = rect.x + rect.width * data.x
      this.y = rect.y + rect.height * data.y
      this.width = rect.width * data.width
      this.height = rect.height * data.height
    }

    getRect() {
      return this
    }

  }

  return Rect

})