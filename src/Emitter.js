/**
 * @file 事件处理
 * @author musicode
 */
import array from './util/array'
import object from './util/object'
import constant from './constant'

import getDistance from './function/getDistance'

function getStyle(element, name) {
  return window.getComputedStyle(element, null).getPropertyValue(name)
}

export default class Emitter {

  constructor(canvas, container) {

    let me = this, canvasOffset = { }, containerOffset = { },
    realX, realY, cursorX, cursorY, pageX, pageY, inCanvas, isMouseDown, drawing

    me.canvas = canvas
    me.listeners = { }

    let getOffset = function (element, offset) {
      if (element && element.tagName) {
        offset.x += element.offsetLeft
        offset.y += element.offsetTop
        if (getStyle(element, 'position') !== 'fixed') {
          getOffset(element.offsetParent, offset)
        }
      }
    }

    let updateOffset = function () {

      canvasOffset.x =
      canvasOffset.y =
      containerOffset.x =
      containerOffset.y = 0

      getOffset(canvas, canvasOffset)

      if (container) {
        getOffset(container, containerOffset)
      }

    }

    let updateInCanvas = function (event) {
      let { target } = event
      if (target.tagName === 'CANVAS' && target === canvas) {
        inCanvas = true
      }
      else {
        // 如果有自定义光标，鼠标事件基本都落在了光标元素上
        // 这里没有什么好的方式判断自定义光标元素，所以约定 className 必须包含 cursor
        // svg 的 className 居然是个对象...
        let { className } = target
        if (typeof className === 'string'
          && className.indexOf('cursor') >= 0
        ) {
          // 如有多个 canvas，自定义光标必须带一个 canvasId，否则无法区分当前交互的是哪个 canvas
          let canvasId = target.getAttribute('canvas-id')
          inCanvas = canvasId ? canvasId === canvas.id : true
        }
        else {
          inCanvas = false
        }
      }
    }

    let updatePosition = function (event) {

      pageX = event.pageX
      pageY = event.pageY

      realX = pageX - canvasOffset.x
      realY = pageY - canvasOffset.y

      if (container) {
        realX += container.scrollLeft
        realY += container.scrollTop
      }

      cursorX = realX * constant.DEVICE_PIXEL_RATIO
      cursorY = realY * constant.DEVICE_PIXEL_RATIO

    }

    let updatePositionByTouchEvent = function (event) {
      let { touches } = event;
      if (touches) {
        updatePosition(touches[ 0 ])
      }
      else {
        updatePosition(event)
      }
    }

    let fireEvent = function (type, data) {
      if (drawing || inCanvas) {
        me.fire(type, data)
      }
    }

    updateOffset()

    let onMouseDown = function (event) {
      // 左键是 0，触摸屏没有 button 属性，因此取反就行
      if (!me.disabled && !event.button) {

        isMouseDown = true

        // 容错
        if (drawing) {
          onMouseUp()
          return
        }

        if (inCanvas) {
          drawing = true
          updateOffset()
        }

        updatePositionByTouchEvent(event)

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
      // 为手写板优化
      // 有些手写板，笔触漂浮时，会 mousemove mouseup 循环触发
      if (isMouseDown) {
        isMouseDown = false
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
        if (drawing) {
          drawing = false
        }
      }
    }

    let doc = typeof document !== 'undefined' ? document : null
    if (!doc) {
      return
    }

    let documentEvents = { }, canvasEvents = { }

    let addDocumentEvent = function (type, listener) {
      doc.addEventListener(type, listener)
      documentEvents[ type ] = listener
    }

    let addCanvasEvent = function (type, listener) {
      canvas.addEventListener(type, listener)
      canvasEvents[ type ] = listener
    }


    addDocumentEvent(
      'mousedown',
      onMouseDown
    )

    let maxDistance = 150 * constant.DEVICE_PIXEL_RATIO
    addDocumentEvent(
      'mousemove',
      function (event) {
        if (!me.disabled) {

          let oldX = cursorX, oldY = cursorY

          updateInCanvas(event)
          updatePosition(event)

          let distance = getDistance(oldX, oldY, cursorX, cursorY)
          // 需要上限是因为某些手写板，会突然冒出一个差距过大的坐标
          if (distance > 0 && distance < maxDistance) {
            fireEvent(
              Emitter.MOUSE_MOVE,
              {
                x: cursorX,
                y: cursorY,
                realX: realX,
                realY: realY,
                pageX: pageX,
                pageY: pageY,
                inCanvas: drawing ? true : inCanvas,
              }
            )
          }
        }
      }
    )

    addDocumentEvent(
      'mouseup',
      onMouseUp
    )

    if ('ontouchstart' in doc) {
      addDocumentEvent(
        'touchstart',
        onMouseDown
      )
      addDocumentEvent(
        'touchmove',
        function (event) {
          if (!me.disabled) {
            updateInCanvas(event)
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
                inCanvas: drawing ? true : inCanvas,
              }
            )
          }
        }
      )
      addDocumentEvent(
        'touchend',
        onMouseUp
      )
    }

    if (SHORTCUT) {
      addDocumentEvent(
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

    this.documentEvents = documentEvents
    this.canvasEvents = canvasEvents

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

  dispose() {
    let { canvas, documentEvents, canvasEvents } = this
    if (documentEvents) {
      object.each(
        documentEvents,
        function (listener, type) {
          document.removeEventListener(type, listener)
        }
      )
    }
    if (canvasEvents) {
      object.each(
        canvasEvents,
        function (listener, type) {
          canvas.removeEventListener(type, listener)
        }
      )
    }
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
  36: Emitter.CLEAR,
  46: Emitter.ACTIVE_SHAPE_DELETE
}

