/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const array = require('../util/array')
  const containLine = require('../contain/line')
  const containRect = require('../contain/rect')
  const containPolygon = require('../contain/polygon')
  const getDistance = require('../function/getDistance')
  const getRectByPoints = require('../function/getRectByPoints')

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

    /**
     * 点是否位于图形范围内
     *
     * @param {Painter} painter
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(painter, x, y) {

      if (containRect(this.getRect(), x, y)) {
        let { points, strokeThickness, fillStyle } = this
        if (fillStyle) {
          return containPolygon(points, x, y)
        }
        if (strokeThickness < 8) {
          strokeThickness = 8
        }
        for (let i = 0, len = points.length; i < len; i++) {
          if (points[ i + 1 ]
            && containLine(
                points[ i ].x,
                points[ i ].y,
                points[ i + 1 ].x,
                points[ i + 1 ].y,
                strokeThickness, x, y
              )
          ) {
            return true
          }
        }
      }

      return false

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

    save(rect) {
      return this.points.map(
        function (point) {
          return {
            x: (point.x - rect.x) / rect.width,
            y: (point.y - rect.y) / rect.height,
          }
        }
      )
    }

    restore(rect, data) {
      array.each(
        this.points,
        function (point, i) {
          point.x = rect.x + rect.width * data[ i ].x
          point.y = rect.y + rect.height * data[ i ].y
        }
      )
    }

    validate() {
      const rect = this.getRect()
      return rect.width > 5 && rect.height > 5
    }

    getRect() {
      return getRectByPoints(this.points)
    }

  }

  return Polygon

})