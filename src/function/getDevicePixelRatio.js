/**
 * @file 获取 dpr
 * @author musicode
 */
export default function () {
  let { devicePixelRatio } = window
  if (devicePixelRatio > 2) {
    devicePixelRatio = 2
  }
  return devicePixelRatio || 1
}