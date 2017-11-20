/**
 * @file 矩形
 * @author musicode
 */

import Polygon from './Polygon'

import getRect from '../function/getRect'

/**
 * points
 */
export default class Rect extends Polygon {

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

    const points = this.points || (this.points = [ ])

    const rect = getRect(startX, startY, endX, endY)

    points[ 0 ] = { x: rect.x, y: rect.y }
    points[ 1 ] = { x: rect.x + rect.width, y: rect.y }
    points[ 2 ] = { x: rect.x + rect.width, y: rect.y + rect.height }
    points[ 3 ] = { x: rect.x, y: rect.y + rect.height }

    this.draw(painter)

  }

}
