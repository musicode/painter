/**
 * @file 内多边形
 * @author wangtianhua
 */
import Polygon from './Polygon'

import array from '../util/array'

import getDistance from '../function/getDistance'
import getPointOfCircle from '../function/getPointOfCircle'

const PI2 = 2 * Math.PI

export default class Star extends Polygon {

  drawing(painter, startX, startY, endX, endY, restore) {

    restore()

    const { count, radius } = this

    const outerRadius = getDistance(startX, startY, endX, endY)
    const stepRadian = PI2 / count
    let innerRadius = radius

    if (!innerRadius) {
      innerRadius = outerRadius / 2
    }

    const points = [ ]

    let radian = Math.atan2(endY - startY, endX - startX), endRadian = radian + PI2
    do {
      array.push(
        points,
        getPointOfCircle(startX, startY, outerRadius, radian)
      )
      array.push(
        points,
        getPointOfCircle(startX, startY, innerRadius, radian + stepRadian / 2)
      )
      radian += stepRadian
    }
    while (radian <= endRadian)

    if (points.length - count * 2 === 2) {
      array.pop(points)
    }
    this.points = points

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
