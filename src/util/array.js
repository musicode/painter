/**
 * @file 数组操作
 * @author musicode
 */

function each(array, callback, reversed) {
  let { length } = array
  if (length) {
    if (reversed) {
      for (let i = length - 1; i >= 0; i--) {
        if (callback(array[ i ], i) === false) {
          break
        }
      }
    }
    else {
      for (let i = 0; i < length; i++) {
        if (callback(array[ i ], i) === false) {
          break
        }
      }
    }
  }
}

function push(array, item) {
  array.push(item)
}

function pop(array) {
  array.pop()
}

function remove(array, item) {
  let index = array.indexOf(item)
  if (index >= 0) {
    array.splice(index, 1)
    return true
  }
}

function last(array) {
  return array[ array.length - 1 ]
}

function has(array, item) {
  return array.indexOf(item) >= 0
}

export default {
  each,
  push,
  pop,
  remove,
  last,
  has,
}

