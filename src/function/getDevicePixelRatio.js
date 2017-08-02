/**
 * @file 获取 dpr
 * @author musicode
 */
define(function () {

  return function () {
    let { devicePixelRatio } = window
    if (devicePixelRatio > 2) {
      devicePixelRatio = 2
    }
    return devicePixelRatio
  }

})