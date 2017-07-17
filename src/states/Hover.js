/**
 * @file Hover 状态
 * @author musicode
 */
define(function (require) {

  const State = require('./State')

  class Hover extends State {

    isPointInPath(context, x, y) {
      return false
    }

    drawPath(context) {
      this.shape.drawPath(context, true)
    }

    draw(context) {

      context.lineWidth = 4
      context.strokeStyle = '#45C0FF'

      context.beginPath()
      this.drawPath(context)
      context.stroke()

    }

  }

  return Hover

})