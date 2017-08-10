/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

  const array = require('./util/array')

  class Painter {

    constructor(context) {
      this.context = context
    }

    getCanvasSize() {
      const { width, height } = this.context.canvas
      return {
        width: width,
        height: height
      }
    }
  
    begin() {
      this.context.beginPath()
    }

    close() {
      this.context.closePath()
    }

    drawRect(x, y, width, height) {
      this.context.rect(x, y, width, height)
    }

    drawOval(x, y, width, height) {
      let { context } = this
      if (width === height) {
        const radius = width / 2
        context.moveTo(x + radius, y)
        context.arc(x, y, radius, 0, 2 * Math.PI, true)
      }
      else {
        let { context } = this
        if (width === height) {
          const radius = width / 2
          context.moveTo(x + radius, y)
          context.arc(x, y, radius, 0, 2 * Math.PI, true)
        }
        else {
          const w = (width / 0.75) / 2, h = height / 2
          const points = [
              {
                'x': x,
                'y': y - h
              },

              {
                'x': x + w,
                'y': y - h
              },

              {
                'x': x + w,
                'y': y + h
              },

              {
                'x': x,
                'y': y + h
              },

              {
                'x': x - w,
                'y': y + h
              },

              {
                'x': x - w,
                'y': y - h
              }
          ];
          context.moveTo(points[0].x, points[0].y)
          context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y)
          context.bezierCurveTo(points[4].x, points[4].y, points[5].x, points[5].y, points[0].x, points[0].y)
        }
        const w = (width / 0.75) / 2, h = height / 2
        context.moveTo(x, y - h)
        context.bezierCurveTo(x + w, y - h, x + w, y + h, x, y + h)
        context.bezierCurveTo(x - w, y + h, x - w, y - h, x, y - h)
      }
    }

    drawPoints(points) {
      const { length } = points
      if (length > 1) {
        let point = points[0]
        this.moveTo(point.x, point.y)
        for (let i = 1; i < length; i++) {
          point = points[i]
          this.lineTo(point.x, point.y)
        }
      }
    }

    stroke() {
      this.context.stroke()
    }

    fill() {
      this.context.fill()
    }

    strokeRect(x, y, width, height) {
      this.context.strokeRect(x, y, width, height)
    }

    fillRect(x, y, width, height) {
      this.context.fillRect(x, y, width, height)
    }

    strokeText(x, y, text) {
      this.context.strokeText(text, x, y)
    }

    fillText(x, y, text) {
      this.context.fillText(text, x, y)
    }

    measureText(text) {
      return this.context.measureText(text)
    }
    isPointInPath(x, y) {
      return this.context.isPointInPath(x, y)
    }

    clear() {
      let { context } = this
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    }

    moveTo(x, y) {
      this.context.moveTo(x, y)
    }

    lineTo(x, y) {
      this.context.lineTo(x, y)
    }

    arc(x, y, radius, startAngle, endAngle, CCW) {
      this.context.arc(x, y, radius, startAngle, endAngle, CCW)
    }

    bezierCurveTo(x1, y1, x2, y2, x, y) {
      this.context.bezierCurveTo(x1, y1, x2, y2, x, y)
    }

    createLinearGradient(x1, y1, x2, y2) {
      return this.context.createLinearGradient(x1, y1, x2, y2)
    }

    enableShadow(offsetX, offsetY, blur, color) {
      this.setShadowColor(color)
      this.setShadowOffsetX(offsetX)
      this.setShadowOffsetY(offsetY)
      this.setShadowBlur(blur)
    }

    disableShadow() {
      this.setShadowColor(0)
      this.setShadowOffsetX(0)
      this.setShadowOffsetY(0)
      this.setShadowBlur(0)
    }

    save() {
      const { context } = this
      const { width, height } = context.canvas
      if (context.getImageData && width > 0 && height > 0) {
        return context.getImageData(0, 0, width, height)
      }
    }

    restore(data) {
      const { context } = this
      if (context.putImageData && data) {
        context.putImageData(data, 0, 0)
      }
    }

    setFont(fontSize, fontFamily) {
      this.context.font = fontSize + 'px ' + fontFamily
    }
  }

  const { prototype } = Painter

  array.each(
    [
      'lineWidth', 'lineJoin', 'lineCap',
      'strokeStyle', 'fillStyle',
      'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur'
    ],
    function (name) {
      prototype[ 'set' + name.charAt(0).toUpperCase() + name.slice(1) ] = function (value) {
        let { context } = this
        if (context[ name ] !== value) {
          context[ name ] = value
        }
      }
    }
  )

  return Painter

})