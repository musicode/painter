/**
 * @file hex 转成 rgb
 * @author musicode
 */

export default function (hex) {

  var r = (hex >> 16) & 0xFF
  var g = (hex >> 8) & 0xFF
  var b = hex & 0xFF

  return 'rgb(' + r + ',' + g + ',' + b + ')'

}