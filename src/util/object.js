
import array from './array'

/**
 * 遍历对象
 *
 * @param {Object} object
 * @param {Function} callback 返回 false 可停止遍历
 */
function each(object, callback) {
  array.each(
    Object.keys(object),
    function (key) {
      return callback(object[ key ], key)
    }
  )
}

/**
 * 拷贝对象
 *
 * @param {*} object
 * @param {?boolean} deep 是否需要深拷贝
 * @return {*}
 */
function copy(object, deep) {
  let result = object
  if (Array.isArray(object)) {
    result = [ ]
    array.each(
      object,
      function (item, index) {
        result[ index ] = deep ? copy(item, deep) : item
      }
    )
  }
  else if (object && typeof object === 'object') {
    result = { }
    each(
      object,
      function (value, key) {
        result[ key ] = deep ? copy(value, deep) : value
      }
    )
  }
  return result
}

/**
 * 扩展对象
 *
 * @param {Object} source
 * @param {Object} target
 * @return {Object}
 */
function extend(source, target) {
  if (target) {
    each(
      target,
      function (value, key) {
        source[ key ] = value
      }
    )
  }
  return source
}

export default {
  each,
  copy,
  extend,
}


