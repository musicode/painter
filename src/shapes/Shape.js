/**
 * @file 图形基类
 * @author musicode
 */
define(function () {

  class Shape {

    hover(context) {
      if (!this.oldFillStyle) {
        this.oldFillStyle = this.fillStyle
        this.fill(context, 'blue')
      }
    }

    unhover(context) {
      if (this.oldFillStyle) {
        this.fill(context, this.oldFillStyle)
        delete this.oldFillStyle
      }
    }

  }

  return Shape

})