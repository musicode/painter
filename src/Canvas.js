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

  let { devicePixelRatio } = window
  if (devicePixelRatio > 2) {
    devicePixelRatio = 2
  }

  class Emitter {

    constructor(canvas) {

      this.listeners = { }

      let rect = canvas.getBoundingClientRect()
      let me = this, cursorX, cursorY

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
            cursorX = event.pageX - rect.left
            cursorY = event.pageY - rect.top
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

    }

    enable() {
      this.disabled = false
    }

    disable() {
      this.disabled = true
    }

    fire(type, data) {
      let { listeners } = this
      let list = listeners[ type ]
      if (list) {
        for (let i = 0, len = list.length, handler; i < len; i++) {
          handler = list[ i ]
          if (handler && handler(data) === false) {
            break
          }
        }
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

      let me = this

      me.canvas = canvas
      me.context = canvas.getContext('2d')
      me.resize(canvas.width, canvas.height)

      me.shapes = [ ]
      me.states = [ ]

      let offsetX, offsetY, offsets, updateSelection, updating, updateWidth, updateHeight

      (me.emitter = new Emitter(canvas))
      .on('mousedown', function (event) {

        let { x, y } = event
        let { hoverShape, activeShapes, states } = me
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

            if (hoverShape) {
              activeShapes = [ hoverShape ]
              me.setActiveShapes(activeShapes, true)
            }

            offsetX = x - states[ INDEX_ACTIVE ].x
            offsetY = y - states[ INDEX_ACTIVE ].y

            offsets = [ ]
            array.each(
              activeShapes,
              function (shape) {
                offsets.push({
                  x: x - shape.x,
                  y: y - shape.y,
                })
                if (hoverShape === shape) {
                  hoverShape = null
                  return false
                }
              }
            )

            me.refresh()
          }
        }
        else {
          me.setActiveShapes(null)
          updateSelection = updateRect(
            me.states[ INDEX_SELECTION ] = new Selection({ x, y }),
            x,
            y
          )
        }

      })
      .on('mousemove', function (event) {

        let { emitter, activeShapes, shapes, states } = me

        if (updating) {
          return
        }

        if (offsets) {
          states[ INDEX_ACTIVE ].x = event.x - offsetX
          states[ INDEX_ACTIVE ].y = event.y - offsetY

          array.each(
            activeShapes,
            function (shape, i) {
              shape.x = event.x - offsets[ i ].x
              shape.y = event.y - offsets[ i ].y
            }
          )

          me.refresh()
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
            ),
            true
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

        me.setHoverShape(hoverShape)

      })
      .on('mouseup', function () {
        if (offsets) {
          offsets = null
        }
        if (me.states[ INDEX_SELECTION ]) {
          me.states[ INDEX_SELECTION ] = null
          me.refresh()
        }
      })
      .on('updateStart', function (event) {
        updating = true
        updateWidth = event.width
        updateHeight = event.height
      })
      .on('updateEnd', function (event) {
        updating = false
        updateWidth = updateHeight = null
      })
      .on('updating', function (event) {
        me.refresh()
        let scaleX = event.width / updateWidth
        let scaleY = event.height / updateHeight
        array.each(
          me.activeShapes,
          function (shape) {
            shape.width *= scaleX
            shape.height *= scaleY
          }
        )
        updateWidth = event.width
        updateHeight = event.height
      })

    }

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

      shapes.forEach(drawShape)

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
      states.forEach(drawShape)

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
     * @param {Shape} shape
     * @param {?silent} silent
     */
    setHoverShape(shape, silent) {
      let { hoverShape, activeShapes, states } = this
      if (shape != hoverShape) {
        this.hoverShape = shape

        let needClear = states[ INDEX_HOVER ], isValid = shape && !shape.state

        if (needClear) {
          states[ INDEX_HOVER ].destroy()
          states[ INDEX_HOVER ] = null
        }

        if (isValid && activeShapes) {
          array.each(
            activeShapes,
            function (activeShape) {
              if (shape === activeShape) {
                return isValid = false
              }
            }
          )
          if (isValid) {
            states[ INDEX_HOVER ] = new Hover({ shape })
          }
        }

        if (needClear || isValid) {
          if (!silent) {
            this.refresh()
          }
          return true
        }
      }
    }

    /**
     * @param {Shape} shapes
     * @param {?silent} silent
     */
    setActiveShapes(shapes, silent) {
      let { hoverShape, activeShapes, states } = this
      if (shapes != activeShapes) {

        let length, hasHoverShape

        if (shapes) {
          length = shapes.length

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

        if (hasHoverShape) {
          this.setHoverShape(null, true)
        }

        this.activeShapes = shapes

        if (states[ INDEX_ACTIVE ]) {
          states[ INDEX_ACTIVE ].destroy()
          states[ INDEX_ACTIVE ] = null
        }

        if (length > 0) {
          states[ INDEX_ACTIVE ] = new Active(
            getUnionRect(shapes),
            this.emitter,
            this.canvas
          )
        }

        if (!silent) {
          this.refresh()
        }

        return true
      }
    }

  }

  return Canvas

})