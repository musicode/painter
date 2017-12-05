/**
 * @file 涂鸦
 * @author musicode
 */

import Shape from './Shape'
import constant from '../constant'
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
      painter.setLineWidth(this.strokeThickness * constant.DEVICE_PIXEL_RATIO)
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

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */
  drawPath(painter) {
    painter.drawPoints(this.points)
    if (this.autoClose) {
      painter.close()
    }
  }

  /**
   * 填充
   *
   * @param {Painter} painter
   */
  fill(painter) {
    if (this.autoClose) {
      painter.setFillStyle(this.fillStyle)
      painter.begin()
      this.drawPath(painter)
      painter.fill()
    }
  }

  toJSON() {
    return super.toJSON({
      name: 'Doodle',
    })
  }

}
