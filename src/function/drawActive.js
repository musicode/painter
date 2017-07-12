/**
 * @file 绘制 active 效果
 * @author musicode
 */
define(function () {

  return function (shape, context) {

    const thickness = 1
    const size = 10

    context.lineWidth = thickness
    context.strokeStyle = '#E6E6E6'

    let rect = shape.getRect()

    context.beginPath()
    context.rect(rect.x, rect.y, rect.width, rect.height)
    context.stroke()

    let left = rect.x - size / 2
    let center = rect.x + (rect.width - size) / 2
    let right = rect.x + rect.width - size / 2

    let top = rect.y - size / 2
    let middle = rect.y + (rect.height - size) / 2
    let bottom = rect.y + rect.height - size / 2

    context.beginPath()
    context.strokeStyle = '#A2A2A2'
    context.fillStyle = '#EEE'

    context.rect(left, top, size, size)
    context.rect(center, top, size, size)
    context.rect(right, top, size, size)
    context.rect(right, middle, size, size)
    context.rect(right, bottom, size, size)
    context.rect(center, bottom, size, size)
    context.rect(left, bottom, size, size)
    context.rect(left, middle, size, size)


    context.stroke()
    context.fill()



  }

})