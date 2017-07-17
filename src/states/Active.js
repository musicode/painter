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

    constructor(props, emitter, canvas) {

      super(props)

      let me = this, style = canvas.style, currentBox, targetX, targetY, update

      me.emitter = emitter

      me.mousedownHandler = function (event) {
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
          emitter.fire('updateStart', me)
        }
      }
      me.mousemoveHandler = function (event) {

        if (update) {
          update(targetX || event.x, targetY || event.y)
          emitter.fire('updating', me)
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
          style.cursor = cursor
        }
      }
      me.mouseupHandler = function (event) {
        if (currentBox >= 0) {
          style.cursor = ''
          currentBox = -1
        }
        if (update) {
          update = null
        }
        if (targetX) {
          targetX = null
        }
        if (targetY) {
          targetY = null
        }
        emitter.fire('updateEnd', me)
      }

      emitter
      .on('mousedown', me.mousedownHandler)
      .on('mousemove', me.mousemoveHandler)
      .on('mouseup', me.mouseupHandler)

    }

    destroy() {
      this.emitter
      .off('mousedown', this.mousedownHandler)
      .off('mousemove', this.mousemoveHandler)
      .off('mouseup', this.mouseupHandler)
    }

    isPointInPath(context, x, y) {
      let { boxes } = this
      if (boxes) {
        for (let i = 0, len = boxes.length, tx, ty; i < len; i += 2) {
          tx = boxes[ i ]
          ty = boxes[ i + 1 ]
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

    draw(context) {

      let { x, y, width, height } = this

      const left = x - THUMB_SIZE / 2
      const center = x + (width - THUMB_SIZE) / 2
      const right = x + width - THUMB_SIZE / 2

      const top = y - THUMB_SIZE / 2
      const middle = y + (height - THUMB_SIZE) / 2
      const bottom = y + height - THUMB_SIZE / 2

      context.lineWidth = 1
      context.strokeStyle = '#ccc'

      // 矩形线框
      context.beginPath()
      context.rect(x + 0.5, y + 0.5, width, height)
      context.stroke()
      context.closePath()

      context.strokeStyle = '#a2a2a2'

      // 方块加点阴影
      context.shadowColor = 'rgba(0,0,0,0.2)'
      context.shadowOffsetX = 0
      context.shadowOffsetY = 2
      context.shadowBlur = 3

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
        gradient = context.createLinearGradient(x, y + THUMB_SIZE, x, y)
        gradient.addColorStop(0, '#d6d6d6')
        gradient.addColorStop(1, '#f9f9f9')
        context.beginPath()
        context.fillStyle = gradient
        context.rect(x, y, THUMB_SIZE, THUMB_SIZE)
        context.stroke()
        context.fill()
      }

      this.boxes = boxes

      context.shadowColor =
      context.shadowOffsetX =
      context.shadowOffsetY =
      context.shadowBlur = 0

    }

  }

  return Active

})