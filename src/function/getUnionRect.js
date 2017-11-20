/**
 * @file 多个矩形的并集
 * @author musicode
 */
export default function (rects) {

  let { length } = rects
  if (!length) {
    throw new Error(`getUnionRect rects array length have to be large than 1.`)
  }

  let rect = rects[ 0 ]
  let left = rect.x
  let top = rect.y
  let right = left + rect.width
  let bottom = top + rect.height

  for (let i = 1; i < length; i++) {
    rect = rects[ i ]
    if (rect.x < left) {
      left = rect.x
    }
    if (rect.y < top) {
      top = rect.y
    }
    if (rect.x + rect.width > right) {
      right = rect.x + rect.width
    }
    if (rect.y + rect.height > bottom) {
      bottom = rect.y + rect.height
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}
