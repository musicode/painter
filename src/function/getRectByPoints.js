/**
 * @file 多个矩形的并集
 * @author musicode
 */
export default function (points) {

  let { length } = points, startX = 0, startY = 0, endX = 0, endY = 0

  if (length > 0) {

    let point = points[0]
    startX = endX = point.x
    startY = endY = point.y

    for (let i = 1; i < length; i++) {
      point = points[i]
      if (point.x < startX) {
        startX = point.x
      }
      else if (point.x > endX) {
        endX = point.x
      }
      if (point.y < startY) {
        startY = point.y
      }
      else if (point.y > endY) {
        endY = point.y
      }
    }
  }

  return {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
  }
}
