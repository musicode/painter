/**
 * @file 箭头
 * @author musicode
 */
define(function (require) {

  const Shape = require('./Shape')

  const getDistance = require('../function/getDistance')

  /**
   * points 点数组
   */
  class Arrow extends Shape {

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

      this.draw(painter)

    }

    validate() {
      const { points } = this
      return points && points.length === 7
    }

  }

  return Arrow

})