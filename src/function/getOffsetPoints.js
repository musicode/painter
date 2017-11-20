/**
 * @file 偏移点坐标，用于实现内外描边
 * @author musicode
 */
import array from '../util/array'

export default function (points, offset) {

  let result = [ ], { length } = points

  // 前一个点
  let px = points[ length - 1 ].x, py = points[ length - 1 ].y
  for (let i = 0; i < length; i++) {
    let { x, y } = points[ i ]

    let next = (i + 1) % length

    // 后一个点
    let nx = points[ next ].x, ny = points[ next ].y

    let dx0 = x - px, dy0 = y - py

    // 求单位向量
    let l = Math.sqrt(dx0 * dx0 + dy0 * dy0)
    dx0 /= l
    dy0 /= l

    let dx1 = x - nx, dy1 = y - ny

    // 求单位向量
    l = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    dx1 /= l
    dy1 /= l

    // 相加两个向量计算出顶点需要移动的位置
    let moveX = dx0 + dx1, moveY = dy0 + dy1

    // 求单位向量
    l = Math.sqrt(moveX * moveX + moveY * moveY)
    moveX /= l
    moveY /= l

    // 点乘得到拐角的 cos 值
    let cosTheta = dx0 * moveX + dy0 * moveY, sinTheta = Math.sqrt(1 - cosTheta * cosTheta)

    array.push(
      result,
      {
        x: x + offset * moveX / sinTheta,
        y: y + offset * moveY / sinTheta,
      }
    )

    px = x
    py = y

  }

  return result

}