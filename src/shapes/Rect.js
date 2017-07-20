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

      let x, y, width, height

      if (startX < endX) {
        x = startX
        width = endX - startX
      }
      else {
        x = endX
        width = startX - endX
      }

      if (startY < endY) {
        y = startY
        height = endY - startY
      }
      else {
        y = endY
        height = startY - endY
      }

      this.x = x
      this.y = y
      this.width = width
      this.height = height
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