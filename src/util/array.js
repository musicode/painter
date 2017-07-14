/**
 * @file 数组操作
 * @author musicode
 */
define(function (require, exports, module) {

  return {
    each(array, callback) {
      let { length } = array
      if (length) {
        for (let i = 0; i < length; i++) {
          if (callback(array[ i ], i) === false) {
            break
          }
        }
      }
    }
  }

})