/**
 * @file Hover 状态
 * @author musicode
 */
define(function (require) {

  const State = require('./State')

  class Hover extends State {

    isPointInPath(painter, x, y) {
      return false
    }

    drawPath(painter) {
      this.shape.drawPath(painter)
    }

    draw(painter) {

      painter.setLineWidth(4)
      painter.setStrokeStyle('#45C0FF')

      painter.begin()
      this.drawPath(painter)
      painter.stroke()

    }

  }

  return Hover

})