/**
 * @file 旋转后的点
 * @author musicode
 */
export default function (x, y, radian, points) {
  return points.map(
    function (point) {
      return {
        x: Math.floor((point.x - x) * Math.cos(radian) - (point.y - y) * Math.sin(radian) + x),
        y: Math.floor((point.x - x) * Math.sin(radian) + (point.y - y) * Math.cos(radian) + y),
      }
    }
  )
}