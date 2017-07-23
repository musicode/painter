/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const array = require('../util/array')

  const containPolygon = require('../contain/polygon')
  const getDistance = require('../function/getDistance')

  const PI2 = 2 * Math.PI

  function getX(x, radius, angle) {
    return x + radius * Math.cos(angle)
  }

  function getY(y, radius, angle) {
    return y + radius * Math.sin(angle)
  }

  /**
   * count 几边形
   * points 点的数组
   */
  class Polygon extends Shape {

    isPointInFill(painter, x, y) {
      return containPolygon(this.points, x, y)
    }

    /**
     * 绘制路径
     *
     * @param {Painter} painter
     */
    drawPath(painter) {
      painter.drawPoints(this.points)
      painter.close()
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

      const { count } = this

      const radius = getDistance(startX, startY, endX, endY)

      // 单位旋转的角度
      const stepAngle = PI2 / count

      const points = [ ]

      let angle = Math.atan2(endY - startY, endX - startX), endAngle = angle + PI2

      do {
        array.push(
          points,
          {
            x: getX(startX, radius, angle),
            y: getY(startY, radius, angle),
          }
        )
        angle += stepAngle
      }
      while (angle <= endAngle)

      if (points.length - count === 1) {
        array.pop(points)
      }

      this.points = points

      this.draw(painter)

    }

    validate() {
      const rect = this.getRect()
      return rect.width > 5 && rect.height > 5
    }

  }

  return Polygon

})