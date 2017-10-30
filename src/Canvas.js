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
  const object = require('./util/object')

  const Emitter = require('./Emitter')
  const Painter = require('./Painter')

  const INDEX_ACTIVE = 0
  const INDEX_SELECTION = 2

  class Canvas {

    constructor(canvas, maxHistorySize = 10) {

      const me = this

      me.element = canvas
      me.resize(canvas.width, canvas.height)

      const painter = me.painter = new Painter(canvas.getContext('2d'))

      const emitter = me.emitter = new Emitter(canvas)

      me.states = [
        new Active({ }, emitter, painter),

        new Hover({ }, emitter)
      ]

      me.histories = [ [ ] ]
      me.historyIndex = 0
      me.maxHistorySize = maxHistorySize

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
            [ me.states, me.getShapes() ],
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
        Emitter.REFRESH,
        refresh
      )
      .on(
        Emitter.ACTIVE_RECT_CHANGE_END,
        refresh
      )
      .on(
        Emitter.ACTIVE_RECT_CHANGE_START,
        function () {
          let state = me.states[ INDEX_ACTIVE ], shapes = state.getShapes()
          if (shapes.length) {
            me.editShapes(shapes, null, true)
          }
        }
      )
      .on(
        Emitter.ACTIVE_SHAPE_DELETE,
        function () {
          let state = me.states[ INDEX_ACTIVE ], shapes = state.getShapes()
          if (shapes.length) {
            me.removeShapes(shapes, true)
            state.setShapes(painter, [])
          }
        }
      )
      .on(
        Emitter.SELECTION_RECT_CHANGE,
        function (event) {
          me.states[ INDEX_ACTIVE ].setShapes(
            painter,
            me.getShapes().filter(
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
              me.addShape(shape, true)
            }
            me.refresh()
          }
        }
      )
      .on(
        Emitter.ACTIVE_DRAG_BOX_HOVER,
        function (event) {
          let { name } = event
          if (name) {
            name += '-resize'
          }
          canvas.style.cursor = name
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
     * @param {bolean} silent
     */
    addShape(shape, silent) {
      this.addShapes([ shape ], silent)
    }

    /**
     * 批量添加图形
     *
     * @param {Array.<Shape>} shapes
     * @param {bolean} silent
     */
    addShapes(shapes, silent) {
      let me = this
      me.save()
      array.each(
        shapes,
        function (shape) {
          array.push(me.getShapes(), shape)
        }
      )
      if (!silent) {
        me.refresh()
      }
    }

    /**
     * 删除图形
     *
     * @param {Shape} shape
     * @param {bolean} silent
     */
    removeShape(shape, silent) {
      this.removeShapes([ shape ], silent)
    }

    /**
     * 批量删除图形
     *
     * @param {Array.<Shape>} shapes
     * @param {bolean} silent
     */
    removeShapes(shapes, silent) {
      let me = this
      me.save()
      array.each(
        shapes,
        function (shape) {
          array.remove(me.getShapes(), shape)
        }
      )
      if (!silent) {
        me.refresh()
      }
    }

    editShapes(shapes, props, silent) {
      this.save()
      const allShapes = this.getShapes()
      array.each(
        shapes,
        function (shape, i) {
          let index = allShapes.indexOf(shape)
          if (index >= 0) {
            let newShape = shape.clone()
            if (props) {
              Object.assign(newShape, props)
            }
            allShapes[ index ] = shapes[ i ] = newShape
          }
        }
      )
      if (!silent) {
        this.refresh()
      }
    }

    getShapes() {
      const { histories, historyIndex } = this
      return histories[ historyIndex ]
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
        states[ INDEX_SELECTION ] = new Selection(
          { },
          emitter
        )
      }
    }

    apply(config) {

      let isChange

      const oldConfig = this.config || { }
      object.each(
        config,
        function (value, key) {
          if (value !== oldConfig[ key ]) {
            isChange = true
            return false
          }
        }
      )

      if (isChange) {
        const shapes = this.states[ INDEX_ACTIVE ].getShapes()
        if (shapes.length) {
          this.editShapes(shapes, config)
        }
        this.config = config
      }

    }

    /**
     * 全量刷新画布
     */
    refresh() {

      const { painter } = this

      painter.clear()

      const drawShape = function (shape) {
        if (shape) {
          shape.draw(painter)
        }
      }

      array.each(this.getShapes(), drawShape)
      array.each(this.states, drawShape)

    }

    /**
     * 清空画布
     */
    clear() {
      this.getShapes().length = 0
      this.painter.clear()
      this.emitter.fire(
        Emitter.CLEAR
      )
    }

    /**
     * 修改操作前先保存，便于 prev 和 next 操作
     */
    save() {
      // 当前 shapes 必须存在于 histories
      // 否则无法进行 prev 和 next
      const { histories, maxHistorySize, historyIndex } = this

      if (histories.length > historyIndex + 1) {
        histories.splice(historyIndex + 1)
      }

      const shapes = this.getShapes()
      if (histories.length > 0) {
        histories.splice(
          histories.length - 1, 0, object.copy(shapes)
        )
      }
      else {
        histories.push(
          object.copy(shapes),
          shapes
        )
      }

      if (histories.length > maxHistorySize + 1) {
        histories.splice(0, 1)
      }

      this.historyIndex = histories.length - 1

    }

    /**
     * 上一步，用于撤销
     *
     * @return {boolean} 是否撤销成功
     */
    prev() {
      let { histories, historyIndex, emitter } = this
      historyIndex--
      if (histories[ historyIndex ]) {
        this.historyIndex = historyIndex
        emitter.fire(
          Emitter.RESET
        )
        this.refresh()
        return true
      }
    }

    /**
     * 下一步，用于恢复
     *
     * @return {boolean} 是否恢复成功
     */
    next() {
      let { histories, historyIndex, emitter } = this
      historyIndex++
      if (histories[ historyIndex ]) {
        this.historyIndex = historyIndex
        emitter.fire(
          Emitter.RESET
        )
        this.refresh()
        return true
      }
    }

  }

  return Canvas

})