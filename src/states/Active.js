/**
 * @file 选中状态
 * @author musicode
 */
define(function (require) {

  const State = require('./State')
  const updateRect = require('../function/updateRect')

  const THUMB_SIZE = 12

  const LEFT_TOP = 0
  const CENTER_TOP = 1
  const RIGHT_TOP = 2
  const RIGHT_MIDDLE = 3
  const RIGHT_BOTTOM = 4
  const CENTER_BOTTOM = 5
  const LEFT_BOTTOM = 6
  const LEFT_MIDDLE = 7

  class Active extends State {

    constructor(props, emitter) {

      super(props)

      let me = this, currentBox, targetX, targetY, update

      me.emitter = emitter

      me.downHandler = function (event) {
        if (currentBox >= 0) {
          let left = me.x, top = me.y, right = left + me.width, bottom = top + me.height
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
          emitter.fire('updateStart')
        }
      }
      me.moveHandler = function (event) {

        if (update) {
          update(targetX || event.x, targetY || event.y)
          emitter.fire('updating')
          return
        }

        let index = me.isPointInPath(null, event.x, event.y), cursor
        if (index !== false) {
          if (currentBox !== index) {
            currentBox = index
            switch (index) {
              case CENTER_TOP:
              case CENTER_BOTTOM:
                cursor = 'row-resize'
                break
              case RIGHT_MIDDLE:
              case LEFT_MIDDLE:
                cursor = 'col-resize'
                break
              case LEFT_TOP:
                cursor = 'nw-resize'
                break
              case RIGHT_TOP:
                cursor = 'ne-resize'
                break
              case RIGHT_BOTTOM:
                cursor = 'se-resize'
                break
              case LEFT_BOTTOM:
                cursor = 'sw-resize'
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
            'canvasEdit',
            {
              edit: function (canvas) {
                canvas.style.cursor = cursor
              }
            }
          )
        }
      }
      me.upHandler = function (event) {
        if (currentBox >= 0) {
          currentBox = -1
          emitter.fire(
            'canvasEdit',
            {
              edit: function (canvas) {
                canvas.style.cursor = ''
              }
            }
          )
        }
        update = targetX = targetY = null
        emitter.fire('updateEnd')
      }

      emitter
      .on('mousedown', me.downHandler)
      .on('mousemove', me.moveHandler)
      .on('mouseup', me.upHandler)

    }

    destroy() {
      this.emitter
      .off('mousedown', this.downHandler)
      .off('mousemove', this.moveHandler)
      .off('mouseup', this.upHandler)
    }

    isPointInPath(painter, x, y) {
      let { boxes } = this
      if (boxes) {
        for (let i = 0, len = boxes.length, tx, ty; i < len; i += 2) {
          tx = boxes[ i ]
          ty = boxes[ i + 1 ]
          // 放大响应区域
          if (x >= tx - THUMB_SIZE
            && x <= tx + 2 * THUMB_SIZE
            && y >= ty - THUMB_SIZE
            && y <= ty + 2 * THUMB_SIZE
          ) {
            return i / 2
          }
        }
      }
      return false
    }

    draw(painter) {

      let { x, y, width, height } = this

      const left = x - THUMB_SIZE / 2
      const center = x + (width - THUMB_SIZE) / 2
      const right = x + width - THUMB_SIZE / 2

      const top = y - THUMB_SIZE / 2
      const middle = y + (height - THUMB_SIZE) / 2
      const bottom = y + height - THUMB_SIZE / 2

      painter.setLineWidth(1)
      painter.setStrokeStyle('#ccc')

      // 矩形线框
      painter.begin()
      painter.drawRect(x + 0.5, y + 0.5, width, height)
      painter.stroke()
      painter.close()

      painter.setStrokeStyle('#a2a2a2')

      // 方块加点阴影
      painter.enableShadow(0, 2, 3, 'rgba(0,0,0,0.2)')

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
        gradient = painter.createLinearGradient(x, y + THUMB_SIZE, x, y)
        gradient.addColorStop(0, '#d6d6d6')
        gradient.addColorStop(1, '#f9f9f9')
        painter.begin()
        painter.setFillStyle(gradient)
        painter.drawRect(x, y, THUMB_SIZE, THUMB_SIZE)
        painter.stroke()
        painter.fill()
      }

      this.boxes = boxes

      painter.disableShadow()

    }

  }

  return Active

})