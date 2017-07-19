/**
 * @file 选区
 * @author musicode
 */
define(function (require) {

  var State = require('./State')

  class Selection extends State {

    isPointInPath(painter, x, y) {
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
    }

    draw(painter) {

      painter.setLineWidth(1)
      painter.setStrokeStyle('#ccc')
      painter.setFillStyle('rgba(180,180,180,0.1)')

      painter.begin()
      painter.drawRect(this.x + 0.5, this.y + 0.5, this.width, this.height)
      painter.stroke()
      painter.fill()

    }

  }

  return Selection

})