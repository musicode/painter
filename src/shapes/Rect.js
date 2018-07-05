/**
 * @file 矩形
 * @author musicode
 */

import Polygon from './Polygon'

import getRect from '../function/getRect'
import object from '../util/object'

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
    object.extend(this, Rect.draw(startX, startY, endX, endY))
    this.draw(painter)
  }

  toJSON() {
    return super.toJSON({
      name: 'Polygon',
    })
  }

}

Rect.draw = function (startX, startY, endX, endY) {
  const rect = getRect(startX, startY, endX, endY)
  return {
    points: [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ]
  }
}
