/**
 * @file 内多边形
 * @author wangtianhua
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const array = require('../util/array')

  const containPolygon = require('../contain/polygon')
  const getOffsetPoints = require('../function/getOffsetPoints')
  const getDistance = require('../function/getDistance')
  const getPointOfCircle = require('../function/getPointOfCircle')

  const PI2 = 2 * Math.PI

  class Star extends Shape {

    isPointInFill(painter, x, y) {
      return containPolygon(this.points, x, y)
    }

    drawPath(painter) {
      painter.drawPoints(this.points)
      painter.close()
    }

    stroke(painter) {

      let { points, strokePosition, strokeThickness, strokeStyle } = this

      painter.setLineWidth(strokeThickness)
      painter.setStrokeStyle(strokeStyle)
      painter.begin()

      if (strokePosition === constant.STROKE_POSITION_INSIDE) {
        points = getOffsetPoints(points, strokeThickness / -2)
      }
      else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        points = getOffsetPoints(points, strokeThickness / 2)
      }

      painter.drawPoints(points)
      painter.close()

      painter.stroke()
    }

    fill(painter) {
      painter.setFillStyle(this.fillStyle)
      painter.begin()
      this.drawPath(painter)
      painter.fill()
    }

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

  }

  return Star

})