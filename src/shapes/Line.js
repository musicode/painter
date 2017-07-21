/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const containLine = require('../contain/line')

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
      let { strokeThickness } = this
      if (strokeThickness < 8) {
        strokeThickness = 8
      }
      return containLine(this.x, this.y, this.endX, this.endY, strokeThickness, x, y)
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

      painter.setLineWidth(this.strokeThickness)
      painter.setStrokeStyle(this.strokeStyle)
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