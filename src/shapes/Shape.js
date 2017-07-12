/**
 * @file 图形基类
 * @author musicode
 */
define(function () {

  class Shape {

    getRect() {
      throw new Error('please implements getRect method.')
    }

  }

  return Shape

})