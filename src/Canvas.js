/**
 * @file 画布
 * @author musicode
 */

import Selection from './states/Selection'
import Active from './states/Active'
import Hover from './states/Hover'
import Drawing from './states/Drawing'

import randomInt from './function/randomInt'
import getInterRect from './function/getInterRect'
import convertDimension from './function/convertDimension'
import array from './util/array'
import object from './util/object'

import Emitter from './Emitter'
import Painter from './Painter'
import constant from './constant'

const INDEX_ACTIVE = 0
const INDEX_HOVER = 1
const INDEX_SELECTION = 2

export default class Canvas {

  constructor(canvas, maxHistorySize = 10, container = null) {

    const me = this

    me.element = canvas
    me.resize(canvas.width, canvas.height, true)

    const painter = me.painter = new Painter(canvas.getContext('2d'))

    const emitter = me.emitter = new Emitter(canvas, container)

    me.states = [ ]

    me.histories = [ { } ]
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
      Emitter.ACTIVE_RECT_CHANGE_END,
      refresh
    )
    .on(
      Emitter.CLEAR,
      function () {
        me.clear()
      }
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
        me.removeActiveShapes()
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
      Emitter.SHAPE_DRAWING_START,
      function (event) {
        canvas.style.cursor = event.cursor
      }
    )
    .on(
      Emitter.SHAPE_DRAWING,
      refresh
    )
    .on(
      Emitter.SHAPE_DRAWING_END,
      function (event) {
        canvas.style.cursor = ''
        const { shape } = event
        if (shape) {
          const rect = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
          }
          if (!shape.validate || shape.validate(painter, rect)) {
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
   * @param {number} newWidth
   * @param {number} newHeight
   * @param {boolean} silent
   */
  resize(newWidth, newHeight, silent) {

    const { element, histories, historyIndex } = this

    element.style.width = newWidth + 'px'
    element.style.height = newHeight + 'px'

    newWidth *= constant.DEVICE_PIXEL_RATIO
    newHeight *= constant.DEVICE_PIXEL_RATIO

    element.width = newWidth
    element.height = newHeight

    if (histories) {
      const history = histories[ historyIndex ]

      if (history.shapes && history.width && history.height) {
        convertDimension(
          history.shapes,
          history.width,
          history.height,
          newWidth,
          newHeight
        )
      }

      history.width = newWidth
      history.height = newHeight

    }

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
    let allShapes = me.getShapes()

    me.save()

    array.each(
      shapes,
      function (shape) {
        array.push(allShapes, shape)
      }
    )
    if (!silent) {
      me.refresh()
    }
    me.emitter.fire(
      Emitter.SHAPE_ADD,
      {
        shapes: shapes
      }
    )
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

    let numbers = { }
    array.each(
      shapes,
      function (shape) {
        numbers[ shape.number ] = 1
      }
    )


    let removedShapes = [ ]

    let allShapes = me.getShapes()
    array.each(
      allShapes,
      function (shape, index) {
        if (numbers[ shape.number ]) {
          allShapes.splice(index, 1)
          removedShapes.push(shape)
        }
      },
      true
    )

    if (!silent) {
      me.refresh()
    }

    me.emitter.fire(
      Emitter.SHAPE_REMOVE,
      {
        shapes: removedShapes
      }
    )
  }

  /**
   * 删除选中的图形
   */
  removeActiveShapes() {
    let state = this.states[ INDEX_ACTIVE ]
    if (state) {
      let shapes = state.getShapes()
      if (shapes.length) {
        this.removeShapes(shapes, true)
        state.setShapes(this.painter, [ ])
      }
    }
  }

  editShapes(shapes, props, silent) {
    let me = this
    me.save()
    let allShapes = me.getShapes()
    array.each(
      shapes,
      function (shape, i) {
        let index = allShapes.indexOf(shape)
        if (index >= 0) {
          let newShape = shape.clone()
          if (props) {
            object.extend(newShape, props)
          }
          allShapes[ index ] = shapes[ i ] = newShape
        }
      }
    )
    if (!silent) {
      me.refresh()
    }
    me.emitter.fire(
      Emitter.SHAPE_UPDATE,
      {
        shapes: shapes
      }
    )
  }

  getShapes() {
    const history = this.histories[ this.historyIndex ]
    return history.shapes || (history.shapes = [ ])
  }

  drawing(Shape) {
    const { states, emitter, painter, config } = this

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
          config,
          emitter
        )
      }
    }

    const createSelection = function (selection) {
      destroy(INDEX_SELECTION)
      states[ INDEX_SELECTION ] = selection
    }

    if (Shape) {
      destroy(INDEX_ACTIVE)
      destroy(INDEX_HOVER)
      createSelection(
        new Drawing(
          {
            createShape: function () {
              const shape = new Shape(config)
              shape.number = '' + randomInt(10)
              return shape
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

    const active = this.states[ INDEX_ACTIVE ]
    if (active) {
      const shapes = active.getShapes()
      if (shapes.length) {
        this.editShapes(shapes, config)
      }
    }
    this.config = config

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
    this.removeShapes(
      this.getShapes()
    )
  }

  /**
   * 修改操作前先保存，便于 prev 和 next 操作
   */
  save() {
    // 当前 shapes 必须存在于 histories
    // 否则无法进行 prev 和 next
    const { element, histories, maxHistorySize, historyIndex } = this

    if (histories.length > historyIndex + 1) {
      histories.splice(historyIndex + 1)
    }

    const newHistory = {
      width: element.width,
      height: element.height,
      shapes: this.getShapes(),
    }
    if (histories.length > 0) {
      histories.splice(
        histories.length,
        0,
        newHistory
      )
    }
    else {
      histories.push(
        object.copy(newHistory),
        newHistory
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
      const { width, height, shapes } = this.histories[ this.historyIndex ]
      if (shapes) {
        convertDimension(
          shapes,
          width,
          height,
          this.element.width,
          this.element.height
        )
      }
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
      const { width, height, shapes } = this.histories[ this.historyIndex ]
      if (shapes) {
        convertDimension(
          shapes,
          width,
          height,
          this.element.width,
          this.element.height
        )
      }
      this.refresh()
      return true
    }
  }

  /**
   * 销毁
   */
  dispose() {
    this.emitter.dispose()
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

Canvas.Emitter = Emitter
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
