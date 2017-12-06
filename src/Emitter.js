/**
 * @file 事件处理
 * @author musicode
 */
import array from './util/array'
import constant from './constant'

export default class Emitter {

  constructor(canvas, container) {

    this.listeners = { }

    let me = this, offsetX = 0, offsetY = 0, realX, realY, cursorX, cursorY, pageX, pageY, inCanvas

    let getOffset = function (element) {
      if (element && element.tagName) {
        offsetX += element.offsetLeft
        offsetY += element.offsetTop
        getOffset(element.parentNode)
      }
    }

    if (container) {
      getOffset(container)
    }
    else {
      getOffset(canvas)
    }

    let updatePosition = function (event) {

      realX = pageX - offsetX
      realY = pageY - offsetY

      if (container) {
        realX += container.scrollLeft
        realY += container.scrollTop
      }

      cursorX = realX * constant.DEVICE_PIXEL_RATIO
      cursorY = realY * constant.DEVICE_PIXEL_RATIO

      let { target } = event
      if (target.tagName === 'CANVAS') {
        if (target !== canvas) {
          inCanvas = false
          return
        }
      }
      else {
        inCanvas == false
        return
      }

      inCanvas = true

    }

    let updatePositionByTouchEvent = function (event) {
      let { touches } = event;
      if (touches) {
        pageX = touches[ 0 ].pageX
        pageY = touches[ 0 ].pageY
        updatePosition(event)
        return true
      }
    }

    let fireEvent = function (type, data) {
      if (inCanvas) {
        me.fire(type, data)
      }
      else {
        // 给外部按钮一些优先执行的机会
        setTimeout(
          function () {
            me.fire(type, data)
          },
          200
        )
      }
    }

    let onMouseDown = function (event) {
      if (!me.disabled) {
        if (!updatePositionByTouchEvent(event)) {
          updatePosition(event)
        }

        fireEvent(
          Emitter.MOUSE_DOWN,
          {
            x: cursorX,
            y: cursorY,
            realX: realX,
            realY: realY,
            pageX: pageX,
            pageY: pageY,
            target: event.target,
            inCanvas,
          }
        )
      }
    }

    let onMouseUp = function () {
      if (!me.disabled) {
        fireEvent(
          Emitter.MOUSE_UP,
          {
            x: cursorX,
            y: cursorY,
            realX: realX,
            realY: realY,
            pageX: pageX,
            pageY: pageY,
            inCanvas
          }
        )
      }
    }

    document.addEventListener(
      'mousedown',
      onMouseDown
    )

    document.addEventListener(
      'mousemove',
      function (event) {
        if (!me.disabled) {
          pageX = event.pageX
          pageY = event.pageY
          updatePosition(event)

          fireEvent(
            Emitter.MOUSE_MOVE,
            {
              x: cursorX,
              y: cursorY,
              realX: realX,
              realY: realY,
              pageX: pageX,
              pageY: pageY,
              inCanvas,
            }
          )
        }
      }
    )

    document.addEventListener(
      'mouseup',
      onMouseUp
    )

    if ('ontouchstart' in document) {
      document.addEventListener(
        'touchstart',
        onMouseDown
      )
      document.addEventListener(
        'touchmove',
        function (event) {
          if (!me.disabled) {
            updatePositionByTouchEvent(event)
            fireEvent(
              Emitter.MOUSE_MOVE,
              {
                x: cursorX,
                y: cursorY,
                realX: realX,
                realY: realY,
                pageX: pageX,
                pageY: pageY,
                inCanvas,
              }
            )
          }
        }
      )
      canvas.addEventListener(
        'touchmove',
        function (event) {
          if (!me.disabled) {
            updatePositionByTouchEvent(event)
            fireEvent(
              Emitter.MOUSE_MOVE,
              {
                x: cursorX,
                y: cursorY,
                pageX: pageX,
                pageY: pageY,
                inCanvas,
              }
            )
            // 在 canvas 画画时禁止页面滚动
            event.preventDefault()
            event.stopPropagation()
          }
        }
      )
      document.addEventListener(
        'touchend',
        onMouseUp
      )
    }

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

  on(type, listener, preferred) {
    let list = this.listeners[ type ] || (this.listeners[ type ] = [ ])
    if (preferred) {
      list.unshift(listener)
    }
    else {
      list.push(listener)
    }
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

Emitter.RESET = 'reset'

Emitter.CLEAR = 'clear'

Emitter.MOUSE_DOWN = 'mouse_down'

Emitter.MOUSE_MOVE = 'mouse_move'

Emitter.MOUSE_UP = 'mouse_up'

Emitter.SHAPE_ENTER = 'shape_enter'

Emitter.SHAPE_LEAVE = 'shape_leave'

Emitter.HOVER_SHAPE_CHANGE = 'hover_shape_change'

Emitter.ACTIVE_SHAPE_CHANGE = 'active_shape_change'

Emitter.ACTIVE_SHAPE_DELETE = 'active_shape_delete'

Emitter.ACTIVE_SHAPE_ENTER = 'active_shape_enter'

Emitter.ACTIVE_RECT_CHANGE_START = 'active_rect_change_start'

Emitter.ACTIVE_RECT_CHANGE_END = 'active_rect_change_end'

Emitter.ACTIVE_DRAG_BOX_HOVER = 'active_drag_box_hover'

Emitter.SELECTION_RECT_CHANGE = 'selection_rect_change'

Emitter.SELECTION_START = 'selection_start'

Emitter.SELECTION_END = 'selection_end'

Emitter.SHAPE_DRAWING_START = 'shape_drawing_start'

Emitter.SHAPE_DRAWING = 'shape_drawing'

Emitter.SHAPE_DRAWING_END = 'shape_drawing_end'

Emitter.SHAPE_ADD = 'shape_add'

Emitter.SHAPE_REMOVE = 'shape_remove'

Emitter.SHAPE_UPDATE = 'shape_update'

const SHORTCUT = {
  8: Emitter.ACTIVE_SHAPE_DELETE,
  13: Emitter.ACTIVE_SHAPE_ENTER,
  46: Emitter.ACTIVE_SHAPE_DELETE
}

