/**
 * @file 矩形
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')
  var constant = require('../constant')

  class Rect extends Shape {

    /**
     * 点是否位于图形范围内
     *
     * @param {Context} context
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(context, x, y) {
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
    }

    /**
     * 描边
     *
     * @param {Context} context
     */
    stroke(context) {

      // canvas 的描边机制是 center
      let { strokePosition, strokeThickness, x, y, width, height } = this

      // inside
      if (strokePosition === constant.STROKE_POSITION_INSIDE) {
        x += strokeThickness * 0.5
        y += strokeThickness * 0.5
        width -= strokeThickness
        height -= strokeThickness
      }
      // outside
      else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        x -= strokeThickness * 0.5
        y -= strokeThickness * 0.5
        width += strokeThickness
        height += strokeThickness
      }

      context.lineWidth = strokeThickness
      context.strokeStyle = this.strokeStyle

      context.beginPath()
      context.rect(x, y, width, height)
      context.stroke()

      this.rect = {
        x: x - strokeThickness * 0.5,
        y: y - strokeThickness * 0.5,
        width: width + strokeThickness,
        height: height + strokeThickness
      }

    }

    /**
     * 填充
     *
     * @param {Context} context
     */
    fill(context) {

      context.fillStyle = this.fillStyle

      context.beginPath()
      context.rect(this.x, this.y, this.width, this.height)
      context.fill()

    }

    /**
     * 填充色
     *
     * @param {Context} context
     */
    draw(context) {

      if (this.fillStyle) {
        this.fill(context)
      }

      if (this.strokeThickness && this.strokeStyle) {
        this.stroke(context)
      }

    }

    /**
     * 获取矩形的矩形范围
     *
     * @override
     * @return {Object} 返回格式为 { x, y, width, height }
     */
    getRect() {
      return this
    }

  }

  return Rect

})