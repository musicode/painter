/**
 * @file 画布
 * @author musicode
 */

import Selection from './states/Selection'
import Active from './states/Active'
import Hover from './states/Hover'
import Drawing from './states/Drawing'

import getInterRect from './function/getInterRect'
import getDevicePixelRatio from './function/getDevicePixelRatio'
import array from './util/array'
import object from './util/object'

import Emitter from './Emitter'
import Painter from './Painter'

const INDEX_ACTIVE = 0
const INDEX_HOVER = 1
const INDEX_SELECTION = 2

export default class Canvas {

  constructor(canvas, maxHistorySize = 10) {

    const me = this

    me.element = canvas
    me.resize(canvas.width, canvas.height, true)

    const painter = me.painter = new Painter(canvas.getContext('2d'))

    const emitter = me.emitter = new Emitter(canvas)

    me.states = [ ]

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
   * @param {boolean} silent
   */
  resize(width, height, silent) {

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

    if (!silent) {
      this.refresh()
    }

  }

  /**
   * 添加图形
   *
   * @param {Shape} shape
   * @param {boolean} silent
   */
  addShape(shape, silent) {
    this.addShapes([ shape ], silent)
  }

  /**
   * 批量添加图形
   *
   * @param {Array.<Shape>} shapes
   * @param {boolean} silent
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
   * @param {boolean} silent
   */
  removeShape(shape, silent) {
    this.removeShapes([ shape ], silent)
  }

  /**
   * 批量删除图形
   *
   * @param {Array.<Shape>} shapes
   * @param {boolean} silent
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

    const destroy = function (name) {
      if (states[ name ]) {
        states[ name ].destroy()
        states[ name ] = null
      }
    }

    const createActiveIfNeeded = function () {
      if (!states[ INDEX_ACTIVE ]) {
        states[ INDEX_ACTIVE ] = new Active({ }, emitter, painter)
      }
    }

    const createHoverIfNeeded = function () {
      if (!states[ INDEX_HOVER ]) {
        states[ INDEX_HOVER ] = new Hover(
          { },
          emitter
        )
      }
    }

    const createSelection = function (selection) {
      destroy(INDEX_SELECTION)
      states[ INDEX_SELECTION ] = selection
    }

    if (Shape) {
      createActiveIfNeeded()
      createHoverIfNeeded()
      createSelection(
        new Drawing(
          {
            createShape: function () {
              return new Shape(config)
            }
          },
          emitter,
          painter
        )
      )
    }
    else if (Shape !== false) {
      createActiveIfNeeded()
      createHoverIfNeeded()
      createSelection(
        new Selection(
          { },
          emitter
        )
      )
    }
    else {
      destroy(INDEX_ACTIVE)
      destroy(INDEX_HOVER)
      createSelection()
    }

    this.refresh()

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
      const active = this.states[ INDEX_ACTIVE ]
      if (active) {
        const shapes = active.getShapes()
        if (shapes.length) {
          this.editShapes(shapes, config)
        }
      }
      this.config = config
      return true
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
   * 是否有上一步
   *
   * @return {boolean}
   */
  hasPrev() {
    return this.histories[ this.historyIndex - 1 ] ? true : false
  }

  /**
   * 上一步，用于撤销
   *
   * @return {boolean} 是否撤销成功
   */
  prev() {
    if (this.hasPrev()) {
      this.historyIndex--
      this.emitter.fire(
        Emitter.RESET
      )
      this.refresh()
      return true
    }
  }

  /**
   * 是否有下一步
   *
   * @return {boolean}
   */
  hasNext() {
    return this.histories[ this.historyIndex + 1 ] ? true : false
  }

  /**
   * 下一步，用于恢复
   *
   * @return {boolean} 是否恢复成功
   */
  next() {
    if (this.hasNext()) {
      this.historyIndex++
      this.emitter.fire(
        Emitter.RESET
      )
      this.refresh()
      return true
    }
  }

}

import Arrow from './shapes/Arrow'
import Doodle from './shapes/Doodle'
import Heart from './shapes/Heart'
import Line from './shapes/Line'
import Oval from './shapes/Oval'
import Polygon from './shapes/Polygon'
import Rect from './shapes/Rect'
import Star from './shapes/Star'
import Text from './shapes/Text'

Canvas.shapes = {
  Arrow,
  Doodle,
  Heart,
  Line,
  Oval,
  Polygon,
  Rect,
  Star,
  Text,
}
