/**
 * @file 椭圆
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')
  var constant = require('../constant')

  /**
   * (x, y) 圆心
   * width 宽
   * height 高
   */
  class Oval extends Shape {

    /**
     * 点是否位于图形范围内
     *
     * @param {Painter} painter
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(painter, x, y) {

      const rect = this.getRect()

      if (x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height
      ) {
        painter.begin()
        this.drawPath(painter)
        return painter.isPointInPath(x, y)
      }

      return false

    }

    drawPath(painter) {

      const { x, y, width, height } = this

      if (width === height) {
        const radius = width / 2
        painter.moveTo(x + radius, y)
        painter.arc(x, y, radius, 0, 2 * Math.PI, true)
      }
      else {
        const w = (width / 0.75) / 2, h = height / 2
        painter.moveTo(x, y - h)
        painter.bezierCurveTo(x + w, y - h, x + w, y + h, x, y + h)
        painter.bezierCurveTo(x - w, y + h, x - w, y - h, x, y - h)
      }

    }

    /**
     * 描边
     *
     * @param {Painter} painter
     */
    stroke(painter) {

      let { strokePosition, strokeThickness, x, y, width, height } = this

      painter.setLineWidth(this.strokeThickness)
      painter.setStrokeStyle(this.strokeStyle)
      painter.begin()
      this.drawPath(painter)
      painter.stroke()

    }

    /**
     * 填充
     *
     * @param {Painter} painter
     */
    fill(painter) {

      painter.setFillStyle(this.fillStyle)
      painter.begin()
      this.drawPath(painter)
      painter.fill()

    }

    getRect() {
      const { x, y, width, height } = this
      return {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
      }
    }

  }

  return Oval

})