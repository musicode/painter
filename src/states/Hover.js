/**
 * @file Hover 状态
 * @author musicode
 */
define(function (require) {

  const State = require('./State')
  const Emitter = require('../Emitter')

  const array = require('../util/array')

  class Hover extends State {

    constructor(props, emitter) {

      super(props)

      let me = this, activeShapes

      me.emitter = emitter

      me.shapeEnterHandler = function (event) {
        let { shape } = event
        if (!shape.state && (!activeShapes || !array.has(activeShapes, shape))) {
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

      me.activeShapeChangeHandler = function (events) {
        activeShapes = events.shapes
        if (array.has(activeShapes, me.shape)) {
          me.shape = null
        }
      }

      emitter
      .on(Emitter.SHAPE_ENTER, me.shapeEnterHandler)
      .on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler)
      .on(Emitter.ACTIVE_SHAPE_CHANGE, me.activeShapeChangeHandler)
    }

    isPointInPath(painter, x, y) {
      return false
    }

    draw(painter) {

      let { shape } = this
      if (!shape) {
        return
      }

      painter.setLineWidth(4)
      painter.setStrokeStyle('#45C0FF')

      painter.begin()
      shape.drawPath(painter)
      painter.stroke()

    }

  }

  return Hover

})