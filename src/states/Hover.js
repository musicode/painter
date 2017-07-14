/**
 * @file Hover 状态
 * @author musicode
 */
define(function (require) {

  const State = require('./State')

  class Hover extends State {

    isPointInPath(context, x, y) {
      context.beginPath()
      this.drawPath()
      return context.isPointInPath(x, y)
    }

    drawPath(context) {
      this.shape.drawPath(context)
    }

    draw(context) {

      context.lineWidth = 4
      context.strokeStyle = '#45C0FF'

      context.beginPath()
      this.drawPath()
      context.stroke()

    }

  }

  return Hover

})