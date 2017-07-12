/**
 * @file 矩形
 * @author musicode
 */
define(function (require) {

  var Shape = require('./Shape')
  var constant = require('../constant')
  var drawHover = require('../function/drawHover')

  class Rect extends Shape {

    constructor(options) {
      super(options)
      Object.assign(this, options)
    }

    /**
     * 描边色
     *
     * @param {Context} context
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(context, x, y) {
      let rect = this.getRect();
      return x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height
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
      context.strokeStyle = this.strokeColor

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

      context.fillStyle = this.fillColor

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

      if (this.fillColor) {
        this.fill(context)
      }

      if (this.strokeThickness && this.strokeColor) {
        this.stroke(context)
      }

      if (this.hover) {
        drawHover(this, context)
      }

    }

    /**
     * 获取矩形的矩形范围
     *
     * @override
     * @return {Object} 返回格式为 { x, y, width, height }
     */
    getRect() {
      return this.rect || this
    }

  }

  return Rect

})