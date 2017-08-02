/**
 * @file 文字
 * @author wangtianhua
 */
define(function (require) {

  const Shape = require('./Shape')
  const containRect = require('../contain/rect')

  let textArea = null

  const TRANSPARENT = 'rgba(0,0,0,0)'
  const CURSOR_COLOR = 'rgba(0,0,0,1)'

  class Text extends Shape {

    constructor (painter, x, y) {

      super()

      let me = this
      // me.text = ''
      // me.left = x
      // me.top = y
      // me.caret = 0
      // me.context = painter.context
      // me.font = '12px sans-serif'

      me.drawing = function (painter, x, y) {

        me.context = painter.context
        me.font = me.context.font
        me.fillStyle = me.context.fillStyle
        me.strokeStyle = me.context.strokeStyle

        me.createTextArea(painter, x, y)
      }

      me.createTextArea = function (painter, x, y) {
        let canvas = $(me.context.canvas)
        me.container = canvas.parent()
        if (!textArea) {
          textArea = $('<textarea></textarea>')
          textArea.css({
            position: 'absolute',
            left: me.left,
            top: me.top,
            color: TRANSPARENT,
            caretColor: CURSOR_COLOR,
            margin: '-14px -3px',
            backgroundColor: TRANSPARENT,
            font: me.context.font
          })
          textArea.attr({
            'autofocus': true
          })
          textArea.insertAfter(canvas)
          let locked = false

          textArea[0].addEventListener('input', function (e){
            console.log('start english' + textArea.value);
            if (locked) {
              return
            }
            me.computedEnd(e)
          })

          textArea[0].addEventListener('compositionstart', function (e) {
            console.log("start:" + e.data)
            locked = true
          })

          textArea[0].addEventListener('compositionend', function (e) {
              locked = false
              me.computedEnd(e)
          })
        }
        else {
          me.container.remove('textarea')
        }
      }

      me.computedEnd = function (e) {

        me.context.save()
        me.insert(e.data)

        me.draw(me.context)
        me.context.restore()

      }

      me.getWidth = function () {
        return context.measureText(text).width
      }

      me.insert = function (text) {
        me.text = me.text.substr(0, me.caret) + text + me.text.substr(me.caret)
        me.caret += text.length
      }

      me.getHeight = function () {
        let height = context.measureText('W').width
        return height + height / 6
      }

      me.draw = function () {
        me.context.save()

        me.context.textAlign = 'start'
        me.context.textBaseLine = 'bottom'

        me.context.strokeText(me.text, me.left, me.top)
        me.context.fillText(me.text, me.left, me.top)

        me.context.restore()

      }

      me.removeCharacterBeforeCaret = function () {
        if (caret == 0) {
          return;
        }
        text = text.substring(0, caret - 1) + text.substring(caret)
        caret--;
      }

      me.erase = function () {

      }

    }

    startDrawing (painter, x, y) {
      console.log(x + ',' + y)
    }

    endDrawing () {

        console.log('end')
    }

  }

  return Text

})