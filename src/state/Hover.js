/**
 * @file Hover 状态
 * @author musicode
 */
define(function (require) {

  var Shape = require('../shapes/Shape')

  class Hover extends Shape {

    draw(context) {

      const thickness = 4

      context.lineWidth = thickness
      context.strokeStyle = '#45C0FF'

      context.beginPath()
      context.rect(
        this.x - thickness * 0.5,
        this.y - thickness * 0.5,
        this.width + thickness,
        this.height + thickness
      )
      context.stroke()

    }

  }

  return Hover

})