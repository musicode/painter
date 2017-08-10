/**
 * @file 画布
 * @author musicode
 */
define(function (require, exports, module) {

  const Selection = require('./states/Selection')
  const Active = require('./states/Active')
  const Hover = require('./states/Hover')
  const Drawing = require('./states/Drawing')

  const getInterRect = require('./function/getInterRect')
  const getDevicePixelRatio = require('./function/getDevicePixelRatio')
  const array = require('./util/array')

  const Emitter = require('./Emitter')
  const Painter = require('./Painter')

  const INDEX_ACTIVE = 0
  const INDEX_SELECTION = 2

  class Canvas {

    constructor(canvas) {

      const me = this

      me.element = canvas
      me.resize(canvas.width, canvas.height)

      const painter = me.painter = new Painter(canvas.getContext('2d'))

      const emitter = me.emitter = new Emitter(canvas)

      me.shapes = [ ]
      me.states = [
        new Active({ }, emitter, painter),

        new Hover({ }, emitter)
      ]

      let hoverShape

      let refresh = function () {
        me.refresh()
      }

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
                  if (shape && shape.isPointInPath(painter, event.x, event.y) !== false) {
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
        refresh
      )
      .on(
        Emitter.ACTIVE_SHAPE_CHANGE,
        refresh
      )
      .on(
        Emitter.ACTIVE_RECT_CHANGE,
        refresh
      )
      .on(
        Emitter.REFRESH,
        refresh
      )
      .on(
        Emitter.ACTIVE_SHAPE_ENTER,
        function () {
          let state = me.states[ INDEX_ACTIVE ], shapes = state.getShapes()
          if (shapes.length) {
            debugger
          }
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
            state.setShapes(painter, [])
          }
        }
      )
      .on(
        Emitter.SELECTION_RECT_CHANGE,
        function (event) {
          me.states[ INDEX_ACTIVE ].setShapes(
            painter,
            me.shapes.filter(
              function (shape) {
                if (getInterRect(shape.getRect(painter), event.rect)) {
                  return true
                }
              }
            )
          )
        }
      )
      .on(
        Emitter.SELECTION_START,
        function () {
          canvas.style.cursor = 'crosshair'
        }
      )
      .on(
        Emitter.SELECTION_END,
        function () {
          canvas.style.cursor = ''
          me.refresh()
        }
      )
      .on(
        Emitter.DRAWING_START,
        function (event) {
          canvas.style.cursor = event.cursor
        }
      )
      .on(
        Emitter.DRAWING_END,
        function (event) {
          canvas.style.cursor = ''
          const { shape } = event
          if (shape) {
            if (shape.validate(painter)) {
              array.push(me.shapes, shape)
            }
            me.refresh()
          }
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

      const devicePixelRatio = getDevicePixelRatio()
      if (devicePixelRatio > 1) {
        width *= devicePixelRatio
        height *= devicePixelRatio
      }

      this.element.width = width
      this.element.height = height

    }

    /**
     * 添加图形
     *
     * @param {Shape} shape
     */
    addShape(shape) {
      shape.draw(this.painter)
      array.push(this.shapes, shape)
    }

    drawing(Shape) {
      const { states, emitter, painter, config } = this
      if (states[ INDEX_SELECTION ]) {
        states[ INDEX_SELECTION ].destroy()
      }
      if (Shape) {
        states[ INDEX_SELECTION ] = new Drawing(
          {
            createShape: function () {
              return new Shape(config)
            }
          },
          emitter,
          painter
        )
      }
      else {
        states[ INDEX_SELECTION ] = new Selection({ }, emitter)
      }
    }

    apply(config) {
      array.each(
        this.states[ INDEX_ACTIVE ].getShapes(),
        function (shape) {
          Object.assign(shape, config)
        }
      )
      this.refresh()
      this.config = config
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
      this.shapes.length = 0
      this.painter.clear()
      this.emitter.fire(
        Emitter.CLEAR
      )
    }

  }

  return Canvas

})