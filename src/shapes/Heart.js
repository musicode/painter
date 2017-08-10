/**
 * @file 桃心
 * @author wangtianhua
 */
define(function (require) {

  const Shape = require('./Shape')
  const constant = require('../constant')

  const heart = require('../contain/heart')
  const containPolygon = require('../contain/polygon')
  const containRect = require('../contain/rect')
  const getDistance = require('../function/getDistance')
  const array = require('../util/array')

  class Heart extends Shape {

    drawing(painter, startX, startY, endX, endY, restore) {

      restore()

      this.x = startX
      this.y = startY
      this.width = this.height = 2 * getDistance(startX, startY, endX, endY)

      let width = getDistance(startX, 0, endX, 0)
      let height = getDistance(0, startY, 0, endY)

      const points = [ ], radius = width / 32, PI = Math.PI, PI2 = Math.PI * 2

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

    fill(painter) {
      painter.setFillStyle(this.fillStyle)
      painter.begin()
      this.drawPath(painter)
      painter.fill()
    }

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

    validate() {
      return this.width > 5 && this.height > 5
    }

  }

  return Heart

})