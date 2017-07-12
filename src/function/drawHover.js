/**
 * @file 绘制 hover 效果
 * @author musicode
 */
define(function () {

  return function (shape, context) {

    const thickness = 4

    context.lineWidth = thickness
    context.strokeStyle = '#45C0FF'

    let rect = shape.getRect()
    console.log(rect)
    context.beginPath()
    context.rect(rect.x - thickness * 0.5, rect.y - thickness * 0.5, rect.width + thickness, rect.height + thickness)
    context.stroke()

  }

})