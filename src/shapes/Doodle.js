/**
 * @file 涂鸦
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')
  const array = require('../util/array')

  /**
   * points 点数组
   */
  class Doodle extends Shape {

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
        return true
      }

      return false

    }

    /**
     * 绘制路径
     *
     * @param {Painter} painter
     */
    drawPath(painter) {

      const { points } = this

      if (points.length > 0) {

        let point = points[0]
        painter.moveTo(point.x, point.y)

        for (let i = 1, len = points.length; i < len; i++) {
          point = points[i]
          painter.lineTo(point.x, point.y)
        }

      }
    }

    /**
     * 描边
     *
     * @param {Painter} painter
     */
    stroke(painter) {

      let {
        strokeStyle,
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
    drawing(painter, startX, startY, endX, endY) {

      let points = this.points || (this.points = [ ])

      painter.begin()

      if (!points.length) {
        array.push(
          points,
          {
            x: startX,
            y: startY,
          }
        )

        let {
          strokeStyle,
          strokeThickness,
        } = this

        painter.setLineWidth(strokeThickness)
        painter.setStrokeStyle(strokeStyle)
      }

      const { x, y } = array.last(points)
      painter.moveTo(x, y)
      painter.lineTo(endX, endY)
      painter.stroke()

      console.log(endX, endY)

      array.push(
        points,
        {
          x: endX,
          y: endY,
        }
      )

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
      const { points } = this
      return points && points.length > 0
    }

    getRect() {

      const { points } = this

      let startX = 0, startY = 0, endX = 0, endY = 0

      if (points.length > 0) {

        let point = points[0]
        startX = endX = point.x
        startY = endY = point.y

        for (let i = 1, len = points.length; i < len; i++) {
          point = points[i]
          if (point.x < startX) {
            startX = point.x
          }
          else if (point.x > endX) {
            endX = point.x
          }
          if (point.y < startY) {
            startY = point.y
          }
          else if (point.y > endY) {
            endY = point.y
          }
        }

      }

      return {
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY
      }
    }

  }

  return Doodle

})