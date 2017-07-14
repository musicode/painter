/**
 * @file 选中状态
 * @author musicode
 */
define(function (require) {

  const Shape = require('../shapes/Shape')
  const thumbSize = 12

  const LEFT_TOP = 0
  const CENTER_TOP = 1
  const RIGHT_TOP = 2
  const RIGHT_MIDDLE = 3
  const RIGHT_BOTTOM = 4
  const CENTER_BOTTOM = 5
  const LEFT_BOTTOM = 6
  const LEFT_MIDDLE = 7

  class Active extends Shape {

    constructor(props, emitter, canvas) {

      super(props)

      let me = this, style = canvas.style, currentBox, dragging

      emitter
      .on('mousedown', function (event) {
        if (currentBox >= 0) {
          let x, y
          switch (currentBox) {
            case LEFT_TOP:
              x = me.boxes[ 9 ]
              y = me.boxes[ 10 ]
              break
            case CENTER_TOP:
              x = me.boxes[ 11 ]
              y = me.boxes[ 12 ]
              break
            case RIGHT_TOP:
              x = me.boxes[ 13 ]
              y = me.boxes[ 14 ]
              break
            case RIGHT_MIDDLE:
              x = me.boxes[ 15 ]
              y = me.boxes[ 16 ]
              break
            case RIGHT_BOTTOM:
              x = me.boxes[ 0 ]
              y = me.boxes[ 1 ]
              break
            case CENTER_BOTTOM:
              x = me.boxes[ 3 ]
              y = me.boxes[ 4 ]
              break
            case LEFT_BOTTOM:
              x = me.boxes[ 5 ]
              y = me.boxes[ 6 ]
              break
            case LEFT_MIDDLE:
              x = me.boxes[ 7 ]
              y = me.boxes[ 8 ]
              break
          }
          me.x = x
          me.y = y
          dragging = true
        }
      })
      .on('mousemove', function (event) {

        if (dragging) {
          me.width = event.x - me.x
          me.height = event.y = me.y
          return
        }

        for (let i = 0, len = me.boxes.length, x, y, index, cursor; i < len; i += 2) {
          x = me.boxes[ i ]
          y = me.boxes[ i + 1 ]
          if (event.x >= x
            && event.x <= x + thumbSize
            && event.y >= y
            && event.y <= y + thumbSize
          ) {
            index = i / 2
            if (index !== currentBox) {
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
              currentBox = index
            }
            break
          }
          else if (currentBox >= 0) {
            cursor = ''
            currentBox = -1
          }
          if (cursor != null) {
            style.cursor = cursor
          }
        }
      })
      .on('mouseup', function (event) {
        dragging = null
        if (currentBox >= 0) {
          style.cursor = ''
          currentBox = -1
        }
      })
    }

    draw(context) {

      let { x, y, width, height } = this

      const left = x - thumbSize / 2
      const center = x + (width - thumbSize) / 2
      const right = x + width - thumbSize / 2

      const top = y - thumbSize / 2
      const middle = y + (height - thumbSize) / 2
      const bottom = y + height - thumbSize / 2

      context.lineWidth = 2
      context.strokeStyle = '#ccc'

      // 矩形线框
      context.beginPath()
      context.rect(x, y, width, height)
      context.stroke()
      context.closePath()

      context.strokeStyle = '#a2a2a2'

      // 方块加点阴影
      context.shadowColor = 'rgba(0,0,0,0.2)'
      context.shadowOffsetX = 0
      context.shadowOffsetY = 2
      context.shadowBlur = 6

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
        gradient = context.createLinearGradient(x, y + thumbSize, x, y)
        gradient.addColorStop(0, '#ddd')
        gradient.addColorStop(1, '#f9f9f9')
        context.beginPath()
        context.fillStyle = gradient
        context.rect(x, y, thumbSize, thumbSize)
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