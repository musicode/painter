/**
 * @file 椭圆
 * @author musicode
 */

import Shape from './Shape'

import getDistance from '../function/getDistance'

/**
 * points 点数组
 */
export default class Line extends Shape {

  setLineStyle(painter) {
    painter.setLineCap('square')
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

    const points = this.points || (this.points = [ { x: startX, y: startY } ])
    points[ 1 ] = { x: endX, y: endY }
    this.draw(painter)

  }

  validate() {
    const { points } = this
    return points && points.length === 2
  }

}
