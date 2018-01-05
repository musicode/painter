/**
 * @file 选区
 * @author musicode
 */
import State from './State'
import Emitter from '../Emitter'
import updateRect from '../function/updateRect'

export default class Selection extends State {

  constructor(props, emitter) {

    super(props, emitter)

    let me = this, hoverShape

    me.mouseDownHandler = function (event) {
      if (!hoverShape && event.inCanvas) {

        let update = updateRect(me, event.x, event.y)

        emitter.fire(
          Emitter.SELECTION_START
        )

        const mouseMoveHandler = function (event) {
          update(event.x, event.y)
          emitter.fire(
            Emitter.SELECTION_RECT_CHANGE,
            {
              rect: me
            }
          )
        }

        const mouseUpHandler = function () {
          emitter.off(Emitter.MOUSE_MOVE, mouseMoveHandler)
          emitter.off(Emitter.MOUSE_UP, mouseUpHandler)
          emitter.off(Emitter.RESET, mouseUpHandler)
          me.x = me.y = me.width = me.height = update = null
          emitter.fire(
            Emitter.SELECTION_END
          )
        }
        emitter
        .on(Emitter.MOUSE_MOVE, mouseMoveHandler)
        .on(Emitter.MOUSE_UP, mouseUpHandler)
        .on(Emitter.RESET, mouseUpHandler)
      }
    }

    me.shapeEnterHandler = function (event) {
      hoverShape = event.shape
    }

    me.shapeLeaveHandler = function () {
      if (hoverShape) {
        hoverShape = null
      }
    }

    me
    .on(Emitter.MOUSE_DOWN, me.mouseDownHandler)
    .on(Emitter.SHAPE_ENTER, me.shapeEnterHandler)
    .on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler)

  }

  destroy() {
    this
    .off(Emitter.MOUSE_DOWN, this.mouseDownHandler)
    .off(Emitter.SHAPE_ENTER, this.shapeEnterHandler)
    .off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler)
  }

  isPointInPath(painter, x, y) {
    return false
  }

  draw(painter) {

    const { x, y, width, height } = this
    if (!width || !height) {
      return
    }

    painter.disableShadow()

    painter.setLineWidth(1)
    painter.setStrokeStyle('#ccc')
    painter.setFillStyle('rgba(180,180,180,0.1)')

    painter.begin()
    painter.drawRect(x + 0.5, y + 0.5, width, height)
    painter.stroke()
    painter.fill()

  }

}
