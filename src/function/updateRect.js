/**
 * @file 创建矩形，这是一个工厂函数，需传入起始点坐标
 * @author musicode
 */
export default function (rect, startX, startY) {
  return function (endX, endY) {
    if (startX < endX) {
      rect.x = startX
      rect.width = endX - startX
    }
    else {
      rect.x = endX
      rect.width = startX - endX
    }
    if (startY < endY) {
      rect.y = startY
      rect.height = endY - startY
    }
    else {
      rect.y = endY
      rect.height = startY - endY
    }
  }
}