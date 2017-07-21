/**
 * @file 图形基类
 * @author musicode
 */
define(function () {

  class Shape {

    constructor(props) {
      Object.assign(this, props)
    }

    /**
     * 绘制图形
     *
     * @param {Painter} painter
     */
    draw(painter) {



      const needFill = this.fillStyle && this.fill
      const needStroke = this.strokeThickness && this.strokeStyle && this.stroke

      if (needFill || needStroke) {

        if (needFill) {
          if (!needStroke) {
            this.applyShadow(painter)
          }
          this.fill(painter)
        }

        if (needStroke) {
          this.applyShadow(painter)
          this.stroke(painter)
        }

      }


    }

    applyShadow(painter) {
      if (this.shadowColor) {
        painter.enableShadow(
          this.shadowOffsetX,
          this.shadowOffsetY,
          this.shadowBlur,
          this.shadowColor
        )
      }
      else {
        painter.disableShadow()
      }
    }

    validate() {
      return true
    }

    getRect() {

    }

  }

  return Shape

})