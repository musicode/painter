/**
 * @file 选中状态
 * @author musicode
 */
define(function (require) {

  const Shape = require('../shapes/Shape')
  const thumbSize = 12

  class Active extends Shape {

    constructor(props, emitter, canvas) {
      super(props)

      let me = this, currentBox

      emitter
      .on('mousedown', function (event) {

      })
      .on('mousemove', function (event) {
        for (let i = 0, len = me.boxes.length, x, y; i < len; i += 2) {
          x = me.boxes[ i ]
          y = me.boxes[ i + 1 ]
          if (event.x > x
            && event.x <= x + thumbSize
            && event.y > y
            && event.y <= y + thumbSize
          ) {
            switch (i) {
              case 1:
              case 5:
                canvas.style.cursor = 'row-resize'
                break
              case 3:
              case 7:
                canvas.style.cursor = 'col-resize'
                break
              case 0:
                canvas.style.cursor = 'nw-resize'
                break
              case 2:
                canvas.style.cursor = 'ne-resize'
                break
              case 4:
                canvas.style.cursor = 'se-resize'
                break
              case 6:
                canvas.style.cursor = 'sw-resize'
                break
            }
            currentBox = i
            break
          }
          else if (currentBox >= 0) {
            canvas.style.cursor = ''
            currentBox = -1
          }
        }
      })
      .on('mouseup', function (event) {

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