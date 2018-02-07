/**
 * @file 常量
 * @author musicode
 */
let devicePixelRatio = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1

export default {
  DEVICE_PIXEL_RATIO: devicePixelRatio,
  STROKE_POSITION_INSIDE: 1,
  STROKE_POSITION_CENTER: 2,
  STROKE_POSITION_OUTSIDE: 3,

  SIZE_MIN: devicePixelRatio * 6,
}

