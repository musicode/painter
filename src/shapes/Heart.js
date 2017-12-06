/**
 * @file 桃心
 * @author wangtianhua
 */

import Polygon from './Polygon'

import heart from '../contain/heart'
import getDistance from '../function/getDistance'
import array from '../util/array'

const PI = Math.PI
const PI2 = PI * 2

export default class Heart extends Polygon {

  drawing(painter, startX, startY, endX, endY, restore) {

    restore()

    this.x = startX
    this.y = startY
    this.width = this.height = 2 * getDistance(startX, startY, endX, endY)

    let width = getDistance(startX, 0, endX, 0)
    let height = getDistance(0, startY, 0, endY)

    const points = [ ], radius = width / 32

    let radian = PI, stepRadian = PI2 / Math.max(radius * 16, 30), endRadian = -PI

    array.push(
      points,
      {
        x: heart.getOffsetX(this.x + width / 2, radius, radian),
        y: heart.getOffsetY(this.y, radius, radian)
      }
    )
    do {
        array.push(
          points,
          {
            x: heart.getOffsetX(this.x + width / 2, radius, radian),
            y: heart.getOffsetY(this.y, radius, radian)
          }
        )
        radian -= stepRadian
    }
    while (radian >= endRadian)
    this.points = points
    this.draw(painter)

  }

  validate() {
    return this.width > 5 && this.height > 5
  }

  toJSON() {
    return super.toJSON({
      name: 'Polygon',
    })
  }

}
