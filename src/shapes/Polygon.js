/**
 * @file 多边形
 * @author musicode
 */

import Shape from './Shape'
import constant from '../constant'

import array from '../util/array'
import object from '../util/object'

import containPolygon from '../contain/polygon'
import getOffsetPoints from '../function/getOffsetPoints'
import getDistance from '../function/getDistance'
import getPointOfCircle from '../function/getPointOfCircle'

const PI2 = 2 * Math.PI

/**
 * count 几边形
 * points 点的数组
 */
export default class Polygon extends Shape {

  isPathClosed() {
    return true
  }

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
   * 描边
   *
   * @param {Painter} painter
   */
  stroke(painter) {

    let { points, strokePosition, lineWidth, strokeStyle } = this

    lineWidth *= constant.DEVICE_PIXEL_RATIO

    painter.setLineWidth(lineWidth)
    painter.setStrokeStyle(strokeStyle)
    painter.begin()

    if (strokePosition === constant.STROKE_POSITION_INSIDE) {
      points = getOffsetPoints(points, lineWidth / -2)
    }
    else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
      points = getOffsetPoints(points, lineWidth / 2)
    }

    painter.drawPoints(points)
    painter.close()

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
    object.extend(this, Polygon.draw(startX, startY, endX, endY, this.count))
    this.draw(painter)
  }

  validate() {
    const rect = this.getRect()
    return rect.width > 5 && rect.height > 5
  }

  toJSON() {
    return super.toJSON({
      name: 'Polygon',
    })
  }

}

Polygon.draw = function (startX, startY, endX, endY, count) {

  const radius = getDistance(startX, startY, endX, endY)

  // 单位旋转的角度
  const stepRadian = PI2 / count

  const points = [ ]

  let radian = Math.atan2(endY - startY, endX - startX), endRadian = radian + PI2

  do {
    array.push(
      points,
      getPointOfCircle(startX, startY, radius, radian)
    )
    radian += stepRadian
  }
  while (radian <= endRadian)

  if (points.length - count === 1) {
    array.pop(points)
  }

  return {
    points: points
  }
}
