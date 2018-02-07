/**
 * @file 椭圆
 * @author musicode
 */
import Shape from './Shape'
import constant from '../constant'

import containRect from '../contain/rect'
import getDistance from '../function/getDistance'

/**
 * (x, y) 圆心
 * width 宽
 * height 高
 */
export default class Oval extends Shape {

  /**
   * 点是否位于图形范围内
   *
   * @param {Painter} painter
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  isPointInFill(painter, x, y) {
    painter.begin()
    this.drawPath(painter)
    return painter.isPointInPath(x, y)
  }

  isPointInStroke(painter, x1, y1) {

    let {
      x,
      y,
      width,
      height,
      strokeStyle,
      strokePosition,
      lineWidth,
    } = this

    if (lineWidth < constant.SIZE_MIN) {
      lineWidth = constant.SIZE_MIN
    }

    let halfLineWidth = 0.5 * lineWidth
    let doubleLineWidth = 2 * lineWidth

    painter.begin()

    switch (strokePosition) {
      case constant.STROKE_POSITION_OUTSIDE:
        painter.drawOval(x, y, width + doubleLineWidth, height + doubleLineWidth)
        if (painter.isPointInPath(x1, y1)) {
          painter.begin()
          painter.drawOval(x, y, width, height)
          return !painter.isPointInPath(x1, y1)
        }
      case constant.STROKE_POSITION_CENTER:
        painter.drawOval(x, y, width + lineWidth, height + lineWidth)
        if (painter.isPointInPath(x1, y1)) {
          width -= lineWidth
          height -= lineWidth
          painter.begin()
          painter.drawOval(x, y, width, height)
          return !painter.isPointInPath(x1, y1)
        }
        break
      case constant.STROKE_POSITION_INSIDE:
        painter.drawOval(x, y, width, height)
        if (painter.isPointInPath(x1, y1)) {
          width -= doubleLineWidth
          height -= doubleLineWidth
          painter.begin()
          painter.drawOval(x, y, width, height)
          return !painter.isPointInPath(x1, y1)
        }
        break
    }

    return false

  }

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */
  drawPath(painter) {
    painter.drawOval(this.x, this.y, this.width, this.height)
  }

  /**
   * 描边
   *
   * @param {Painter} painter
   */
  stroke(painter) {
    let {
      x,
      y,
      width,
      height,
      strokeStyle,
      strokePosition,
      lineWidth,
    } = this

    // Canvas 的描边机制是 center

    // inside
    if (strokePosition === constant.STROKE_POSITION_INSIDE) {
      width -= lineWidth
      height -= lineWidth
      if (width < 0 || height < 0) {
        return
      }
    }
    // outside
    else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
      width += lineWidth
      height += lineWidth
    }

    painter.setLineWidth(lineWidth)
    painter.setStrokeStyle(strokeStyle)
    painter.begin()
    painter.drawOval(x, y, width, height)
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

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */
  drawing(painter, startX, startY, endX, endY, restore) {

    restore()

    this.x = startX
    this.y = startY
    this.width = this.height = 2 * getDistance(startX, startY, endX, endY)
    this.draw(painter)

  }

  save(rect) {
    return {
      x: (this.x - rect.x) / rect.width,
      y: (this.y - rect.y) / rect.height,
      width: this.width / rect.width,
      height: this.height / rect.height,
    }
  }

  restore(rect, data) {
    this.x = rect.x + rect.width * data.x
    this.y = rect.y + rect.height * data.y
    this.width = rect.width * data.width
    this.height = rect.height * data.height
  }

  validate() {
    return this.width > 5 && this.height > 5
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

  toJSON() {
    return super.toJSON({
      name: 'Oval',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    })
  }

}
