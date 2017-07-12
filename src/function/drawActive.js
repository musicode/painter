/**
 * @file 绘制 active 效果
 * @author musicode
 */
define(function () {

  function drawThumb(context, left, top, size) {
    let gradient = context.createLinearGradient(left, top + size, left, top)
    gradient.addColorStop(0, '#ddd')
    gradient.addColorStop(1, '#f9f9f9')
    context.beginPath()
    context.fillStyle = gradient
    context.strokeStyle = '#A2A2A2'
    context.rect(left, top, size, size)
    context.stroke()
    context.fill()
  }

  return function (shape, context) {

    const thumbSize = 12

    context.lineWidth = 1
    context.strokeStyle = '#DDD'

    let { x, y, width, height } = shape.getRect()

    // 矩形线框
    context.beginPath()
    context.rect(x, y, width, height)
    context.stroke()

    let left = x - thumbSize / 2
    let center = x + (width - thumbSize) / 2
    let right = x + width - thumbSize / 2

    let top = y - thumbSize / 2
    let middle = y + (height - thumbSize) / 2
    let bottom = y + height - thumbSize / 2

    // 周围的 8 个方块
    drawThumb(context, left, top, thumbSize)
    drawThumb(context, center, top, thumbSize)
    drawThumb(context, right, top, thumbSize)
    drawThumb(context, right, middle, thumbSize)
    drawThumb(context, right, bottom, thumbSize)
    drawThumb(context, center, bottom, thumbSize)
    drawThumb(context, left, bottom, thumbSize)
    drawThumb(context, left, middle, thumbSize)

  }

})