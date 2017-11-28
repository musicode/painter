/**
 * @file Hover 状态
 * @author musicode
 */
import State from './State'
import Emitter from '../Emitter'
import constant from '../constant'

import array from '../util/array'

export default class Hover extends State {

  constructor(props, emitter) {

    super(props, emitter)

    let me = this, activeShapes, drawing

    me.shapeEnterHandler = function (event) {
      let { shape } = event
      if (!drawing && !shape.state && (!activeShapes || !array.has(activeShapes, shape))) {
        me.shape = shape
        emitter.fire(
          Emitter.HOVER_SHAPE_CHANGE,
          {
            shape,
          }
        )
      }
    }

    me.shapeLeaveHandler = function () {
      if (me.shape) {
        me.shape = null
        emitter.fire(
          Emitter.HOVER_SHAPE_CHANGE,
          {
            shape: null
          }
        )
      }
    }

    me.drawingStartHandler = function () {
      drawing = true
    }

    me.drawingEndHandler = function () {
      drawing = false
    }

    me.activeShapeChangeHandler = function (events) {
      activeShapes = events.shapes
      if (array.has(activeShapes, me.shape)) {
        me.shape = null
      }
    }

    me.resetHandler = function () {
      me.shape = null
    }

    me
    .on(Emitter.SHAPE_ENTER, me.shapeEnterHandler)
    .on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler)
    .on(Emitter.SHAPE_DRAWING_START, me.drawingStartHandler)
    .on(Emitter.SHAPE_DRAWING_END, me.drawingEndHandler)
    .on(Emitter.ACTIVE_SHAPE_CHANGE, me.activeShapeChangeHandler)
    .on(Emitter.RESET, me.resetHandler)
  }

  destroy() {
    this
    .off(Emitter.SHAPE_ENTER, this.shapeEnterHandler)
    .off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler)
    .off(Emitter.SHAPE_DRAWING_START, this.drawingStartHandler)
    .off(Emitter.SHAPE_DRAWING_END, this.drawingEndHandler)
    .off(Emitter.ACTIVE_SHAPE_CHANGE, this.activeShapeChangeHandler)
    .off(Emitter.RESET, this.resetHandler)
  }

  isPointInPath(painter, x, y) {
    return false
  }

  draw(painter) {

    let { shape, hoverThickness, hoverColor } = this
    if (!shape) {
      return
    }

    painter.disableShadow()

    painter.setLineWidth(hoverThickness * constant.DEVICE_PIXEL_RATIO)
    painter.setStrokeStyle(hoverColor)

    painter.begin()
    shape.drawPath(painter)
    painter.stroke()

  }

}
