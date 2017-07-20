/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')
  var constant = require('../constant')

  /**
   * (x, y) 圆心
   * width 宽
   * height 高
   */
  class Oval extends Shape {

    /**
     * 点是否位于图形范围内
     *
     * @param {Painter} painter
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(painter, x, y) {

      const rect = this.getRect()

      if (x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height
      ) {
        painter.begin()
        this.drawPath(painter)
        return painter.isPointInPath(x, y)
      }

      return false

    }

    /**
     * 绘制路径
     *
     * @param {Painter} painter
     */
    drawPath(painter) {
      painter.drawOval(this.x, this.y, this.width, this.height)
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
        width -= strokeThickness
        height -= strokeThickness
      }
      // outside
      else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        width += strokeThickness
        height += strokeThickness
      }

      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.begin()
      painter.drawOval(x, y, width, height)
      painter.stroke()

    }

    /**
     * 填充
     *
     * @param {Painter} painter
     */
    fill(painter) {
      painter.setFillStyle(this.fillStyle)
      painter.begin()
      this.drawPath(painter)
      painter.fill()
    }

    drawing(painter, startX, startY, endX, endY, restore) {

      restore()

      this.x = startX
      this.y = startY
      this.width = 2 * Math.abs(endX - startX)
      this.height = 2 * Math.abs(endY - startY)
      this.draw(painter)

    }

    getRect() {
      const { x, y, width, height } = this
      return {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
      }
    }

  }

  return Oval

})