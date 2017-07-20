/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

  class Painter {

    constructor(context) {
      this.context = context
    }

    begin() {
      this.context.beginPath()
      this.isBegin = true
    }

    close() {
      this.context.closePath()
      this.isBegin = false
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
        const w = (width / 0.75) / 2, h = height / 2
        context.moveTo(x, y - h)
        context.bezierCurveTo(x + w, y - h, x + w, y + h, x, y + h)
        context.bezierCurveTo(x - w, y + h, x - w, y - h, x, y - h)
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

    isPointInPath(x, y) {
      return this.context.isPointInPath(x, y)
    }

    setLineWidth(value) {
      let { context } = this
      if (context.lineWidth !== value) {
        context.lineWidth = value
      }
    }

    setStrokeStyle(value) {
      let { context } = this
      if (context.strokeStyle !== value) {
        context.strokeStyle = value
      }
    }

    setFillStyle(value) {
      let { context } = this
      if (context.fillStyle !== value) {
        context.fillStyle = value
      }
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
      const { context } = this
      context.shadowColor = color
      context.shadowOffsetX = offsetX
      context.shadowOffsetY = offsetY
      context.shadowBlur = blur
    }

    disableShadow() {
      const { context } = this
      context.shadowColor =
      context.shadowOffsetX =
      context.shadowOffsetY =
      context.shadowBlur = 0
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

  }

  return Painter

})