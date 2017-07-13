/**
 * @file 选区
 * @author musicode
 */
define(function (require) {

  var Shape = require('../shapes/Shape')

  class Selection extends Shape {

    draw(context) {

      context.lineWidth = 2
      context.strokeStyle = '#a2a2a2'
      context.fillStyle = 'rgba(60,60,60,0.1)'

      context.beginPath()
      context.rect(this.x, this.y, this.width, this.height)
      context.stroke()
      context.fill()

    }

  }

  return Selection

})