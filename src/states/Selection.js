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
      context.rect(this.x + 0.5, this.y + 0.5, this.width, this.height)
    }

    draw(context) {

      context.lineWidth = 1
      context.strokeStyle = '#ccc'
      context.fillStyle = 'rgba(180,180,180,0.1)'

      context.beginPath()
      this.drawPath(context)
      context.stroke()
      context.fill()

    }

  }

  return Selection

})