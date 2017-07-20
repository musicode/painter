/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  /**
   * (x, y) 开始点
   * (endX, endY) 结束点
   */
  class Line extends Shape {

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
        console.log(painter.isPointInPath(x, y))
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
      painter.moveTo(this.x, this.y)
      painter.lineTo(this.endX, this.endY)
    }

    /**
     * 描边
     *
     * @param {Painter} painter
     */
    stroke(painter) {

      let {
        strokeStyle,
        strokePosition,
        strokeThickness,
      } = this

      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.begin()
      this.drawPath(painter)
      painter.stroke()

    }

    /**
     * 填充
     *
     * @param {Painter} painter
     */
    fill(painter) {

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

      this.x = startX
      this.y = startY
      this.endX = endX
      this.endY = endY
      this.draw(painter)

    }

    save(rect) {
      return {
        x: (this.x - rect.x) / rect.width,
        y: (this.y - rect.y) / rect.height,
        endX: (this.endX - rect.x) / rect.width,
        endY: (this.endY - rect.y) / rect.height,
      }
    }

    restore(rect, data) {
      this.x = rect.x + rect.width * data.x
      this.y = rect.y + rect.height * data.y
      this.endX = rect.x + rect.width * data.endX
      this.endY = rect.y + rect.height * data.endY
    }

    getRect() {

      const startX = Math.min(this.x, this.endX)
      const startY = Math.min(this.y, this.endY)

      const endX = Math.max(this.x, this.endX)
      const endY = Math.max(this.y, this.endY)

      return {
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY
      }
    }

  }

  return Line

})