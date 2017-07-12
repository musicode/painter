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
      return x >= this.x
        && x <= this.x + this.width
        && y >= this.y
        && y <= this.y + this.height
    }

    /**
     * 画路径
     *
     * @param {Context} context
     */
    drawPath(context) {

      context.beginPath()
      context.rect(this.x, this.y, this.width, this.height)
      this.hasPath = true

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

      context.lineWidth = this.strokeThickness
      context.strokeStyle = this.strokeColor

      context.beginPath()
      context.rect(x, y, width, height)
      context.stroke()

    }

    /**
     * 填充
     *
     * @param {Context} context
     */
    fill(context) {

      if (!this.hasPath) {
        throw new Error('please drawPath() before fill()')
      }

      context.fillStyle = this.fillColor
      context.fill()

    }

    /**
     * 填充色
     *
     * @param {Context} context
     */
    draw(context) {

      if (this.hover) {
        drawHover(this, context)
      }

      this.drawPath(context)

      if (this.fillColor) {
        this.fill(context)
      }

      if (this.strokeThickness && this.strokeColor) {
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

      let { strokePosition, strokeThickness, x, y, width, height } = this

      if (strokePosition === constant.STROKE_POSITION_CENTER) {
        x -= strokeThickness * 0.5
        y -= strokeThickness * 0.5
        width += strokeThickness
        height += strokeThickness
      }
      else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        x -= strokeThickness
        y -= strokeThickness
        width += strokeThickness * 2
        height += strokeThickness * 2
      }

      return { x, y, width, height }

    }

  }

  return Rect

})