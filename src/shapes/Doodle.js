/**
 * @file 涂鸦
 * @author musicode
 */

import Shape from './Shape'
import array from '../util/array'

/**
 * points 点数组
 */
export default class Doodle extends Shape {

  setLineStyle(painter) {
    painter.setLineJoin('round')
    painter.setLineCap('round')
  }

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   */
  drawing(painter, startX, startY, endX, endY) {

    const points = this.points || (this.points = [ { x: startX, y: startY } ])

    painter.disableShadow()
    painter.begin()

    if (points.length === 1) {
      this.setLineStyle(painter)
      painter.setLineWidth(this.strokeThickness)
      painter.setStrokeStyle(this.strokeStyle)
    }

    // 每次取最后 2 个点进行绘制，这样才不会有断裂感
    painter.drawPoints(
      points.slice(points.length - 2)
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
