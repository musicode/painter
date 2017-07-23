/**
 * @file 涂鸦
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const array = require('../util/array')

  /**
   * points 点数组
   */
  class Doodle extends Shape {

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
    drawing(painter, startX, startY, endX, endY) {

      painter.disableShadow()

      const points = this.points || (this.points = [ { x: startX, y: startY } ])

      painter.begin()

      if (points.length === 1) {
        painter.setLineWidth(this.strokeThickness)
        painter.setStrokeStyle(this.strokeStyle)
      }

      // 每次取最后 3 个点进行绘制，这样才不会有断裂感
      painter.drawPoints(
        points.slice(points.length - 3)
      )
      painter.lineTo(endX, endY)
      painter.stroke()

      array.push(
        points,
        {
          x: endX,
          y: endY,
        }
      )

    }

  }

  return Doodle

})