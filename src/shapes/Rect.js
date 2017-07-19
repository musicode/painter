/**
 * @file 矩形
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')
  var constant = require('../constant')

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
    isPointInPath(painter, x, y) {
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
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

    getRect() {
      return this
    }

  }

  return Rect

})