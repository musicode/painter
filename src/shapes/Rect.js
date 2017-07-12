/**
 * @file 矩形
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')

  class Rect extends Shape {

    drawPath(context, x, y, width, height) {

      this.x = x
      this.y = y
      this.width = width
      this.height = height

      context.beginPath()
      context.rect(x, y, width, height)

    }

    isPointInPath(context, x, y) {
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
    }

    stroke(context, strokeStyle, lineWidth) {

      this.lineWidth =
      context.lineWidth = lineWidth

      this.strokeStyle =
      context.strokeStyle = strokeStyle

      context.stroke()

    }

    fill(context, fillStyle) {
      this.fillStyle =
      context.fillStyle = fillStyle
      context.fill()
    }



  }

  return Rect

})