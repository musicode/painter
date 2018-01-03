/**
 * @file 选中状态
 * @author musicode
 */

import State from './State'
import Emitter from '../Emitter'
import constant from '../constant'

import updateRect from '../function/updateRect'
import getUnionRect from '../function/getUnionRect'
import array from '../util/array'
import object from '../util/object'

const LEFT_TOP = 0
const CENTER_TOP = 1
const RIGHT_TOP = 2
const RIGHT_MIDDLE = 3
const RIGHT_BOTTOM = 4
const CENTER_BOTTOM = 5
const LEFT_BOTTOM = 6
const LEFT_MIDDLE = 7

function isTextShape(shape) {
  return shape.toJSON().fontSize ? true : false
}

export default class Active extends State {

  constructor(props, emitter, painter) {

    super(props, emitter)

    let me = this, currentBox, targetX, targetY, update, hoverShape, savedShapes

    me.shapes = [ ]

    const saveShapes = function () {
      savedShapes = me.shapes.map(
        function (shape) {
          return shape.save(me)
        }
      )
    }

    const updateShapes = function () {
      array.each(
        me.shapes,
        function (shape, i) {
          shape.restore(me, savedShapes[ i ])
        }
      )
    }

    me.clearHandler = function () {
      me.setShapes(painter, [ ])
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
      if (currentBox >= 0) {
        const left = me.x, top = me.y, right = left + me.width, bottom = top + me.height
        switch (currentBox) {
          case LEFT_TOP:
            update = updateRect(me, right, bottom)
            break
          case CENTER_TOP:
            targetX = left
            update = updateRect(me, right, bottom)
            break
          case RIGHT_TOP:
            update = updateRect(me, left, bottom)
            break
          case RIGHT_MIDDLE:
            targetY = bottom
            update = updateRect(me, left, top)
            break
          case RIGHT_BOTTOM:
            update = updateRect(me, left, top)
            break
          case CENTER_BOTTOM:
            targetX = right
            update = updateRect(me, left, top)
            break
          case LEFT_BOTTOM:
            update = updateRect(me, right, top)
            break
          case LEFT_MIDDLE:
            targetY = bottom
            update = updateRect(me, right, top)
            break
        }
        saveShapes()
      }
      else if (hoverShape) {
        if (!array.has(me.shapes, hoverShape)) {
          me.setShapes(painter, [ hoverShape ])
        }
        const offsetX = event.x - me.x, offsetY = event.y - me.y
        update = function (x, y) {
          me.x = x - offsetX
          me.y = y - offsetY
        }
        saveShapes()
      }
      else if (event.inCanvas && me.shapes.length) {
        me.setShapes(painter, [ ])
      }
    }
    me.mouseMoveHandler = function (event) {

      if (update) {
        update(targetX || event.x, targetY || event.y)
        emitter.fire(
          Emitter.ACTIVE_RECT_CHANGE_START,
        )
        updateShapes()
        emitter.fire(
          Emitter.ACTIVE_RECT_CHANGE_END
        )
        return
      }

      let index = me.isPointInPath(painter, event.x, event.y), cursor
      if (index !== false) {
        if (currentBox !== index) {
          currentBox = index
          switch (index) {
            case CENTER_TOP:
            case CENTER_BOTTOM:
              cursor = 'ns'
              break
            case RIGHT_MIDDLE:
            case LEFT_MIDDLE:
              cursor = 'ew'
              break
            case LEFT_TOP:
            case RIGHT_BOTTOM:
              cursor = 'nwse'
              break
            case RIGHT_TOP:
            case LEFT_BOTTOM:
              cursor = 'nesw'
              break
          }
        }
      }
      else if (currentBox >= 0) {
        cursor = ''
        currentBox = -1
      }
      if (cursor != null) {
        emitter.fire(
          Emitter.ACTIVE_DRAG_BOX_HOVER,
          {
            name: cursor
          }
        )
      }
    }
    me.mouseUpHandler = function (event) {
      if (currentBox >= 0) {
        currentBox = -1
        emitter.fire(
          Emitter.ACTIVE_DRAG_BOX_HOVER,
          {
            name: ''
          }
        )
      }
      update = targetX = targetY = null
    }
    me.resetUpHandler = function (event) {
      if (currentBox >= 0) {
        me.mouseUpHandler(event)
      }
      me.setShapes(painter, [ ])
    }

    me
    .on(Emitter.CLEAR, me.clearHandler)
    .on(Emitter.SHAPE_ENTER, me.shapeEnterHandler)
    .on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler)
    .on(Emitter.MOUSE_DOWN, me.mouseDownHandler)
    .on(Emitter.MOUSE_MOVE, me.mouseMoveHandler)
    .on(Emitter.MOUSE_UP, me.mouseUpHandler)
    .on(Emitter.RESET, me.resetUpHandler)

  }

  destroy() {
    this
    .off(Emitter.CLEAR, this.clearHandler)
    .off(Emitter.SHAPE_ENTER, this.shapeEnterHandler)
    .off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler)
    .off(Emitter.MOUSE_DOWN, this.mouseDownHandler)
    .off(Emitter.MOUSE_MOVE, this.mouseMoveHandler)
    .off(Emitter.MOUSE_UP, this.mouseUpHandler)
    .off(Emitter.RESET, this.resetUpHandler)
  }

  getShapes() {
    return this.shapes
  }

  setShapes(painter, shapes) {
    if (shapes.length > 0) {
      let rect = getUnionRect(
        shapes.map(
          function (shape) {
            return shape.getRect(painter)
          }
        )
      )
      object.extend(this, rect)
    }
    else {
      this.width = this.height = 0
    }

    this.shapes = shapes

    this.emitter.fire(
      Emitter.ACTIVE_SHAPE_CHANGE,
      {
        shapes: shapes
      }
    )

  }

  isPointInPath(painter, x, y) {
    const { boxes, thumbSize } = this
    if (boxes) {
      for (let i = 0, len = boxes.length, tx, ty; i < len; i += 2) {
        tx = boxes[ i ]
        ty = boxes[ i + 1 ]
        // 扩大响应区域
        if (x >= tx - thumbSize
          && x <= tx + 2 * thumbSize
          && y >= ty - thumbSize
          && y <= ty + 2 * thumbSize
        ) {
          return i / 2
        }
      }
    }
    return false
  }

  draw(painter) {

    let { shapes, x, y, width, height } = this
    let { length } = shapes
    if (!length) {
      return
    }

    painter.disableShadow()
    painter.setLineWidth(1)

    // 是否只有文字
    // 如果是，不用画九个 thumb
    let textOnly

    if (length > 1) {
      textOnly = true
      painter.setStrokeStyle('#C0CED8')
      array.each(
        shapes,
        function (shape) {
          let rect = shape.getRect(painter)
          painter.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height)
          if (textOnly && !isTextShape(shape)) {
            textOnly = false
          }
        }
      )
    }
    else {
      textOnly = isTextShape(shapes[ 0 ])
    }

    painter.setStrokeStyle('#ccc')

    // 矩形线框
    painter.begin()
    painter.drawRect(x + 0.5, y + 0.5, width, height)
    painter.stroke()

    if (!textOnly) {
      painter.setStrokeStyle('#a2a2a2')

      // 方块加点阴影
      painter.enableShadow(0, 2, 3, 'rgba(0,0,0,0.2)')

      const thumbSize = this.thumbSize = 6 * constant.DEVICE_PIXEL_RATIO

      const left = x - thumbSize / 2
      const center = x + (width - thumbSize) / 2
      const right = x + width - thumbSize / 2

      const top = y - thumbSize / 2
      const middle = y + (height - thumbSize) / 2
      const bottom = y + height - thumbSize / 2

      const boxes = [
        left, top,
        center, top,
        right, top,
        right, middle,
        right, bottom,
        center, bottom,
        left, bottom,
        left, middle,
      ]

      for (let i = 0, len = boxes.length, gradient; i < len; i += 2) {
        x = boxes[ i ]
        y = boxes[ i + 1 ]
        gradient = painter.createLinearGradient(x, y + thumbSize, x, y)
        gradient.addColorStop(0, '#d6d6d6')
        gradient.addColorStop(1, '#f9f9f9')
        painter.begin()
        painter.setFillStyle(gradient)
        painter.drawRect(x, y, thumbSize, thumbSize)
        painter.stroke()
        painter.fill()
      }

      this.boxes = boxes

      painter.disableShadow()
    }

  }

}
