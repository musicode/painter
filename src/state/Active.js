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

      let me = this

      emitter
      .on('mousedown', function (event) {

      })
      .on('mousemove', function (event) {
        for (let i = 0, len = me.boxes.length, box; i < len; i++) {
          box = me.boxes[ i ]
          if (event.x > box[ 0 ]
            && event.x <= box[ 0 ] + thumbSize
            && event.y > box[ 1 ]
            && event.y <= box[ 1 ] + thumbSize
          ) {
            canvas.setAttribute('data-drag', i)
            break
          }
          else {
            canvas.removeAttribute('data-drag')
          }
        }
      })
      .on('mouseup', function (event) {

      })
    }

    draw(context) {

      const { x, y, width, height } = this

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

      this.boxes = [
        [ left, top ],
        [ center, top ],
        [ right, top ],
        [ right, middle ],
        [ right, bottom ],
        [ center, bottom ],
        [ left, bottom ],
        [ left, middle ],
      ]

      this.boxes.forEach(
        function (box) {
          const gradient = context.createLinearGradient(box[ 0 ], box[ 1 ] + thumbSize, box[ 0 ], box[ 1 ])
          gradient.addColorStop(0, '#ddd')
          gradient.addColorStop(1, '#f9f9f9')
          context.beginPath()
          context.fillStyle = gradient
          context.rect(box[ 0 ], box[ 1 ], thumbSize, thumbSize)
          context.stroke()
          context.fill()
        }
      )

      context.shadowColor =
      context.shadowOffsetX =
      context.shadowOffsetY =
      context.shadowBlur = 0

    }

  }

  return Active

})