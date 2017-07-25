/**
 * @file 箭头
 * @author musicode
 */
define(function (require) {

  const Polygon = require('./Polygon')

  const getDistance = require('../function/getDistance')
  const getPointOfCircle = require('../function/getPointOfCircle')
  const getRotatePoints = require('../function/getRotatePoints')

  const array = require('../util/array')

  /**
   * points 点数组
   */
  class Arrow extends Polygon {

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

      const distance = getDistance(startX, startY, endX, endY)
      // 下面这些数字都是不断尝试调出的参数
      // 没有理由，就是试
      let thickness = 20, threshold = thickness * 10, header

      if (distance < threshold) {
        thickness *= distance / (2 * threshold)
        header = Math.max(thickness, 50)
      }
      else {
        header = Math.max(distance / 8, 80)
      }

      this.valid = distance - header > 20

      const points = [ ]

      // 以 (startX, startY) 为圆心向 x 轴正方向画箭头
      let point = {
        x: startX,
        y: startY - thickness
      }
      array.push(points, point)

      point = {
        x: point.x + distance - header,
        y: point.y - header / 8,
      }
      array.push(points, point)

      array.push(
        points,
        getPointOfCircle(point.x, point.y, 0.5 * header, 250 * Math.PI / 180),
      )

      array.push(
        points,
        {
          x: startX + distance,
          y: startY,
        }
      )

      for (let i = points.length - 2; i >= 0; i--) {
        points.push({
          x: points[ i ].x,
          y: 2 * startY - points[ i ].y,
        })
      }

      this.points = getRotatePoints(startX, startY, Math.atan2(endY - startY, endX - startX), points)

      this.draw(painter)

    }

    validate() {
      if (this.valid) {
        delete this.valid
        return true
      }
    }

  }

  return Arrow

})