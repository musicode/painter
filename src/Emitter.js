/**
 * @file 事件处理
 * @author musicode
 */
define(function (require, exports, module) {

  const array = require('./util/array')

  class Emitter {

    constructor(canvas) {

      this.listeners = { }

      let me = this, cursorX, cursorY, inCanvas

      document.addEventListener(
        'mousedown',
        function () {
          if (!me.disabled) {
            me.fire(
              Emitter.MOUSE_DOWN,
              {
                x: cursorX,
                y: cursorY,
                inCanvas,
              }
            )
          }
        }
      )

      document.addEventListener(
        'mousemove',
        function (event) {
          if (!me.disabled) {

            const { pageX, pageY } = event

            cursorX = pageX - canvas.offsetLeft
            cursorY = pageY - canvas.offsetTop

            if (devicePixelRatio > 1) {
              cursorX *= devicePixelRatio
              cursorY *= devicePixelRatio
            }

            inCanvas = cursorX >= 0
              && cursorX <= canvas.width
              && cursorY >= 0
              && cursorY <= canvas.height

            me.fire(
              Emitter.MOUSE_MOVE,
              {
                x: cursorX,
                y: cursorY,
                inCanvas,
              }
            )
          }
        }
      )

      document.addEventListener(
        'mouseup',
        function () {
          if (!me.disabled) {
            me.fire(
              Emitter.MOUSE_UP,
              {
                x: cursorX,
                y: cursorY,
                inCanvas
              }
            )
          }
        }
      )

      if (SHORTCUT) {
        document.addEventListener(
          'keyup',
          function (event) {
            if (!me.disabled) {
              let name = SHORTCUT[ event.keyCode ]
              if (name) {
                me.fire(name)
              }
            }
          }
        )
      }

    }

    fire(type, data) {
      let list = this.listeners[ type ]
      if (list) {
        array.each(
          list,
          function (handler) {
            if (handler) {
              return handler(data)
            }
          }
        )
      }
    }

    on(type, listener) {
      let list = this.listeners[ type ] || (this.listeners[ type ] = [ ])
      list.push(listener)
      return this
    }

    off(type, listener) {
      let list = this.listeners[ type ]
      if (list) {
        array.remove(list, listener)
      }
      return this
    }

  }

  Emitter.REFRESH = 'refresh'

  Emitter.CLEAR = 'clear'

  Emitter.MOUSE_DOWN = 'mouse_down'

  Emitter.MOUSE_MOVE = 'mouse_move'

  Emitter.MOUSE_UP = 'mouse_up'

  Emitter.CANVAS_DECO = 'canvas_deco'

  Emitter.SHAPE_ENTER = 'shape_enter'

  Emitter.SHAPE_LEAVE = 'shape_leave'

  Emitter.HOVER_SHAPE_CHANGE = 'hover_shape_change'

  Emitter.ACTIVE_SHAPE_CHANGE = 'active_shape_change'

  Emitter.ACTIVE_SHAPE_DELETE = 'active_shape_delete'

  Emitter.ACTIVE_RECT_CHANGE = 'active_rect_change'

  Emitter.SELECTION_RECT_CHANGE = 'selection_rect_change'

  Emitter.SELECTION_START = 'selection_start'

  Emitter.SELECTION_END = 'selection_end'

  Emitter.DRAWING_START = 'drawing_start'

  Emitter.DRAWING_END = 'drawing_end'

  const SHORTCUT = {
    8: Emitter.ACTIVE_SHAPE_DELETE,
    46: Emitter.ACTIVE_SHAPE_DELETE,
  }

  return Emitter

})