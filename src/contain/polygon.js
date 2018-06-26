
import windingLine from './windingLine'

let EPSILON = 1e-8

function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON
}

export default function (points, x, y) {
    let w = 0, p = points[0]

    if (!p) {
      return false
    }

    for (let i = 1, p1; i < points.length; i++) {
      p1 = points[i]
      w += windingLine(p.x, p.y, p1.x, p1.y, x, y)
      p = p1
    }

    // Close polygon
    let p0 = points[0]
    if (!isAroundEqual(p.x, p0.x) || !isAroundEqual(p.y, p0.y)) {
      w += windingLine(p.x, p.y, p0.x, p0.y, x, y)
    }

    return w !== 0
}
