/**
 * @file 正在绘制
 * @author musicode
 */
define(function (require) {

  const State = require('./State')
  const Emitter = require('../Emitter')

  class Drawing extends State {

    constructor(props, emitter, painter) {

      super(props)

      let me = this, hoverShape, drawingShape, saved, startX, startY

      me.emitter = emitter

      // 提供两种清空画布的方式
      // 1. 还原鼠标按下时保存的画布
      // 2. 全量刷新画布
      const restore = function () {
        if (!saved) {
          saved = painter.save()
        }
        else {
          painter.restore(saved)
        }
      }

      const refresh = function () {
        emitter.fire(
          Emitter.REFRESH
        )
      }

      me.shapeEnterHandler = function (event) {
        let { shape } = event
        if (!shape.state) {
          hoverShape = shape
        }
      }
      me.shapeLeaveHandler = function () {
        if (hoverShape) {
          hoverShape = null
        }
      }
      me.mouseDownHandler = function (event) {
        if (event.inCanvas && !hoverShape) {
          startX = event.x
          startY = event.y

          drawingShape = new me.Shape({
            strokeStyle: '#ddd',
            strokePosition: 2,
            strokeThickness: 10,
          })

          emitter.fire(
            Emitter.DRAWING_START
          )
        }
      }
      me.mouseMoveHandler = function (event) {
        if (drawingShape) {
          drawingShape.drawing(painter, startX, startY, event.x, event.y, restore, refresh)
        }
      }
      me.mouseUpHandler = function () {
        if (saved) {
          saved = null
        }
        if (drawingShape) {
          emitter.fire(
            Emitter.DRAWING_END,
            {
              shape: drawingShape
            }
          )
          drawingShape = null
        }
      }

      emitter
      .on(Emitter.SHAPE_ENTER, me.shapeEnterHandler)
      .on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler)
      .on(Emitter.MOUSE_DOWN, me.mouseDownHandler)
      .on(Emitter.MOUSE_MOVE, me.mouseMoveHandler)
      .on(Emitter.MOUSE_UP, me.mouseUpHandler)

    }

    destroy() {
      this.emitter
      .off(Emitter.SHAPE_ENTER, this.shapeEnterHandler)
      .off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler)
      .off(Emitter.MOUSE_DOWN, this.mouseDownHandler)
      .off(Emitter.MOUSE_MOVE, this.mouseMoveHandler)
      .off(Emitter.MOUSE_UP, this.mouseUpHandler)
    }

    isPointInPath(painter, x, y) {
      return false
    }

    draw(painter) {

    }

  }

  return Drawing

})