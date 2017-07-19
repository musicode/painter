/**
 * @file 图形基类
 * @author musicode
 */
define(function () {

  class Shape {

    constructor(props) {
      Object.assign(this, props)
    }

    destroy() {

    }

    /**
     * 绘制图形
     *
     * @param {Painter} painter
     */
    draw(painter) {

      if (this.fillStyle) {
        this.fill(painter)
      }

      if (this.strokeThickness && this.strokeStyle) {
        this.stroke(painter)
      }

    }

    getRect() {

    }

  }

  return Shape

})