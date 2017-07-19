/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  const Selection = require('./states/Selection')
  const Active = require('./states/Active')
  const Hover = require('./states/Hover')

  const getInterRect = require('./function/getInterRect')
  const array = require('./util/array')

  const Emitter = require('./Emitter')
  const Painter = require('./Painter')

  const INDEX_ACTIVE = 0

  let { devicePixelRatio } = window
  if (devicePixelRatio > 2) {
    devicePixelRatio = 2
  }

  // [TODO]
  // 1. 图形的 beginPath 尽量减少
  // 2. 重构 canvas 的事件 handler
  // 3. 把 states 做成插件机制，各自管理自己的逻辑
  class Canvas {

    constructor(canvas) {

      const me = this

      me.element = canvas
      me.resize(canvas.width, canvas.height)

      me.painter = new Painter(canvas.getContext('2d'))
      const emitter = me.emitter = new Emitter(canvas)

      me.shapes = [ ]
      me.states = [
        new Active({ }, emitter),
        new Hover({ }, emitter),
        new Selection({ }, emitter)
      ]

      let hoverShape

      emitter
      .on(
        Emitter.MOUSE_MOVE,
        function (event) {

          let newHoverShape

          array.each(
            [ me.states, me.shapes ],
            function (list) {
              array.each(
                list,
                function (shape) {
                  if (shape && shape.isPointInPath(me.painter, event.x, event.y) !== false) {
                    newHoverShape = shape
                    return false
                  }
                },
                true
              )
              if (newHoverShape) {
                return false
              }
            }
          )

          if (newHoverShape !== hoverShape) {

            if (hoverShape) {
              emitter.fire(
                Emitter.SHAPE_LEAVE,
                {
                  shape: hoverShape
                }
              )
            }

            if (newHoverShape) {
              emitter.fire(
                Emitter.SHAPE_ENTER,
                {
                  shape: newHoverShape
                }
              )
            }

            hoverShape = newHoverShape

          }

        }
      )
      .on(
        Emitter.HOVER_SHAPE_CHANGE,
        function () {
          me.refresh()
        }
      )
      .on(
        Emitter.ACTIVE_SHAPE_CHANGE,
        function () {
          me.refresh()
        }
      )
      .on(
        Emitter.ACTIVE_SHAPE_DELETE,
        function () {
          let state = me.states[ INDEX_ACTIVE ], shapes = state.getShapes()
          if (shapes.length) {
            array.each(
              shapes,
              function (shape) {
                array.remove(me.shapes, shape)
              }
            )
            state.setShapes([])
          }
        }
      )
      .on(
        Emitter.SELECTION_RECT_CHANGE,
        function (event) {
          me.states[ INDEX_ACTIVE ].setShapes(
            me.shapes.filter(
              function (shape) {
                if (getInterRect(shape.getRect(), event.rect)) {
                  return true
                }
              }
            )
          )
        }
      )
      .on(
        Emitter.CANVAS_DECO,
        function (event) {
          event.action(me)
        }
      )

    }

    /**
     * 调整画布大小
     *
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {

      const { element } = this

      element.style.width = width + 'px'
      element.style.height = height + 'px'

      if (devicePixelRatio > 1) {
        width *= devicePixelRatio
        height *= devicePixelRatio
      }

      this.element.width = Math.floor(width)
      this.element.height = Math.floor(height)

    }

    /**
     * 添加图形
     *
     * @param {Shape} shape
     */
    addShape(shape) {
      shape.draw(this.painter)
      this.shapes.push(shape)
    }

    /**
     * 全量刷新画布
     */
    refresh() {

      const { painter, shapes, states, activeShapes } = this

      painter.clear()

      const drawShape = function (shape) {
        if (shape) {
          shape.draw(painter)
        }
      }

      array.each(shapes, drawShape)
      array.each(states, drawShape)

    }

    /**
     * 清空画布
     */
    clear() {
      let { painter, shapes } = this
      shapes.length = 0
      painter.clear()
    }

  }

  return Canvas

})