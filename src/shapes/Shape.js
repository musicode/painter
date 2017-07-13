/**
 * @file 图形基类
 * @author musicode
 */
define(function () {

  class Shape {

    constructor(props) {
      Object.assign(this, props)
    }

    getRect() {
      throw new Error('please implements getRect method.')
    }

  }

  return Shape

})