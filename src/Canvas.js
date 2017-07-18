/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  const Selection = require('./states/Selection')
  const Active = require('./states/Active')
  const Hover = require('./states/Hover')

  const updateRect = require('./function/updateRect')
  const getInterRect = require('./function/getInterRect')
  const getUnionRect = require('./function/getUnionRect')
  const array = require('./util/array')

  const INDEX_ACTIVE = 0
  const INDEX_HOVER = 1
  const INDEX_SELECTION = 2

  const SHORTCUT = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    46: 'delete',
  }

  let { devicePixelRatio } = window
  if (devicePixelRatio > 2) {
    devicePixelRatio = 2
  }

  class Emitter {

    constructor(canvas) {

      this.listeners = { }

      let me = this, cursorX, cursorY

      let left = canvas.offsetLeft, top = canvas.offsetTop

      document.addEventListener(
        'mousedown',
        function () {
          if (!me.disabled) {
            me.fire(
              'mousedown',
              {
                x: cursorX,
                y: cursorY,
              }
            )
          }
        }
      )

      document.addEventListener(
        'mousemove',
        function (event) {
          if (!me.disabled) {
            cursorX = event.pageX - left
            cursorY = event.pageY - top
            if (devicePixelRatio > 1) {
              cursorX *= devicePixelRatio
              cursorY *= devicePixelRatio
            }
            me.fire(
              'mousemove',
              {
                x: cursorX,
                y: cursorY,
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
              'mouseup',
              {
                x: cursorX,
                y: cursorY,
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
        let index = list.indexOf(listener)
        if (index >= 0) {
          list.splice(index, 1)
        }
      }
      return this
    }

  }

  class Canvas {

    constructor(canvas) {

      const me = this

      me.canvas = canvas
      me.context = canvas.getContext('2d')
      me.resize(canvas.width, canvas.height)

      me.shapes = [ ]
      me.states = [ ]
      me.emitter = new Emitter(canvas)

      const { emitter, shapes, states } = me

      let updateSelection, updateRatios, mouseOffset

      emitter
      .on('mousedown', function (event) {

        let { hoverShape, activeShapes } = me
        if (hoverShape) {
          if (!hoverShape.state) {
            if (activeShapes) {
              array.each(
                activeShapes,
                function (shape) {
                  if (hoverShape === shape) {
                    hoverShape = null
                    return false
                  }
                }
              )
            }
            if (hoverShape && me.setActiveShapes([ hoverShape ])) {
              me.refresh()
            }
            mouseOffset = {
              x: event.x - states[ INDEX_ACTIVE ].x,
              y: event.y - states[ INDEX_ACTIVE ].y,
            }
            emitter.fire('updateStart')
          }
        }
        else {
          if (me.setActiveShapes(null)) {
            me.refresh()
          }
          updateSelection = updateRect(
            states[ INDEX_SELECTION ] = new Selection(event),
            event.x,
            event.y
          )
        }

      })
      .on('mousemove', function (event) {

        let { shapes } = me

        if (mouseOffset) {
          states[ INDEX_ACTIVE ].x = event.x - mouseOffset.x
          states[ INDEX_ACTIVE ].y = event.y - mouseOffset.y
          emitter.fire('updating')
          return
        }

        let selectionShape = states[ INDEX_SELECTION ]
        if (selectionShape) {
          updateSelection(event.x, event.y)
          me.setActiveShapes(
            shapes.filter(
              function (shape) {
                if (getInterRect(shape.getRect(), selectionShape)) {
                  return true
                }
              }
            )
          )
          me.refresh()
          return
        }

        let hoverShape
        array.each(
          [ states, shapes ],
          function (list) {
            array.each(
              list,
              function (shape) {
                if (shape && shape.isPointInPath(context, event.x, event.y) !== false) {
                  hoverShape = shape
                  return false
                }
              },
              true
            )
            if (hoverShape) {
              return false
            }
          }
        )

        if (me.setHoverShape(hoverShape)) {
          me.refresh()
        }

      })
      .on('mouseup', function () {
        if (mouseOffset) {
          mouseOffset = null
        }
        if (states[ INDEX_SELECTION ]) {
          states[ INDEX_SELECTION ] = null
          me.refresh()
        }
      })
      .on('updateStart', function () {
        let state = states[ INDEX_ACTIVE ]
        updateRatios = me.activeShapes.map(
          function (shape) {
            return {
              x: (shape.x - state.x) / state.width,
              y: (shape.y - state.y) / state.height,
              width: shape.width / state.width,
              height: shape.height / state.height,
            }
          }
        )
      })
      .on('updateEnd', function () {
        updateRatios = null
      })
      .on('updating', function () {
        let { x, y, width, height } = states[ INDEX_ACTIVE ]
        array.each(
          me.activeShapes,
          function (shape, i) {
            shape.x = x + width * updateRatios[ i ].x
            shape.y = y + height * updateRatios[ i ].y
            shape.width = width * updateRatios[ i ].width
            shape.height = height * updateRatios[ i ].height
          }
        )
        me.refresh()
      })
      .on('left', function () {

      })
      .on('up', function () {

      })
      .on('right', function () {

      })
      .on('down', function () {

      })
      .on('canvasEdit', function (event) {
        event.action(canvas)
      })
    }

    /**
     * 调整画布大小
     *
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {

      if (devicePixelRatio > 1) {
        width *= devicePixelRatio
        height *= devicePixelRatio
      }

      this.canvas.width = Math.floor(width)
      this.canvas.height = Math.floor(height)

    }

    /**
     * 添加图形
     *
     * @param {Shape} shape
     */
    addShape(shape) {
      shape.draw(this.context)
      this.shapes.push(shape)
    }

    /**
     * 全量刷新画布
     */
    refresh() {

      const { context, canvas, shapes, states, activeShapes } = this

      context.clearRect(0, 0, canvas.width, canvas.height)

      const drawShape = function (shape) {
        if (shape) {
          shape.draw(context)
        }
      }

      array.each(shapes, drawShape)

      // 当选中的图形数量大于 1 时
      // 每个图形都需要矩形描边（参考 Sketch）
      if (activeShapes && activeShapes.length > 1) {
        context.lineWidth = 1
        context.strokeStyle = '#C0CED8'
        array.each(
          activeShapes,
          function (shape) {
            let rect = shape.getRect()
            context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height)
          }
        )
      }

      // 确保最后绘制状态层
      // 这样才能位于最高层
      array.each(states, drawShape)

    }

    /**
     * 清空画布
     */
    clear() {
      let { context, canvas, shapes } = this
      shapes.length = 0
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    /**
     * 设置 hover 状态的图形，同一时刻最多只能 hover 一个图形
     *
     * @param {Shape} shape
     * @return {boolean} 是否需要刷新画布
     */
    setHoverShape(shape, silent) {
      let { hoverShape, activeShapes, states } = this
      if (shape != hoverShape) {
        this.hoverShape = shape

        let needClear = states[ INDEX_HOVER ], isValid = shape && !shape.state

        // 如果清除上一次的 hover 图形，则一定要刷新画布
        if (needClear) {
          states[ INDEX_HOVER ].destroy()
          states[ INDEX_HOVER ] = null
        }

        // 如果新的 hover 图形是有效的，则需要刷新画布
        if (isValid) {
          if (activeShapes) {
            array.each(
              activeShapes,
              function (activeShape) {
                if (shape === activeShape) {
                  return isValid = false
                }
              }
            )
          }
          if (isValid) {
            states[ INDEX_HOVER ] = new Hover({ shape })
          }
        }

        return needClear || isValid
      }
    }

    /**
     * 设置选中状态的图形，可以多选
     *
     * @param {Array.<Shape>} shapes
     * @return {boolean} 是否需要刷新画布
     */
    setActiveShapes(shapes) {
      let { hoverShape, activeShapes, states } = this
      if (shapes != activeShapes) {

        let length, hasHoverShape

        if (shapes) {
          length = shapes.length

          // 两个数组的数组项完全相同则认为相同
          let isSame = activeShapes && length === activeShapes.length, i = 0
          while (i < length) {
            if (shapes[ i ] === hoverShape) {
              hasHoverShape = true
            }
            if (isSame && shapes[ i ] !== activeShapes[ i ]) {
              break
            }
            i++
          }
          if (isSame && i === length) {
            return
          }
        }

        // 如果选中的图形恰好处于 hover 状态
        // 需要先清除 hover 状态
        if (hasHoverShape) {
          this.setHoverShape(null)
        }

        this.activeShapes = shapes

        if (states[ INDEX_ACTIVE ]) {
          states[ INDEX_ACTIVE ].destroy()
          states[ INDEX_ACTIVE ] = null
        }

        if (length > 0) {
          states[ INDEX_ACTIVE ] = new Active(
            getUnionRect(shapes),
            this.emitter
          )
        }

        return true
      }
    }

  }

  return Canvas

})