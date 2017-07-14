/**
 * @file 选区
 * @author musicode
 */
define(function (require) {

  var State = require('./State')

  class Selection extends State {

    isPointInPath(context, x, y) {
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
    }

    drawPath(context) {
      context.rect(this.x, this.y, this.width, this.height)
    }

    draw(context) {

      context.lineWidth = 2
      context.strokeStyle = '#a2a2a2'
      context.fillStyle = 'rgba(60,60,60,0.1)'

      context.beginPath()
      this.drawPath()
      context.stroke()
      context.fill()

    }

  }

  return Selection

})