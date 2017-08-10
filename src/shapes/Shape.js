/**
 * @file 图形基类
 * @author musicode
 */
define(function (require) {

  const array = require('../util/array')

  const containLine = require('../contain/line')
  const containRect = require('../contain/rect')
  const getRectByPoints = require('../function/getRectByPoints')

  /**
   * 图形是点的集合
   * 因此图形基类默认通过 points 进行绘制
   * 对于特殊图形，可通过子类改写某些方法实现
   */

  class Shape {

    constructor(props) {
      Object.assign(this, props)
    }

    /**
     * 点是否位于图形范围内
     *
     * @param {Painter} painter
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInPath(painter, x, y) {

      if (containRect(this.getRect(painter), x, y)) {
        if (this.fillStyle && this.isPointInFill) {
          return this.isPointInFill(painter, x, y)
        }
        return this.isPointInStroke(painter, x, y)
      }

      return false

    }

    isPointInStroke(painter, x, y) {
      let { strokeThickness, points } = this
      if (strokeThickness < 8) {
        strokeThickness = 8
      }
      for (let i = 0, len = points.length; i < len; i++) {
        if (points[ i + 1 ]
          && containLine(
              points[ i ].x,
              points[ i ].y,
              points[ i + 1 ].x,
              points[ i + 1 ].y,
              strokeThickness, x, y
            )
        ) {
          return true
        }
      }
      return false
    }

    /**
     * 绘制图形
     *
     * @param {Painter} painter
     */
    draw(painter) {

      const needFill = this.fillStyle && this.fill
      const needStroke = this.strokeThickness && this.strokeStyle

      if (needFill || needStroke) {

        if (needFill) {
          if (!needStroke) {
            this.applyShadow(painter)
          }
          this.fill(painter)
        }

        if (needStroke) {
          this.applyShadow(painter)
          this.setLineStyle(painter)
          this.stroke(painter)
        }

      }
      else {
        this.draw(painter)
      }

    }

    /**
     * 绘制路径
     *
     * @param {Painter} painter
     */
    drawPath(painter) {
      painter.drawPoints(this.points)
    }

    /**
     * 描边
     *
     * @param {Painter} painter
     */
    stroke(painter) {
      painter.setLineWidth(this.strokeThickness)
      painter.setStrokeStyle(this.strokeStyle)
      painter.begin()
      this.drawPath(painter)
      painter.stroke()
    }

    applyShadow(painter) {
      if (this.shadowColor) {
        painter.enableShadow(
          this.shadowOffsetX,
          this.shadowOffsetY,
          this.shadowBlur,
          this.shadowColor
        )
      }
      else {
        painter.disableShadow()
      }
    }

    setLineStyle(painter) {

    }

    save(rect) {
      return this.points.map(
        function (point) {
          return {
            x: (point.x - rect.x) / rect.width,
            y: (point.y - rect.y) / rect.height,
          }
        }
      )
    }

    restore(rect, data) {
      array.each(
        this.points,
        function (point, i) {
          point.x = rect.x + rect.width * data[ i ].x
          point.y = rect.y + rect.height * data[ i ].y
        }
      )
    }

    validate() {
      const { points } = this
      return points && points.length > 1
    }

    getRect() {
      return getRectByPoints(this.points)
    }

  }

  return Shape

})