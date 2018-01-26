(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Painter = factory());
}(this, (function () { 'use strict';

/**
 * @file 数组操作
 * @author musicode
 */

function each$1(array, callback, reversed) {
  var length = array.length;

  if (length) {
    if (reversed) {
      for (var i = length - 1; i >= 0; i--) {
        if (callback(array[i], i) === false) {
          break;
        }
      }
    } else {
      for (var _i = 0; _i < length; _i++) {
        if (callback(array[_i], _i) === false) {
          break;
        }
      }
    }
  }
}

function push(array, item) {
  array.push(item);
}

function pop(array) {
  array.pop();
}

function remove(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
}

function last(array) {
  return array[array.length - 1];
}

function has(array, item) {
  return array.indexOf(item) >= 0;
}

var array = {
  each: each$1,
  push: push,
  pop: pop,
  remove: remove,
  last: last,
  has: has
};













var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new Error("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * 遍历对象
 *
 * @param {Object} object
 * @param {Function} callback 返回 false 可停止遍历
 */
function each(object, callback) {
  array.each(Object.keys(object), function (key) {
    return callback(object[key], key);
  });
}

/**
 * 拷贝对象
 *
 * @param {*} object
 * @param {?boolean} deep 是否需要深拷贝
 * @return {*}
 */
function copy(object, deep) {
  var result = object;
  if (Array.isArray(object)) {
    result = [];
    array.each(object, function (item, index) {
      result[index] = deep ? copy(item, deep) : item;
    });
  } else if (object && typeof object === 'object') {
    result = {};
    each(object, function (value, key) {
      result[key] = deep ? copy(value, deep) : value;
    });
  }
  return result;
}

/**
 * 扩展对象
 *
 * @param {Object} source
 * @param {Object} target
 * @return {Object}
 */
function extend(source, target) {
  if (target) {
    each(target, function (value, key) {
      source[key] = value;
    });
  }
  return source;
}

var object = {
  each: each,
  copy: copy,
  extend: extend
};

/**
 * @file 状态基类
 * @author musicode
 */

var State = function () {
  function State(props, emitter) {
    classCallCheck(this, State);

    object.extend(this, props);
    this.emitter = emitter;
    this.state = true;
  }

  State.prototype.on = function (type, handler) {
    this.emitter.on(type, handler, true);
    return this;
  };

  State.prototype.off = function (type, handler) {
    this.emitter.off(type, handler);
    return this;
  };

  State.prototype.destroy = function () {};

  State.prototype.draw = function () {};

  return State;
}();

/**
 * @file 常量
 * @author musicode
 */
var constant = {
  DEVICE_PIXEL_RATIO: window.devicePixelRatio > 1 ? window.devicePixelRatio : 1,
  STROKE_POSITION_INSIDE: 1,
  STROKE_POSITION_CENTER: 2,
  STROKE_POSITION_OUTSIDE: 3
};

/**
 * @file 事件处理
 * @author musicode
 */
function getStyle(element, name) {
  return window.getComputedStyle(element, null).getPropertyValue(name);
}

var Emitter = function () {
  function Emitter(canvas, container) {
    classCallCheck(this, Emitter);


    var me = this,
        canvasOffset = {},
        containerOffset = {},
        realX,
        realY,
        cursorX,
        cursorY,
        pageX,
        pageY,
        inCanvas,
        drawing;

    me.canvas = canvas;
    me.listeners = {};

    var getOffset = function (element, offset) {
      if (element && element.tagName) {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
        if (getStyle(element, 'position') !== 'fixed') {
          getOffset(element.offsetParent, offset);
        }
      }
    };

    var updateOffset = function () {

      canvasOffset.x = canvasOffset.y = containerOffset.x = containerOffset.y = 0;

      getOffset(canvas, canvasOffset);

      if (container) {
        getOffset(container, containerOffset);
      }
    };

    var updateInCanvas = function (event) {
      var target = event.target;

      inCanvas = target.tagName === 'CANVAS' && target === canvas || target.className.indexOf('cursor') >= 0;
    };

    var updatePosition = function (event, globalX, globalY) {

      pageX = globalX;
      pageY = globalY;

      realX = pageX - canvasOffset.x;
      realY = pageY - canvasOffset.y;

      if (container) {
        realX += container.scrollLeft;
        realY += container.scrollTop;
      }

      cursorX = realX * constant.DEVICE_PIXEL_RATIO;
      cursorY = realY * constant.DEVICE_PIXEL_RATIO;
    };

    var updatePositionByTouchEvent = function (event) {
      var touches = event.touches;

      if (touches) {
        updatePosition(event, touches[0].pageX, touches[0].pageY);
      } else {
        updatePosition(event, event.pageX, event.pageY);
      }
    };

    var fireEvent = function (type, data) {
      if (drawing || inCanvas) {
        me.fire(type, data);
      }
    };

    updateOffset();

    var onMouseDown = function (event) {
      // 左键是 0，触摸屏没有 button 属性，因此取反就行
      if (!me.disabled && !event.button && !event.isHandled) {
        // 容错
        if (drawing) {
          onMouseUp();
          return;
        }
        if (inCanvas) {
          drawing = true;
          updateOffset();
        }
        updatePositionByTouchEvent(event);
        fireEvent(Emitter.MOUSE_DOWN, {
          x: cursorX,
          y: cursorY,
          realX: realX,
          realY: realY,
          pageX: pageX,
          pageY: pageY,
          target: event.target,
          inCanvas: inCanvas
        });
        event.isHandled = true;
      }
    };

    var onMouseUp = function () {
      if (!me.disabled) {
        fireEvent(Emitter.MOUSE_UP, {
          x: cursorX,
          y: cursorY,
          realX: realX,
          realY: realY,
          pageX: pageX,
          pageY: pageY,
          inCanvas: inCanvas
        });
        if (drawing) {
          drawing = false;
        }
      }
    };

    var documentEvents = {},
        canvasEvents = {};

    var addDocumentEvent = function (type, listener) {
      document.addEventListener(type, listener);
      documentEvents[type] = listener;
    };

    var addCanvasEvent = function (type, listener) {
      canvas.addEventListener(type, listener);
      canvasEvents[type] = listener;
    };

    addDocumentEvent('mousedown', onMouseDown);

    addDocumentEvent('mousemove', function (event) {
      if (!me.disabled) {

        updateInCanvas(event);

        updatePosition(event, event.pageX, event.pageY);

        fireEvent(Emitter.MOUSE_MOVE, {
          x: cursorX,
          y: cursorY,
          realX: realX,
          realY: realY,
          pageX: pageX,
          pageY: pageY,
          inCanvas: drawing ? true : inCanvas
        });
      }
    });

    addDocumentEvent('mouseup', onMouseUp);

    if ('ontouchstart' in document) {
      addDocumentEvent('touchstart', onMouseDown);
      addDocumentEvent('touchmove', function (event) {
        if (!me.disabled) {
          updateInCanvas(event);
          updatePositionByTouchEvent(event);
          fireEvent(Emitter.MOUSE_MOVE, {
            x: cursorX,
            y: cursorY,
            realX: realX,
            realY: realY,
            pageX: pageX,
            pageY: pageY,
            inCanvas: drawing ? true : inCanvas
          });
        }
      });
      addCanvasEvent('touchmove', function (event) {
        if (!me.disabled) {
          updatePositionByTouchEvent(event);
          fireEvent(Emitter.MOUSE_MOVE, {
            x: cursorX,
            y: cursorY,
            realX: realX,
            realY: realY,
            pageX: pageX,
            pageY: pageY,
            inCanvas: drawing ? true : inCanvas
          });
          // 在 canvas 画画时禁止页面滚动
          event.preventDefault();
          event.stopPropagation();
        }
      });
      addDocumentEvent('touchend', onMouseUp);
    }

    if (SHORTCUT) {
      addDocumentEvent('keyup', function (event) {
        if (!me.disabled) {
          var name = SHORTCUT[event.keyCode];
          if (name) {
            me.fire(name);
          }
        }
      });
    }

    this.documentEvents = documentEvents;
    this.canvasEvents = canvasEvents;
  }

  Emitter.prototype.fire = function (type, data) {
    var list = this.listeners[type];
    if (list) {
      array.each(list, function (handler) {
        if (handler) {
          return handler(data);
        }
      });
    }
  };

  Emitter.prototype.on = function (type, listener, preferred) {
    var list = this.listeners[type] || (this.listeners[type] = []);
    if (preferred) {
      list.unshift(listener);
    } else {
      list.push(listener);
    }
    return this;
  };

  Emitter.prototype.off = function (type, listener) {
    var list = this.listeners[type];
    if (list) {
      array.remove(list, listener);
    }
    return this;
  };

  Emitter.prototype.dispose = function () {
    var canvas = this.canvas,
        documentEvents = this.documentEvents,
        canvasEvents = this.canvasEvents;

    object.each(documentEvents, function (listener, type) {
      document.removeEventListener(type, listener);
    });
    object.each(canvasEvents, function (listener, type) {
      canvas.removeEventListener(type, listener);
    });
  };

  return Emitter;
}();

Emitter.RESET = 'reset';

Emitter.CLEAR = 'clear';

Emitter.MOUSE_DOWN = 'mouse_down';

Emitter.MOUSE_MOVE = 'mouse_move';

Emitter.MOUSE_UP = 'mouse_up';

Emitter.SHAPE_ENTER = 'shape_enter';

Emitter.SHAPE_LEAVE = 'shape_leave';

Emitter.HOVER_SHAPE_CHANGE = 'hover_shape_change';

Emitter.ACTIVE_SHAPE_CHANGE = 'active_shape_change';

Emitter.ACTIVE_SHAPE_DELETE = 'active_shape_delete';

Emitter.ACTIVE_SHAPE_ENTER = 'active_shape_enter';

Emitter.ACTIVE_RECT_CHANGE_START = 'active_rect_change_start';

Emitter.ACTIVE_RECT_CHANGE_END = 'active_rect_change_end';

Emitter.ACTIVE_DRAG_BOX_HOVER = 'active_drag_box_hover';

Emitter.SELECTION_RECT_CHANGE = 'selection_rect_change';

Emitter.SELECTION_START = 'selection_start';

Emitter.SELECTION_END = 'selection_end';

Emitter.SHAPE_DRAWING_START = 'shape_drawing_start';

Emitter.SHAPE_DRAWING = 'shape_drawing';

Emitter.SHAPE_DRAWING_END = 'shape_drawing_end';

Emitter.SHAPE_ADD = 'shape_add';

Emitter.SHAPE_REMOVE = 'shape_remove';

Emitter.SHAPE_UPDATE = 'shape_update';

var SHORTCUT = {
  8: Emitter.ACTIVE_SHAPE_DELETE,
  13: Emitter.ACTIVE_SHAPE_ENTER,
  36: Emitter.CLEAR,
  46: Emitter.ACTIVE_SHAPE_DELETE
};

/**
 * @file 创建矩形，这是一个工厂函数，需传入起始点坐标
 * @author musicode
 */
var updateRect = function (rect, startX, startY) {
  return function (endX, endY) {
    if (startX < endX) {
      rect.x = startX;
      rect.width = endX - startX;
    } else {
      rect.x = endX;
      rect.width = startX - endX;
    }
    if (startY < endY) {
      rect.y = startY;
      rect.height = endY - startY;
    } else {
      rect.y = endY;
      rect.height = startY - endY;
    }
  };
};

/**
 * @file 选区
 * @author musicode
 */
var Selection = function (_State) {
  inherits(Selection, _State);

  function Selection(props, emitter) {
    classCallCheck(this, Selection);

    var _this = possibleConstructorReturn(this, _State.call(this, props, emitter));

    var me = _this,
        hoverShape;

    me.mouseDownHandler = function (event) {
      if (!hoverShape && event.inCanvas) {

        var update = updateRect(me, event.x, event.y);

        emitter.fire(Emitter.SELECTION_START);

        var mouseMoveHandler = function (event) {
          update(event.x, event.y);
          emitter.fire(Emitter.SELECTION_RECT_CHANGE, {
            rect: me
          });
        };

        var mouseUpHandler = function () {
          emitter.off(Emitter.MOUSE_MOVE, mouseMoveHandler);
          emitter.off(Emitter.MOUSE_UP, mouseUpHandler);
          emitter.off(Emitter.RESET, mouseUpHandler);
          me.x = me.y = me.width = me.height = update = null;
          emitter.fire(Emitter.SELECTION_END);
        };
        emitter.on(Emitter.MOUSE_MOVE, mouseMoveHandler).on(Emitter.MOUSE_UP, mouseUpHandler).on(Emitter.RESET, mouseUpHandler);
      }
    };

    me.shapeEnterHandler = function (event) {
      hoverShape = event.shape;
    };

    me.shapeLeaveHandler = function () {
      if (hoverShape) {
        hoverShape = null;
      }
    };

    me.on(Emitter.MOUSE_DOWN, me.mouseDownHandler).on(Emitter.SHAPE_ENTER, me.shapeEnterHandler).on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler);

    return _this;
  }

  Selection.prototype.destroy = function () {
    this.off(Emitter.MOUSE_DOWN, this.mouseDownHandler).off(Emitter.SHAPE_ENTER, this.shapeEnterHandler).off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler);
  };

  Selection.prototype.isPointInPath = function (painter, x, y) {
    return false;
  };

  Selection.prototype.draw = function (painter) {
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height;

    if (!width || !height) {
      return;
    }

    painter.disableShadow();

    painter.setLineWidth(1);
    painter.setStrokeStyle('#ccc');
    painter.setFillStyle('rgba(180,180,180,0.1)');

    painter.begin();
    painter.drawRect(x + 0.5, y + 0.5, width, height);
    painter.stroke();
    painter.fill();
  };

  return Selection;
}(State);

/**
 * @file 多个矩形的并集
 * @author musicode
 */
var getUnionRect = function (rects) {
  var length = rects.length;

  if (!length) {
    throw new Error("getUnionRect rects array length have to be large than 1.");
  }

  var rect = rects[0];
  var left = rect.x;
  var top = rect.y;
  var right = left + rect.width;
  var bottom = top + rect.height;

  for (var i = 1; i < length; i++) {
    rect = rects[i];
    if (rect.x < left) {
      left = rect.x;
    }
    if (rect.y < top) {
      top = rect.y;
    }
    if (rect.x + rect.width > right) {
      right = rect.x + rect.width;
    }
    if (rect.y + rect.height > bottom) {
      bottom = rect.y + rect.height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
};

/**
 * @file 选中状态
 * @author musicode
 */

var LEFT_TOP = 0;
var CENTER_TOP = 1;
var RIGHT_TOP = 2;
var RIGHT_MIDDLE = 3;
var RIGHT_BOTTOM = 4;
var CENTER_BOTTOM = 5;
var LEFT_BOTTOM = 6;
var LEFT_MIDDLE = 7;

function isTextShape(shape) {
  return shape.toJSON().fontSize ? true : false;
}

var Active = function (_State) {
  inherits(Active, _State);

  function Active(props, emitter, painter) {
    classCallCheck(this, Active);

    var _this = possibleConstructorReturn(this, _State.call(this, props, emitter));

    var me = _this,
        currentBox,
        targetX,
        targetY,
        update,
        hoverShape,
        savedShapes;

    me.shapes = [];

    var saveShapes = function () {
      savedShapes = me.shapes.map(function (shape) {
        return shape.save(me);
      });
    };

    var updateShapes = function () {
      array.each(me.shapes, function (shape, i) {
        shape.restore(me, savedShapes[i]);
      });
    };

    me.clearHandler = function () {
      me.setShapes(painter, []);
    };
    me.shapeEnterHandler = function (event) {
      var shape = event.shape;

      if (!shape.state) {
        hoverShape = shape;
      }
    };
    me.shapeLeaveHandler = function () {
      if (hoverShape) {
        hoverShape = null;
      }
    };
    me.mouseDownHandler = function (event) {
      if (currentBox >= 0) {
        var left = me.x,
            top = me.y,
            right = left + me.width,
            bottom = top + me.height;
        switch (currentBox) {
          case LEFT_TOP:
            update = updateRect(me, right, bottom);
            break;
          case CENTER_TOP:
            targetX = left;
            update = updateRect(me, right, bottom);
            break;
          case RIGHT_TOP:
            update = updateRect(me, left, bottom);
            break;
          case RIGHT_MIDDLE:
            targetY = bottom;
            update = updateRect(me, left, top);
            break;
          case RIGHT_BOTTOM:
            update = updateRect(me, left, top);
            break;
          case CENTER_BOTTOM:
            targetX = right;
            update = updateRect(me, left, top);
            break;
          case LEFT_BOTTOM:
            update = updateRect(me, right, top);
            break;
          case LEFT_MIDDLE:
            targetY = bottom;
            update = updateRect(me, right, top);
            break;
        }
        saveShapes();
      } else if (hoverShape) {
        if (!array.has(me.shapes, hoverShape)) {
          me.setShapes(painter, [hoverShape]);
        }
        var offsetX = event.x - me.x,
            offsetY = event.y - me.y;
        update = function update(x, y) {
          me.x = x - offsetX;
          me.y = y - offsetY;
        };
        saveShapes();
      } else if (event.inCanvas && me.shapes.length) {
        me.setShapes(painter, []);
      }
    };
    me.mouseMoveHandler = function (event) {

      if (update) {
        update(targetX || event.x, targetY || event.y);
        emitter.fire(Emitter.ACTIVE_RECT_CHANGE_START);
        updateShapes();
        emitter.fire(Emitter.ACTIVE_RECT_CHANGE_END);
        return;
      }

      var index = me.isPointInPath(painter, event.x, event.y),
          cursor;
      if (index !== false) {
        if (currentBox !== index) {
          currentBox = index;
          switch (index) {
            case CENTER_TOP:
            case CENTER_BOTTOM:
              cursor = 'ns';
              break;
            case RIGHT_MIDDLE:
            case LEFT_MIDDLE:
              cursor = 'ew';
              break;
            case LEFT_TOP:
            case RIGHT_BOTTOM:
              cursor = 'nwse';
              break;
            case RIGHT_TOP:
            case LEFT_BOTTOM:
              cursor = 'nesw';
              break;
          }
        }
      } else if (currentBox >= 0) {
        cursor = '';
        currentBox = -1;
      }
      if (cursor != null) {
        emitter.fire(Emitter.ACTIVE_DRAG_BOX_HOVER, {
          name: cursor
        });
      }
    };
    me.mouseUpHandler = function (event) {
      if (currentBox >= 0) {
        currentBox = -1;
        emitter.fire(Emitter.ACTIVE_DRAG_BOX_HOVER, {
          name: ''
        });
      }
      update = targetX = targetY = null;
    };
    me.resetUpHandler = function (event) {
      if (currentBox >= 0) {
        me.mouseUpHandler(event);
      }
      me.setShapes(painter, []);
    };

    me.on(Emitter.CLEAR, me.clearHandler).on(Emitter.SHAPE_ENTER, me.shapeEnterHandler).on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler).on(Emitter.MOUSE_DOWN, me.mouseDownHandler).on(Emitter.MOUSE_MOVE, me.mouseMoveHandler).on(Emitter.MOUSE_UP, me.mouseUpHandler).on(Emitter.RESET, me.resetUpHandler);

    return _this;
  }

  Active.prototype.destroy = function () {
    this.off(Emitter.CLEAR, this.clearHandler).off(Emitter.SHAPE_ENTER, this.shapeEnterHandler).off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler).off(Emitter.MOUSE_DOWN, this.mouseDownHandler).off(Emitter.MOUSE_MOVE, this.mouseMoveHandler).off(Emitter.MOUSE_UP, this.mouseUpHandler).off(Emitter.RESET, this.resetUpHandler);
  };

  Active.prototype.getShapes = function () {
    return this.shapes;
  };

  Active.prototype.setShapes = function (painter, shapes) {
    if (shapes.length > 0) {
      var rect = getUnionRect(shapes.map(function (shape) {
        return shape.getRect(painter);
      }));
      object.extend(this, rect);
    } else {
      this.width = this.height = 0;
    }

    this.shapes = shapes;

    this.emitter.fire(Emitter.ACTIVE_SHAPE_CHANGE, {
      shapes: shapes
    });
  };

  Active.prototype.isPointInPath = function (painter, x, y) {
    var boxes = this.boxes,
        thumbSize = this.thumbSize;

    if (boxes) {
      for (var i = 0, len = boxes.length, tx, ty; i < len; i += 2) {
        tx = boxes[i];
        ty = boxes[i + 1];
        // 扩大响应区域
        if (x >= tx - thumbSize && x <= tx + 2 * thumbSize && y >= ty - thumbSize && y <= ty + 2 * thumbSize) {
          return i / 2;
        }
      }
    }
    return false;
  };

  Active.prototype.draw = function (painter) {
    var shapes = this.shapes,
        x = this.x,
        y = this.y,
        width = this.width,
        height = this.height;
    var length = shapes.length;

    if (!length) {
      return;
    }

    painter.disableShadow();
    painter.setLineWidth(1);

    // 是否只有文字
    // 如果是，不用画九个 thumb
    var textOnly;

    if (length > 1) {
      textOnly = true;
      painter.setStrokeStyle('#C0CED8');
      array.each(shapes, function (shape) {
        var rect = shape.getRect(painter);
        painter.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
        if (textOnly && !isTextShape(shape)) {
          textOnly = false;
        }
      });
    } else {
      textOnly = isTextShape(shapes[0]);
    }

    painter.setStrokeStyle('#ccc');

    // 矩形线框
    painter.begin();
    painter.drawRect(x + 0.5, y + 0.5, width, height);
    painter.stroke();

    if (!textOnly) {
      painter.setStrokeStyle('#a2a2a2');

      // 方块加点阴影
      painter.enableShadow(0, 2, 3, 'rgba(0,0,0,0.2)');

      var thumbSize = this.thumbSize = 6 * constant.DEVICE_PIXEL_RATIO;

      var left = x - thumbSize / 2;
      var center = x + (width - thumbSize) / 2;
      var right = x + width - thumbSize / 2;

      var top = y - thumbSize / 2;
      var middle = y + (height - thumbSize) / 2;
      var bottom = y + height - thumbSize / 2;

      var boxes = [left, top, center, top, right, top, right, middle, right, bottom, center, bottom, left, bottom, left, middle];

      for (var i = 0, len = boxes.length, gradient; i < len; i += 2) {
        x = boxes[i];
        y = boxes[i + 1];
        gradient = painter.createLinearGradient(x, y + thumbSize, x, y);
        gradient.addColorStop(0, '#d6d6d6');
        gradient.addColorStop(1, '#f9f9f9');
        painter.begin();
        painter.setFillStyle(gradient);
        painter.drawRect(x, y, thumbSize, thumbSize);
        painter.stroke();
        painter.fill();
      }

      this.boxes = boxes;

      painter.disableShadow();
    }
  };

  return Active;
}(State);

/**
 * @file Hover 状态
 * @author musicode
 */
var Hover = function (_State) {
  inherits(Hover, _State);

  function Hover(props, emitter) {
    classCallCheck(this, Hover);

    var _this = possibleConstructorReturn(this, _State.call(this, props, emitter));

    var me = _this,
        activeShapes,
        drawing;

    me.shapeEnterHandler = function (event) {
      var shape = event.shape;

      if (!drawing && !shape.state && (!activeShapes || !array.has(activeShapes, shape))) {
        me.shape = shape;
        emitter.fire(Emitter.HOVER_SHAPE_CHANGE, {
          shape: shape
        });
      }
    };

    me.shapeLeaveHandler = function () {
      if (me.shape) {
        me.shape = null;
        emitter.fire(Emitter.HOVER_SHAPE_CHANGE, {
          shape: null
        });
      }
    };

    me.drawingStartHandler = function () {
      drawing = true;
    };

    me.drawingEndHandler = function () {
      drawing = false;
    };

    me.activeShapeChangeHandler = function (events) {
      activeShapes = events.shapes;
      if (array.has(activeShapes, me.shape)) {
        me.shape = null;
      }
    };

    me.resetHandler = function () {
      me.shape = null;
    };

    me.on(Emitter.SHAPE_ENTER, me.shapeEnterHandler).on(Emitter.SHAPE_LEAVE, me.shapeLeaveHandler).on(Emitter.SHAPE_DRAWING_START, me.drawingStartHandler).on(Emitter.SHAPE_DRAWING_END, me.drawingEndHandler).on(Emitter.ACTIVE_SHAPE_CHANGE, me.activeShapeChangeHandler).on(Emitter.RESET, me.resetHandler);
    return _this;
  }

  Hover.prototype.destroy = function () {
    this.off(Emitter.SHAPE_ENTER, this.shapeEnterHandler).off(Emitter.SHAPE_LEAVE, this.shapeLeaveHandler).off(Emitter.SHAPE_DRAWING_START, this.drawingStartHandler).off(Emitter.SHAPE_DRAWING_END, this.drawingEndHandler).off(Emitter.ACTIVE_SHAPE_CHANGE, this.activeShapeChangeHandler).off(Emitter.RESET, this.resetHandler);
  };

  Hover.prototype.isPointInPath = function (painter, x, y) {
    return false;
  };

  Hover.prototype.draw = function (painter) {
    var shape = this.shape,
        hoverThickness = this.hoverThickness,
        hoverColor = this.hoverColor;

    if (!shape) {
      return;
    }

    painter.disableShadow();

    painter.setLineWidth(hoverThickness * constant.DEVICE_PIXEL_RATIO);
    painter.setStrokeStyle(hoverColor);

    painter.begin();
    shape.drawPath(painter);
    painter.stroke();
  };

  return Hover;
}(State);

/**
 * @file 正在绘制
 * @author musicode
 */

var Drawing = function (_State) {
  inherits(Drawing, _State);

  function Drawing(props, emitter, painter) {
    classCallCheck(this, Drawing);

    var _this = possibleConstructorReturn(this, _State.call(this, props, emitter));

    var me = _this,
        drawingShape,
        moving,
        saved,
        startX,
        startY;

    // 提供两种清空画布的方式
    // 1. 还原鼠标按下时保存的画布
    // 2. 全量刷新画布
    var restore = function () {
      if (!saved) {
        saved = painter.save();
      } else {
        painter.restore(saved);
      }
    };

    var drawing = function () {
      emitter.fire(Emitter.SHAPE_DRAWING);
    };

    me.mouseDownHandler = function (event) {
      if (event.inCanvas) {
        moving = 0;
        startX = Math.floor(event.x);
        startY = Math.floor(event.y);
        drawingShape = new me.createShape();
        if (drawingShape.startDrawing && drawingShape.startDrawing(painter, emitter, event) === false) {
          drawingShape = null;
        } else {
          emitter.fire(Emitter.SHAPE_DRAWING_START, {
            cursor: 'crosshair'
          });
        }
      }
    };
    me.mouseMoveHandler = function (event) {
      if (drawingShape && drawingShape.drawing) {
        moving++;
        drawingShape.drawing(painter, startX, startY, Math.floor(event.x), Math.floor(event.y), restore);
      }
    };
    me.mouseUpHandler = function () {
      if (saved) {
        saved = null;
      }
      if (drawingShape) {
        if (drawingShape.endDrawing) {
          drawingShape.endDrawing();
          return;
        }
        emitter.fire(Emitter.SHAPE_DRAWING_END, {
          shape: moving > 0 ? drawingShape : null
        });
        drawingShape = null;
      }
    };

    me.on(Emitter.MOUSE_DOWN, me.mouseDownHandler).on(Emitter.MOUSE_MOVE, me.mouseMoveHandler).on(Emitter.MOUSE_UP, me.mouseUpHandler).on(Emitter.RESET, me.mouseUpHandler);

    return _this;
  }

  Drawing.prototype.destroy = function () {
    this.off(Emitter.MOUSE_DOWN, this.mouseDownHandler).off(Emitter.MOUSE_MOVE, this.mouseMoveHandler).off(Emitter.MOUSE_UP, this.mouseUpHandler).off(Emitter.RESET, this.mouseUpHandler);
  };

  Drawing.prototype.isPointInPath = function (painter, x, y) {
    return false;
  };

  return Drawing;
}(State);

/**
 * @file 创建随机数
 * @author musicode
 */
var randomInt = function (length) {
  var min = Math.pow(10, length - 1);
  var max = Math.pow(10, length) - 1;
  return min + Math.floor(Math.random() * (max - min));
};

/**
 * @file 两个矩形的交集
 * @author musicode
 */
var getInterRect = function (rect1, rect2) {
  var left = Math.max(rect1.x, rect2.x);
  var top = Math.max(rect1.y, rect2.y);
  var right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  var bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  if (right - left >= 0 && bottom - top >= 0) {
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }
};

/**
 * @file 转换图形尺寸
 * @author musicode
 */

var convertDimension = function (shapes, oldWidth, oldHeight, newWidth, newHeight) {

  var widthRatio = newWidth / oldWidth;
  var heightRatio = newHeight / oldHeight;

  if (widthRatio !== 1 || heightRatio !== 1) {
    array.each(shapes, function (shape) {
      if (widthRatio !== 1) {
        if (shape.x) {
          shape.x *= widthRatio;
        }
        if (shape.width) {
          shape.width *= widthRatio;
        }
        if (shape.fontSize) {
          shape.fontSize *= widthRatio;
        }
      }
      if (heightRatio !== 1) {
        if (shape.y) {
          shape.y *= heightRatio;
        }
        if (shape.height) {
          shape.height *= heightRatio;
        }
      }
      if (shape.points) {
        array.each(shape.points, function (point) {
          if (point.x) {
            point.x *= widthRatio;
          }
          if (point.y) {
            point.y *= heightRatio;
          }
        });
      }
    });
  }
};

/**
 * @file 画笔
 * @author musicode
 */
var Painter = function () {
  function Painter(context) {
    classCallCheck(this, Painter);

    this.context = context;
  }

  Painter.prototype.getCanvasSize = function () {
    var _context$canvas = this.context.canvas,
        width = _context$canvas.width,
        height = _context$canvas.height;

    return {
      width: width,
      height: height
    };
  };

  Painter.prototype.begin = function () {
    this.context.beginPath();
  };

  Painter.prototype.close = function () {
    this.context.closePath();
  };

  Painter.prototype.drawRect = function (x, y, width, height) {
    this.context.rect(x, y, width, height);
  };

  Painter.prototype.drawOval = function (x, y, width, height) {
    var context = this.context;

    if (width === height) {
      var radius = width / 2;
      context.moveTo(x + radius, y);
      context.arc(x, y, radius, 0, 2 * Math.PI, true);
    } else {
      var _context = this.context;

      if (width === height) {
        var _radius = width / 2;
        _context.moveTo(x + _radius, y);
        _context.arc(x, y, _radius, 0, 2 * Math.PI, true);
      } else {
        var _w = width / 0.75 / 2,
            _h = height / 2;
        var points = [{
          x: x,
          y: y - _h
        }, {
          x: x + _w,
          y: y - _h
        }, {
          x: x + _w,
          y: y + _h
        }, {
          x: x,
          y: y + _h
        }, {
          x: x - _w,
          y: y + _h
        }, {
          x: x - _w,
          y: y - _h
        }];
        _context.moveTo(points[0].x, points[0].y);
        _context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        _context.bezierCurveTo(points[4].x, points[4].y, points[5].x, points[5].y, points[0].x, points[0].y);
      }
      var w = width / 0.75 / 2,
          h = height / 2;
      _context.moveTo(x, y - h);
      _context.bezierCurveTo(x + w, y - h, x + w, y + h, x, y + h);
      _context.bezierCurveTo(x - w, y + h, x - w, y - h, x, y - h);
    }
  };

  Painter.prototype.drawPoints = function (points) {
    var length = points.length;

    if (length > 1) {
      var point = points[0];
      this.moveTo(point.x, point.y);
      for (var i = 1; i < length; i++) {
        point = points[i];
        this.lineTo(point.x, point.y);
      }
    }
  };

  Painter.prototype.stroke = function () {
    this.context.stroke();
  };

  Painter.prototype.fill = function () {
    this.context.fill();
  };

  Painter.prototype.strokeRect = function (x, y, width, height) {
    this.context.strokeRect(x, y, width, height);
  };

  Painter.prototype.fillRect = function (x, y, width, height) {
    this.context.fillRect(x, y, width, height);
  };

  Painter.prototype.strokeText = function (x, y, text) {
    this.context.strokeText(text, x, y);
  };

  Painter.prototype.fillText = function (x, y, text) {
    this.context.fillText(text, x, y);
  };

  Painter.prototype.measureText = function (text) {
    return this.context.measureText(text);
  };

  Painter.prototype.isPointInPath = function (x, y) {
    return this.context.isPointInPath(x, y);
  };

  Painter.prototype.clear = function () {
    var context = this.context;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  Painter.prototype.moveTo = function (x, y) {
    this.context.moveTo(x, y);
  };

  Painter.prototype.lineTo = function (x, y) {
    this.context.lineTo(x, y);
  };

  Painter.prototype.arc = function (x, y, radius, startAngle, endAngle, CCW) {
    this.context.arc(x, y, radius, startAngle, endAngle, CCW);
  };

  Painter.prototype.bezierCurveTo = function (x1, y1, x2, y2, x, y) {
    this.context.bezierCurveTo(x1, y1, x2, y2, x, y);
  };

  Painter.prototype.createLinearGradient = function (x1, y1, x2, y2) {
    return this.context.createLinearGradient(x1, y1, x2, y2);
  };

  Painter.prototype.enableShadow = function (offsetX, offsetY, blur, color) {
    this.setShadowColor(color);
    this.setShadowOffsetX(offsetX);
    this.setShadowOffsetY(offsetY);
    this.setShadowBlur(blur);
  };

  Painter.prototype.disableShadow = function () {
    this.setShadowColor(0);
    this.setShadowOffsetX(0);
    this.setShadowOffsetY(0);
    this.setShadowBlur(0);
  };

  Painter.prototype.save = function () {
    var context = this.context;
    var _context$canvas2 = context.canvas,
        width = _context$canvas2.width,
        height = _context$canvas2.height;

    if (context.getImageData && width > 0 && height > 0) {
      return context.getImageData(0, 0, width, height);
    }
  };

  Painter.prototype.restore = function (data) {
    var context = this.context;

    if (context.putImageData && data) {
      context.putImageData(data, 0, 0);
    }
  };

  Painter.prototype.setFont = function (fontSize, fontFamily, fontItalic, fontWeight) {
    var styles = [];
    if (fontItalic) {
      styles.push('italic');
    }
    if (fontWeight) {
      styles.push('bold');
    }
    styles.push(fontSize + 'px', fontFamily);
    this.context.font = styles.join(' ');
  };

  return Painter;
}();

var prototype = Painter.prototype;


array.each(['lineWidth', 'lineJoin', 'lineCap', 'strokeStyle', 'fillStyle', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur'], function (name) {
  prototype['set' + name.charAt(0).toUpperCase() + name.slice(1)] = function (value) {
    var context = this.context;

    if (context[name] !== value) {
      context[name] = value;
    }
  };
});

/**
 * @file 判断点是否在线段内
 * @author musicode
 */

/**
 * @param {number} startX 线段的起始横坐标
 * @param {number} startY 线段的起始纵坐标
 * @param {number} endX 线段的结束横坐标
 * @param {number} endY 线段的结束纵坐标
 * @param {number} lineWidth 线条粗细
 * @param {number} x 测试点的横坐标
 * @param {number} y 测试点的纵坐标
 * @return {boolean}
 */
var containLine = function (startX, startY, endX, endY, lineWidth, x, y) {

  if (!lineWidth) {
    return false;
  }

  var halfWidth = lineWidth / 2;

  if (x > startX + halfWidth && x > endX + halfWidth || x < startX - halfWidth && x < endX - halfWidth || y > startY + halfWidth && y > endY + halfWidth || y < startY - halfWidth && y < endY - halfWidth) {
    return false;
  }

  // 直线方程
  //
  // 点斜式  y = kx + b
  // 适用范围：直线不垂直于 x 轴
  //
  // 因此先排除直线垂直于 x 轴的情况
  if (startX === endX) {
    return Math.abs(x - startX) <= halfWidth;
  }

  // 求出公式 y = kx + b 中的 k 和 b
  var k = (endY - startY) / (endX - startX);
  var b = (startX * endY - endX * startY) / (startX - endX);

  // 然后运用点到直线距离公式
  // s 表示点到直线距离的平方
  var s = Math.pow(k * x - y + b, 2) / (k * k + 1);

  // 点到直线的距离应该 <= lineWidth / 2
  return s <= Math.pow(halfWidth, 2);
};

/**
 * @file 判断点是否在矩形内
 * @author musicode
 */

/**
 * @param {Object} rect
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
var containRect = function (rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
};

/**
 * @file 多个矩形的并集
 * @author musicode
 */
var getRectByPoints = function (points) {
  var length = points.length,
      startX = 0,
      startY = 0,
      endX = 0,
      endY = 0;

  if (length > 0) {

    var point = points[0];
    startX = endX = point.x;
    startY = endY = point.y;

    for (var i = 1; i < length; i++) {
      point = points[i];
      if (point.x < startX) {
        startX = point.x;
      } else if (point.x > endX) {
        endX = point.x;
      }
      if (point.y < startY) {
        startY = point.y;
      } else if (point.y > endY) {
        endY = point.y;
      }
    }
  }

  return {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY
  };
};

/**
 * @file 图形基类
 * @author musicode
 */
// 避免太小无法进行碰撞检测
var SIZE_MIN = 5;

/**
 * 图形是点的集合
 * 因此图形基类默认通过 points 进行绘制
 * 对于特殊图形，可通过子类改写某些方法实现
 */

function isValidStyle(style) {
  return style && style !== 'transparent';
}

var Shape = function () {
  function Shape(props) {
    classCallCheck(this, Shape);

    object.extend(this, props);
  }

  /**
   * 点是否位于图形范围内
   *
   * @param {Painter} painter
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */


  Shape.prototype.isPointInPath = function (painter, x, y) {

    var rect = this.getRect(painter);

    if (!rect.width) {
      rect.x -= SIZE_MIN / 2;
      rect.width = SIZE_MIN;
    }

    if (!rect.height) {
      rect.y -= SIZE_MIN / 2;
      rect.height = SIZE_MIN;
    }

    if (containRect(rect, x, y)) {
      if (isValidStyle(this.fillStyle) && this.isPointInFill) {
        return this.isPointInFill(painter, x, y);
      }
      return this.isPointInStroke(painter, x, y);
    }

    return false;
  };

  Shape.prototype.isPointInStroke = function (painter, x, y) {
    var lineWidth = this.lineWidth,
        points = this.points;

    if (lineWidth < SIZE_MIN) {
      lineWidth = SIZE_MIN;
    }

    for (var i = 0, len = points.length; i < len; i++) {
      if (points[i + 1] && containLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, lineWidth * constant.DEVICE_PIXEL_RATIO, x, y)) {
        return true;
      }
    }
    return false;
  };

  /**
   * 绘制图形
   *
   * @param {Painter} painter
   */


  Shape.prototype.draw = function (painter) {

    var needFill = this.fill && isValidStyle(this.fillStyle);
    var needStroke = this.lineWidth && isValidStyle(this.strokeStyle);

    if (needFill || needStroke) {

      if (needFill) {
        if (!needStroke) {
          this.applyShadow(painter);
        }
        this.fill(painter);
      }

      if (needStroke) {
        this.applyShadow(painter);
        this.setLineStyle(painter);
        this.stroke(painter);
      }
    }
  };

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */


  Shape.prototype.drawPath = function (painter) {
    painter.drawPoints(this.points);
  };

  /**
   * 描边
   *
   * @param {Painter} painter
   */


  Shape.prototype.stroke = function (painter) {
    painter.setLineWidth(this.lineWidth * constant.DEVICE_PIXEL_RATIO);
    painter.setStrokeStyle(this.strokeStyle);
    painter.begin();
    this.drawPath(painter);
    painter.stroke();
  };

  Shape.prototype.applyShadow = function (painter) {
    if (this.shadowColor) {
      painter.enableShadow(this.shadowOffsetX, this.shadowOffsetY, this.shadowBlur, this.shadowColor);
    } else {
      painter.disableShadow();
    }
  };

  Shape.prototype.setLineStyle = function (painter) {};

  Shape.prototype.save = function (rect) {
    return this.points.map(function (point) {
      return {
        x: (point.x - rect.x) / rect.width,
        y: (point.y - rect.y) / rect.height
      };
    });
  };

  Shape.prototype.restore = function (rect, data) {
    array.each(this.points, function (point, i) {
      point.x = rect.x + rect.width * data[i].x;
      point.y = rect.y + rect.height * data[i].y;
    });
  };

  Shape.prototype.getRect = function () {
    return getRectByPoints(this.points);
  };

  Shape.prototype.clone = function () {
    return new this.constructor(object.copy(this, true));
  };

  Shape.prototype.toJSON = function (extra) {
    var json = {
      number: this.number,
      lineWidth: this.lineWidth,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle
    };
    if (this.points) {
      json.points = this.points;
    }
    if (extra) {
      object.extend(json, extra);
    }
    return json;
  };

  return Shape;
}();

/**
 * @file 抄来的...
 * @author musicode
 */
var windingLine = function (x0, y0, x1, y1, x, y) {

    if (y > y0 && y > y1 || y < y0 && y < y1) {
        return 0;
    }
    // Ignore horizontal line
    if (y1 === y0) {
        return 0;
    }
    var dir = y1 < y0 ? 1 : -1;
    var t = (y - y0) / (y1 - y0);

    // Avoid winding error when intersection point is the connect point of two line of polygon
    if (t === 1 || t === 0) {
        dir = y1 < y0 ? 0.5 : -0.5;
    }

    var x_ = t * (x1 - x0) + x0;

    return x_ > x ? dir : 0;
};

var EPSILON = 1e-8;

function isAroundEqual(a, b) {
    return Math.abs(a - b) < EPSILON;
}

var containPolygon = function (points, x, y) {
    var w = 0;
    var p = points[0];

    if (!p) {
        return false;
    }

    for (var i = 1; i < points.length; i++) {
        var p2 = points[i];
        w += windingLine(p.x, p.y, p2.x, p2.y, x, y);
        p = p2;
    }

    // Close polygon
    var p0 = points[0];
    if (!isAroundEqual(p.x, p0.x) || !isAroundEqual(p.y, p0.y)) {
        w += windingLine(p.x, p.y, p0.x, p0.y, x, y);
    }

    return w !== 0;
};

/**
 * @file 偏移点坐标，用于实现内外描边
 * @author musicode
 */
var getOffsetPoints = function (points, offset) {
  var result = [],
      length = points.length;

  // 前一个点
  var px = points[length - 1].x,
      py = points[length - 1].y;
  for (var i = 0; i < length; i++) {
    var _points$i = points[i],
        x = _points$i.x,
        y = _points$i.y;


    var next = (i + 1) % length;

    // 后一个点
    var nx = points[next].x,
        ny = points[next].y;

    var dx0 = x - px,
        dy0 = y - py;

    // 求单位向量
    var l = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    dx0 /= l;
    dy0 /= l;

    var dx1 = x - nx,
        dy1 = y - ny;

    // 求单位向量
    l = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    dx1 /= l;
    dy1 /= l;

    // 相加两个向量计算出顶点需要移动的位置
    var moveX = dx0 + dx1,
        moveY = dy0 + dy1;

    // 求单位向量
    l = Math.sqrt(moveX * moveX + moveY * moveY);
    moveX /= l;
    moveY /= l;

    // 点乘得到拐角的 cos 值
    var cosTheta = dx0 * moveX + dy0 * moveY,
        sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

    array.push(result, {
      x: x + offset * moveX / sinTheta,
      y: y + offset * moveY / sinTheta
    });

    px = x;
    py = y;
  }

  return result;
};

/**
 * @file 获取两点的距离
 * @author musicode
 */

var getDistance = function (startX, startY, endX, endY) {

  var dx = endX - startX,
      dy = endY - startY;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @file 获取圆上的点
 * @author musicode
 */
var getPointOfCircle = function (x, y, radius, radian) {
  return {
    x: Math.floor(x + radius * Math.cos(radian)),
    y: Math.floor(y + radius * Math.sin(radian))
  };
};

/**
 * @file 多边形
 * @author musicode
 */

var PI2 = 2 * Math.PI;

/**
 * count 几边形
 * points 点的数组
 */

var Polygon = function (_Shape) {
  inherits(Polygon, _Shape);

  function Polygon() {
    classCallCheck(this, Polygon);
    return possibleConstructorReturn(this, _Shape.apply(this, arguments));
  }

  Polygon.prototype.isPointInFill = function (painter, x, y) {
    return containPolygon(this.points, x, y);
  };

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */


  Polygon.prototype.drawPath = function (painter) {
    painter.drawPoints(this.points);
    painter.close();
  };

  /**
   * 描边
   *
   * @param {Painter} painter
   */


  Polygon.prototype.stroke = function (painter) {
    var points = this.points,
        strokePosition = this.strokePosition,
        lineWidth = this.lineWidth,
        strokeStyle = this.strokeStyle;


    lineWidth *= constant.DEVICE_PIXEL_RATIO;

    painter.setLineWidth(lineWidth);
    painter.setStrokeStyle(strokeStyle);
    painter.begin();

    if (strokePosition === constant.STROKE_POSITION_INSIDE) {
      points = getOffsetPoints(points, lineWidth / -2);
    } else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
      points = getOffsetPoints(points, lineWidth / 2);
    }

    painter.drawPoints(points);
    painter.close();

    painter.stroke();
  };

  /**
   * 填充
   *
   * @param {Painter} painter
   */


  Polygon.prototype.fill = function (painter) {
    painter.setFillStyle(this.fillStyle);
    painter.begin();
    this.drawPath(painter);
    painter.fill();
  };

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */


  Polygon.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    var count = this.count;


    var radius = getDistance(startX, startY, endX, endY);

    // 单位旋转的角度
    var stepRadian = PI2 / count;

    var points = [];

    var radian = Math.atan2(endY - startY, endX - startX),
        endRadian = radian + PI2;

    do {
      array.push(points, getPointOfCircle(startX, startY, radius, radian));
      radian += stepRadian;
    } while (radian <= endRadian);

    if (points.length - count === 1) {
      array.pop(points);
    }

    this.points = points;

    this.draw(painter);
  };

  Polygon.prototype.validate = function () {
    var rect = this.getRect();
    return rect.width > 5 && rect.height > 5;
  };

  Polygon.prototype.toJSON = function () {
    return _Shape.prototype.toJSON.call(this, {
      name: 'Polygon'
    });
  };

  return Polygon;
}(Shape);

/**
 * @file 旋转后的点
 * @author musicode
 */
var getRotatePoints = function (x, y, radian, points) {
  return points.map(function (point) {
    return {
      x: Math.floor((point.x - x) * Math.cos(radian) - (point.y - y) * Math.sin(radian) + x),
      y: Math.floor((point.x - x) * Math.sin(radian) + (point.y - y) * Math.cos(radian) + y)
    };
  });
};

/**
 * @file 箭头
 * @author musicode
 */

var RADIANS = Math.PI / 180;

/**
 * points 点数组
 * thickness 箭头粗细
 */

var Arrow = function (_Polygon) {
  inherits(Arrow, _Polygon);

  function Arrow() {
    classCallCheck(this, Arrow);
    return possibleConstructorReturn(this, _Polygon.apply(this, arguments));
  }

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */
  Arrow.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    var thickness = this.thickness;

    var distance = getDistance(startX, startY, endX, endY);

    // 下面这些数字都是不断尝试调出的参数，没有理由，就是试
    var threshold = thickness * 20,
        header;

    if (distance < threshold) {
      thickness *= distance / threshold;
      header = distance / 3;
    } else {
      header = distance / 8;
      if (header > 50) {
        header = 50;
      }
    }

    var points = [];
    var double = this.double;

    var arrowRadians = 70;
    var arrowRadius = 0.5 * header;
    var arrowDistance = Math.cos(arrowRadians * RADIANS) * arrowRadius;

    var drawSingleArrow = function (point) {
      array.push(points, point);
      point = {
        x: point.x + distance - header,
        y: point.y
      };
      if (double) {
        point.x -= header;
      }
      array.push(points, point);
      array.push(points, getPointOfCircle(point.x, point.y, arrowRadius, (180 + arrowRadians) * RADIANS));
      array.push(points, {
        x: startX + distance,
        y: startY
      });
    };

    if (double) {
      array.push(points, {
        x: startX,
        y: startY
      });
      var point = {
        x: startX + header,
        y: startY - thickness
      };
      array.push(points, getPointOfCircle(point.x, point.y, arrowRadius, (360 - arrowRadians) * RADIANS));
      drawSingleArrow(point);
    } else {
      drawSingleArrow({
        x: startX,
        y: startY - thickness
      });
    }

    for (var i = points.length - 2; i >= 0; i--) {
      points.push({
        x: points[i].x,
        y: 2 * startY - points[i].y
      });
    }

    this.points = getRotatePoints(startX, startY, Math.atan2(endY - startY, endX - startX), points);

    this.draw(painter);
  };

  Arrow.prototype.toJSON = function () {
    return _Polygon.prototype.toJSON.call(this, {
      name: 'Polygon'
    });
  };

  return Arrow;
}(Polygon);

/**
 * @file 涂鸦
 * @author musicode
 */

/**
 * points 点数组
 */

var Doodle = function (_Shape) {
  inherits(Doodle, _Shape);

  function Doodle() {
    classCallCheck(this, Doodle);
    return possibleConstructorReturn(this, _Shape.apply(this, arguments));
  }

  Doodle.prototype.setLineStyle = function (painter) {
    painter.setLineJoin('round');
    painter.setLineCap('round');
  };

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   */


  Doodle.prototype.drawing = function (painter, startX, startY, endX, endY) {

    var points = this.points || (this.points = [{ x: startX, y: startY }]);

    painter.disableShadow();
    painter.begin();

    if (points.length === 1) {
      this.setLineStyle(painter);
      painter.setLineWidth(this.lineWidth * constant.DEVICE_PIXEL_RATIO);
      painter.setStrokeStyle(this.strokeStyle);
    }

    // 每次取最后 2 个点进行绘制，这样才不会有断裂感
    painter.drawPoints(points.slice(points.length - 2));
    painter.lineTo(endX, endY);
    painter.stroke();

    array.push(points, {
      x: endX,
      y: endY
    });
  };

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */


  Doodle.prototype.drawPath = function (painter) {
    painter.drawPoints(this.points);
  };

  Doodle.prototype.toJSON = function () {
    return _Shape.prototype.toJSON.call(this, {
      name: 'Doodle'
    });
  };

  return Doodle;
}(Shape);

/**
 * @file 桃心
 * @author wangtianhua
 */
var heart = {
  getOffsetX: function getOffsetX(x, radius, radian) {
    return x + radius * (16 * Math.pow(Math.sin(radian), 3));
  },
  getOffsetY: function getOffsetY(y, radius, radian) {
    return y - radius * (13 * Math.cos(radian) - 5 * Math.cos(2 * radian) - 2 * Math.cos(3 * radian) - Math.cos(4 * radian));
  }
};

/**
 * @file 桃心
 * @author wangtianhua
 */

var PI = Math.PI;
var PI2$1 = PI * 2;

var Heart = function (_Polygon) {
  inherits(Heart, _Polygon);

  function Heart() {
    classCallCheck(this, Heart);
    return possibleConstructorReturn(this, _Polygon.apply(this, arguments));
  }

  Heart.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    this.x = startX;
    this.y = startY;
    this.width = this.height = 2 * getDistance(startX, startY, endX, endY);

    var width = getDistance(startX, 0, endX, 0);
    var height = getDistance(0, startY, 0, endY);

    var points = [],
        radius = width / 32;

    var radian = PI,
        stepRadian = PI2$1 / Math.max(radius * 16, 30),
        endRadian = -PI;

    array.push(points, {
      x: heart.getOffsetX(this.x + width / 2, radius, radian),
      y: heart.getOffsetY(this.y, radius, radian)
    });
    do {
      array.push(points, {
        x: heart.getOffsetX(this.x + width / 2, radius, radian),
        y: heart.getOffsetY(this.y, radius, radian)
      });
      radian -= stepRadian;
    } while (radian >= endRadian);
    this.points = points;
    this.draw(painter);
  };

  Heart.prototype.validate = function () {
    return this.width > 5 && this.height > 5;
  };

  Heart.prototype.toJSON = function () {
    return _Polygon.prototype.toJSON.call(this, {
      name: 'Polygon'
    });
  };

  return Heart;
}(Polygon);

/**
 * @file 椭圆
 * @author musicode
 */

/**
 * points 点数组
 */

var Line = function (_Shape) {
  inherits(Line, _Shape);

  function Line() {
    classCallCheck(this, Line);
    return possibleConstructorReturn(this, _Shape.apply(this, arguments));
  }

  Line.prototype.setLineStyle = function (painter) {
    painter.setLineCap('square');
  };

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */


  Line.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    var points = this.points || (this.points = [{ x: startX, y: startY }]);
    points[1] = { x: endX, y: endY };
    this.draw(painter);
  };

  Line.prototype.validate = function () {
    var points = this.points;

    return points && points.length === 2;
  };

  Line.prototype.toJSON = function () {
    return _Shape.prototype.toJSON.call(this, {
      name: 'Doodle'
    });
  };

  return Line;
}(Shape);

/**
 * @file 椭圆
 * @author musicode
 */
/**
 * (x, y) 圆心
 * width 宽
 * height 高
 */

var Oval = function (_Shape) {
  inherits(Oval, _Shape);

  function Oval() {
    classCallCheck(this, Oval);
    return possibleConstructorReturn(this, _Shape.apply(this, arguments));
  }

  /**
   * 点是否位于图形范围内
   *
   * @param {Painter} painter
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  Oval.prototype.isPointInFill = function (painter, x, y) {
    painter.begin();
    this.drawPath(painter);
    return painter.isPointInPath(x, y);
  };

  Oval.prototype.isPointInStroke = function (painter, x1, y1) {
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height,
        strokeStyle = this.strokeStyle,
        strokePosition = this.strokePosition,
        lineWidth = this.lineWidth;


    switch (strokePosition) {
      case constant.STROKE_POSITION_OUTSIDE:
        painter.begin();
        painter.drawOval(x, y, width, height);
        return painter.isPointInPath(x1, y1);
      case constant.STROKE_POSITION_CENTER:
        painter.begin();
        painter.drawOval(x, y, width, height);
        if (painter.isPointInPath(x1, y1)) {
          width -= lineWidth;
          height -= lineWidth;
          painter.begin();
          painter.drawOval(x, y, width, height);
          return !painter.isPointInPath(x1, y1);
        }
        break;
      case constant.STROKE_POSITION_INSIDE:
        painter.begin();
        painter.drawOval(x, y, width, height);
        if (painter.isPointInPath(x1, y1)) {
          width -= 2 * lineWidth;
          height -= 2 * lineWidth;
          painter.begin();
          painter.drawOval(x, y, width, height);
          return !painter.isPointInPath(x1, y1);
        }
        break;
    }

    return false;
  };

  /**
   * 绘制路径
   *
   * @param {Painter} painter
   */


  Oval.prototype.drawPath = function (painter) {
    painter.drawOval(this.x, this.y, this.width, this.height);
  };

  /**
   * 描边
   *
   * @param {Painter} painter
   */


  Oval.prototype.stroke = function (painter) {
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height,
        strokeStyle = this.strokeStyle,
        strokePosition = this.strokePosition,
        lineWidth = this.lineWidth;

    // Canvas 的描边机制是 center

    // inside

    if (strokePosition === constant.STROKE_POSITION_INSIDE) {
      width -= lineWidth;
      height -= lineWidth;
      if (width < 0 || height < 0) {
        return;
      }
    }
    // outside
    else if (strokePosition === constant.STROKE_POSITION_OUTSIDE) {
        width += lineWidth;
        height += lineWidth;
      }

    painter.setLineWidth(lineWidth);
    painter.setStrokeStyle(strokeStyle);
    painter.begin();
    painter.drawOval(x, y, width, height);
    painter.stroke();
  };

  /**
   * 填充
   *
   * @param {Painter} painter
   */


  Oval.prototype.fill = function (painter) {
    painter.setFillStyle(this.fillStyle);
    painter.begin();
    this.drawPath(painter);
    painter.fill();
  };

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */


  Oval.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    this.x = startX;
    this.y = startY;
    this.width = this.height = 2 * getDistance(startX, startY, endX, endY);
    this.draw(painter);
  };

  Oval.prototype.save = function (rect) {
    return {
      x: (this.x - rect.x) / rect.width,
      y: (this.y - rect.y) / rect.height,
      width: this.width / rect.width,
      height: this.height / rect.height
    };
  };

  Oval.prototype.restore = function (rect, data) {
    this.x = rect.x + rect.width * data.x;
    this.y = rect.y + rect.height * data.y;
    this.width = rect.width * data.width;
    this.height = rect.height * data.height;
  };

  Oval.prototype.validate = function () {
    return this.width > 5 && this.height > 5;
  };

  Oval.prototype.getRect = function () {
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height;

    return {
      x: x - width / 2,
      y: y - height / 2,
      width: width,
      height: height
    };
  };

  Oval.prototype.toJSON = function () {
    return _Shape.prototype.toJSON.call(this, {
      name: 'Oval',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    });
  };

  return Oval;
}(Shape);

/**
 * @file 多个矩形的并集
 * @author musicode
 */
var getRect = function (startX, startY, endX, endY) {

  var x,
      y,
      width,
      height;

  if (startX < endX) {
    x = startX;
    width = endX - startX;
  } else {
    x = endX;
    width = startX - endX;
  }

  if (startY < endY) {
    y = startY;
    height = endY - startY;
  } else {
    y = endY;
    height = startY - endY;
  }

  return { x: x, y: y, width: width, height: height };
};

/**
 * @file 矩形
 * @author musicode
 */

/**
 * points
 */

var Rect = function (_Polygon) {
  inherits(Rect, _Polygon);

  function Rect() {
    classCallCheck(this, Rect);
    return possibleConstructorReturn(this, _Polygon.apply(this, arguments));
  }

  /**
   * 正在绘制
   *
   * @param {Painter} painter
   * @param {number} startX 起始点 x 坐标
   * @param {number} startY 起始点 y 坐标
   * @param {number} endX 结束点 x 坐标
   * @param {number} endX 结束点 y 坐标
   * @param {Function} 还原为鼠标按下时的画布
   */
  Rect.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {
    restore();

    var points = this.points || (this.points = []);

    var rect = getRect(startX, startY, endX, endY);

    points[0] = { x: rect.x, y: rect.y };
    points[1] = { x: rect.x + rect.width, y: rect.y };
    points[2] = { x: rect.x + rect.width, y: rect.y + rect.height };
    points[3] = { x: rect.x, y: rect.y + rect.height };

    this.draw(painter);
  };

  Rect.prototype.toJSON = function () {
    return _Polygon.prototype.toJSON.call(this, {
      name: 'Polygon'
    });
  };

  return Rect;
}(Polygon);

/**
 * @file 内多边形
 * @author wangtianhua
 */
var PI2$2 = 2 * Math.PI;

var Star = function (_Polygon) {
  inherits(Star, _Polygon);

  function Star() {
    classCallCheck(this, Star);
    return possibleConstructorReturn(this, _Polygon.apply(this, arguments));
  }

  Star.prototype.drawing = function (painter, startX, startY, endX, endY, restore) {

    restore();

    var count = this.count,
        radius = this.radius;


    var outerRadius = getDistance(startX, startY, endX, endY);
    var stepRadian = PI2$2 / count;
    var innerRadius = radius;

    if (!innerRadius) {
      innerRadius = outerRadius / 2;
    }

    var points = [];

    var radian = Math.atan2(endY - startY, endX - startX),
        endRadian = radian + PI2$2;
    do {
      array.push(points, getPointOfCircle(startX, startY, outerRadius, radian));
      array.push(points, getPointOfCircle(startX, startY, innerRadius, radian + stepRadian / 2));
      radian += stepRadian;
    } while (radian <= endRadian);

    if (points.length - count * 2 === 2) {
      array.pop(points);
    }
    this.points = points;

    this.draw(painter);
  };

  Star.prototype.validate = function () {
    var rect = this.getRect();
    return rect.width > 5 && rect.height > 5;
  };

  Star.prototype.toJSON = function () {
    return _Polygon.prototype.toJSON.call(this, {
      name: 'Polygon'
    });
  };

  return Star;
}(Polygon);

/**
 * @file 文字
 * @author wangtianhua
 */
var TRANSPARENT = 'rgba(0,0,0,0)';

var textarea;
var p;

function getLineHeight(fontSize) {
  return fontSize + fontSize / 6;
}

function getTextSize(shape, text) {
  var fontSize = shape.fontSize,
      fontFamily = shape.fontFamily,
      x = shape.x,
      y = shape.y;

  var parentElement = document.body;
  p = document.createElement('p');
  p.style.cssText = '\n    position: absolute;\n    visibility: hidden;\n    font: ' + fontSize + 'px ' + fontFamily + ';\n    line-height: ' + getLineHeight(fontSize) + 'px;\n  ';
  parentElement.appendChild(p);

  var lines = (text + '').split('\n');
  if (lines[lines.length - 1] === '') {
    lines[lines.length - 1] = 'W';
  }

  p.innerHTML = lines.join('<br>');

  var _p = p,
      offsetWidth = _p.offsetWidth,
      offsetHeight = _p.offsetHeight;


  parentElement.removeChild(p);

  return {
    // 避免小数问题导致换行
    width: offsetWidth + 1,
    height: offsetHeight
  };
}

function createTextarea(painter, emitter, event, shape) {
  var fontSize = shape.fontSize,
      fontFamily = shape.fontFamily,
      x = shape.x,
      y = shape.y,
      fontItalic = shape.fontItalic,
      fontWeight = shape.fontWeight,
      caretColor = shape.caretColor,
      fillStyle = shape.fillStyle;

  var parentElement = document.body;
  var fontHeight = getTextSize(shape, 'W').height;

  var dpr = constant.DEVICE_PIXEL_RATIO;

  var _painter$getCanvasSiz = painter.getCanvasSize(),
      width = _painter$getCanvasSiz.width,
      height = _painter$getCanvasSiz.height;

  var maxWidth = (width - shape.x) / dpr;
  var maxHeight = (height - shape.y) / dpr;

  textarea = document.createElement('textarea');

  var style = '\n    position: absolute;\n    left: ' + event.pageX + 'px;\n    top: ' + event.pageY + 'px;\n    color: ' + TRANSPARENT + ';\n    caret-color: ' + (caretColor || fillStyle) + ';\n    background-color: ' + TRANSPARENT + ';\n    font: ' + fontSize + 'px ' + fontFamily + ';\n    line-height: ' + getLineHeight(fontSize) + 'px;\n    border: 1px dashed ' + fillStyle + ';\n    box-sizing: content-box;\n    outline: none;\n    resize: none;\n    padding: 0;\n    overflow: hidden;\n    width: ' + fontSize + 'px;\n    height: ' + fontHeight + 'px;\n    max-width: ' + maxWidth + 'px;\n    max-height: ' + maxHeight + 'px;\n    wrap: physical;\n  ';
  if (fontItalic) {
    style += 'font-style: italic;';
  }
  if (fontWeight) {
    style += 'font-weight: bold;';
  }
  textarea.style.cssText = style;
  parentElement.appendChild(textarea);

  setTimeout(function () {
    textarea.focus();
  });

  var savedData = painter.save();

  var locked = false;

  var updateCanvas = function () {
    painter.restore(savedData);
    shape.text = textarea.value;
    shape.draw(painter);
  };

  var onInput = function () {
    var _getTextSize = getTextSize(shape, textarea.value || 'W'),
        width = _getTextSize.width,
        height = _getTextSize.height;

    textarea.style.width = width + 'px';
    textarea.style.height = height + 'px';

    if (!locked) {
      updateCanvas();
    }
  };

  var onCompositionStart = function () {
    locked = true;
  };

  var onCompositionEnd = function () {
    locked = false;
    updateCanvas();
  };

  var onBlur = function () {

    textarea.removeEventListener('input', onInput);
    textarea.removeEventListener('compositionstart', onCompositionStart);
    textarea.removeEventListener('compositionend', onCompositionEnd);
    textarea.removeEventListener('blur', onBlur);

    parentElement.removeChild(textarea);

    p = textarea = null;

    emitter.fire(Emitter.SHAPE_DRAWING_END, {
      shape: shape
    });
  };

  textarea.addEventListener('input', onInput);
  textarea.addEventListener('compositionstart', onCompositionStart);
  textarea.addEventListener('compositionend', onCompositionEnd);
  textarea.addEventListener('blur', onBlur);

  emitter.fire(Emitter.SHAPE_DRAWING_START, {
    cursor: 'text'
  });

  emitter.on(Emitter.ACTIVE_SHAPE_ENTER, function (event) {
    if (!textarea) {
      return;
    }
    textarea.style.height = getTextSize(shape, textarea.value || 'W').height + 'px';
  });
}

var Text = function (_Shape) {
  inherits(Text, _Shape);

  function Text() {
    classCallCheck(this, Text);
    return possibleConstructorReturn(this, _Shape.apply(this, arguments));
  }

  Text.prototype.isPointInPath = function (painter, x, y) {
    return containRect(this.getRect(painter), x, y);
  };

  Text.prototype.drawPath = function (painter) {
    var rect = this.getRect(painter);
    painter.drawRect(rect.x, rect.y, rect.width, rect.height);
  };

  Text.prototype.fill = function (painter) {
    var x = this.x,
        y = this.y,
        text = this.text,
        fontSize = this.fontSize,
        fontFamily = this.fontFamily,
        fontItalic = this.fontItalic,
        fontWeight = this.fontWeight;

    var dpr = constant.DEVICE_PIXEL_RATIO;

    painter.setFillStyle(this.fillStyle);
    painter.setFont(fontSize * dpr, fontFamily, fontItalic, fontWeight);
    var height = fontSize * dpr + fontSize * dpr / 6;
    array.each(text.split('\n'), function (value, index) {
      painter.fillText(x, y + fontSize * dpr + height * index, value);
    });
  };

  Text.prototype.stroke = function (painter) {
    var x = this.x,
        y = this.y,
        text = this.text,
        fontSize = this.fontSize,
        fontFamily = this.fontFamily,
        fontItalic = this.fontItalic,
        fontWeight = this.fontWeight,
        lineWidth = this.lineWidth,
        strokeStyle = this.strokeStyle;


    var dpr = constant.DEVICE_PIXEL_RATIO;

    painter.setLineWidth(lineWidth);
    painter.setStrokeStyle(strokeStyle);
    painter.setFont(fontSize * dpr, fontFamily, fontItalic, fontWeight);
    var height = fontSize * dpr + fontSize * dpr / 6;

    array.each(text.split('\n'), function (value, index) {
      painter.strokeText(x, y + fontSize * dpr + height * index, value);
    });
  };

  Text.prototype.startDrawing = function (painter, emitter, event) {

    if (!textarea) {

      this.x = event.x;
      this.y = event.y;

      createTextarea(painter, emitter, event, this);
    }

    return false;
  };

  Text.prototype.validate = function () {
    var text = this.text;

    return text && text.trim().length;
  };

  Text.prototype.save = function (rect) {
    return {
      x: (this.x - rect.x) / rect.width,
      y: (this.y - rect.y) / rect.height
    };
  };

  Text.prototype.restore = function (rect, data) {
    this.x = rect.x + rect.width * data.x;
    this.y = rect.y + rect.height * data.y;
  };

  Text.prototype.getRect = function (painter) {
    var x = this.x,
        y = this.y,
        text = this.text,
        fontSize = this.fontSize,
        fontFamily = this.fontFamily,
        fontItalic = this.fontItalic,
        fontWeight = this.fontWeight;


    painter.setFont(fontSize * constant.DEVICE_PIXEL_RATIO, fontFamily, fontItalic, fontWeight);

    var rect = getTextSize(this, text);
    rect.x = x;
    rect.y = y;
    rect.width *= constant.DEVICE_PIXEL_RATIO;
    rect.height *= constant.DEVICE_PIXEL_RATIO;

    return rect;
  };

  Text.prototype.toJSON = function () {
    return _Shape.prototype.toJSON.call(this, {
      name: 'Text',
      x: this.x,
      y: this.y,
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontItalic: this.fontItalic,
      fontWeight: this.fontWeight
    });
  };

  return Text;
}(Shape);

/**
 * @file 画布
 * @author musicode
 */

var INDEX_ACTIVE = 0;
var INDEX_HOVER = 1;
var INDEX_SELECTION = 2;

var Canvas = function () {
  function Canvas(canvas) {
    var maxHistorySize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    classCallCheck(this, Canvas);


    var me = this;

    me.element = canvas;
    me.resize(canvas.clientWidth, canvas.clientHeight, true);

    var painter = me.painter = new Painter(canvas.getContext('2d'));

    var emitter = me.emitter = new Emitter(canvas, container);

    me.states = [];

    me.histories = [{}];
    me.historyIndex = 0;
    me.maxHistorySize = maxHistorySize;

    var hoverShape;

    var refresh = function () {
      me.refresh();
    };

    emitter.on(Emitter.MOUSE_MOVE, function (event) {

      var newHoverShape;

      array.each([me.states, me.getShapes()], function (list) {
        array.each(list, function (shape) {
          if (shape && shape.isPointInPath(painter, event.x, event.y) !== false) {
            newHoverShape = shape;
            return false;
          }
        }, true);
        if (newHoverShape) {
          return false;
        }
      });

      if (newHoverShape !== hoverShape) {

        if (hoverShape) {
          emitter.fire(Emitter.SHAPE_LEAVE, {
            shape: hoverShape
          });
        }

        if (newHoverShape) {
          emitter.fire(Emitter.SHAPE_ENTER, {
            shape: newHoverShape
          });
        }

        hoverShape = newHoverShape;
      }
    }).on(Emitter.HOVER_SHAPE_CHANGE, refresh).on(Emitter.ACTIVE_SHAPE_CHANGE, refresh).on(Emitter.ACTIVE_RECT_CHANGE_END, refresh).on(Emitter.CLEAR, function () {
      me.clear();
    }).on(Emitter.ACTIVE_RECT_CHANGE_START, function () {
      var state = me.states[INDEX_ACTIVE],
          shapes = state.getShapes();
      if (shapes.length) {
        me.editShapes(shapes, null, true);
      }
    }).on(Emitter.ACTIVE_SHAPE_DELETE, function () {
      me.removeActiveShapes();
    }).on(Emitter.SELECTION_RECT_CHANGE, function (event) {
      me.states[INDEX_ACTIVE].setShapes(painter, me.getShapes().filter(function (shape) {
        if (getInterRect(shape.getRect(painter), event.rect)) {
          return true;
        }
      }));
    }).on(Emitter.SELECTION_START, function () {
      canvas.style.cursor = 'crosshair';
    }).on(Emitter.SELECTION_END, function () {
      canvas.style.cursor = '';
      me.refresh();
    }).on(Emitter.SHAPE_DRAWING_START, function (event) {
      canvas.style.cursor = event.cursor;
    }).on(Emitter.SHAPE_DRAWING, refresh).on(Emitter.SHAPE_DRAWING_END, function (event) {
      canvas.style.cursor = '';
      var shape = event.shape;

      if (shape) {
        var rect = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height
        };
        if (!shape.validate || shape.validate(painter, rect)) {
          me.addShape(shape, true);
        }
        me.refresh();
      }
    }).on(Emitter.ACTIVE_DRAG_BOX_HOVER, function (event) {
      var name = event.name;

      if (name) {
        name += '-resize';
      }
      canvas.style.cursor = name;
    });
  }

  /**
   * 调整画布大小
   *
   * @param {number} newWidth
   * @param {number} newHeight
   * @param {boolean} silent
   */


  Canvas.prototype.resize = function (newWidth, newHeight, silent) {
    var element = this.element,
        histories = this.histories,
        historyIndex = this.historyIndex;


    element.style.width = newWidth + 'px';
    element.style.height = newHeight + 'px';

    newWidth *= constant.DEVICE_PIXEL_RATIO;
    newHeight *= constant.DEVICE_PIXEL_RATIO;

    element.width = newWidth;
    element.height = newHeight;

    if (histories) {
      var history = histories[historyIndex];

      if (history.shapes && history.width && history.height) {
        convertDimension(history.shapes, history.width, history.height, newWidth, newHeight);
      }

      history.width = newWidth;
      history.height = newHeight;
    }

    if (!silent) {
      this.refresh();
    }
  };

  /**
   * 添加图形
   *
   * @param {Shape} shape
   * @param {boolean} silent
   */


  Canvas.prototype.addShape = function (shape, silent) {
    this.addShapes([shape], silent);
  };

  /**
   * 批量添加图形
   *
   * @param {Array.<Shape>} shapes
   * @param {boolean} silent
   */


  Canvas.prototype.addShapes = function (shapes, silent) {
    var me = this;
    var allShapes = me.getShapes();

    me.save();

    array.each(shapes, function (shape) {
      array.push(allShapes, shape);
    });
    if (!silent) {
      me.refresh();
    }
    me.emitter.fire(Emitter.SHAPE_ADD, {
      shapes: shapes
    });
  };

  /**
   * 删除图形
   *
   * @param {Shape} shape
   * @param {boolean} silent
   */


  Canvas.prototype.removeShape = function (shape, silent) {
    this.removeShapes([shape], silent);
  };

  /**
   * 批量删除图形
   *
   * @param {Array.<Shape>} shapes
   * @param {boolean} silent
   */


  Canvas.prototype.removeShapes = function (shapes, silent) {

    var me = this;

    me.save();

    var numbers = {};
    array.each(shapes, function (shape) {
      numbers[shape.number] = 1;
    });

    var removedShapes = [];

    var allShapes = me.getShapes();
    array.each(allShapes, function (shape, index) {
      if (numbers[shape.number]) {
        allShapes.splice(index, 1);
        removedShapes.push(shape);
      }
    }, true);

    if (!silent) {
      me.refresh();
    }

    me.emitter.fire(Emitter.SHAPE_REMOVE, {
      shapes: removedShapes
    });
  };

  /**
   * 删除选中的图形
   */


  Canvas.prototype.removeActiveShapes = function () {
    var state = this.states[INDEX_ACTIVE];
    if (state) {
      var shapes = state.getShapes();
      if (shapes.length) {
        this.removeShapes(shapes, true);
        state.setShapes(this.painter, []);
      }
    }
  };

  Canvas.prototype.editShapes = function (shapes, props, silent) {
    var me = this;
    me.save();
    var allShapes = me.getShapes();
    array.each(shapes, function (shape, i) {
      var index = allShapes.indexOf(shape);
      if (index >= 0) {
        var newShape = shape.clone();
        if (props) {
          object.extend(newShape, props);
        }
        allShapes[index] = shapes[i] = newShape;
      }
    });
    if (!silent) {
      me.refresh();
    }
    me.emitter.fire(Emitter.SHAPE_UPDATE, {
      shapes: shapes
    });
  };

  Canvas.prototype.getShapes = function () {
    var history = this.histories[this.historyIndex];
    return history.shapes || (history.shapes = []);
  };

  Canvas.prototype.drawing = function (Shape) {
    var states = this.states,
        emitter = this.emitter,
        painter = this.painter,
        config = this.config;


    var destroy = function (name) {
      if (states[name]) {
        states[name].destroy();
        states[name] = null;
      }
    };

    var createActiveIfNeeded = function () {
      if (!states[INDEX_ACTIVE]) {
        states[INDEX_ACTIVE] = new Active({}, emitter, painter);
      }
    };

    var createHoverIfNeeded = function () {
      if (!states[INDEX_HOVER]) {
        states[INDEX_HOVER] = new Hover(config, emitter);
      }
    };

    var createSelection = function (selection) {
      destroy(INDEX_SELECTION);
      states[INDEX_SELECTION] = selection;
    };

    if (Shape) {
      destroy(INDEX_ACTIVE);
      destroy(INDEX_HOVER);
      createSelection(new Drawing({
        createShape: function createShape() {
          var shape = new Shape(config);
          shape.number = '' + randomInt(10);
          return shape;
        }
      }, emitter, painter));
    } else if (Shape !== false) {
      createActiveIfNeeded();
      createHoverIfNeeded();
      createSelection(new Selection({}, emitter));
    } else {
      destroy(INDEX_ACTIVE);
      destroy(INDEX_HOVER);
      createSelection();
    }

    this.refresh();
  };

  Canvas.prototype.apply = function (config) {

    var active = this.states[INDEX_ACTIVE];
    if (active) {
      var shapes = active.getShapes();
      if (shapes.length) {
        this.editShapes(shapes, config);
      }
    }
    this.config = config;
  };

  /**
   * 全量刷新画布
   */


  Canvas.prototype.refresh = function () {
    var painter = this.painter;


    painter.clear();

    var drawShape = function (shape) {
      if (shape) {
        shape.draw(painter);
      }
    };

    array.each(this.getShapes(), drawShape);
    array.each(this.states, drawShape);
  };

  /**
   * 清空画布
   */


  Canvas.prototype.clear = function () {
    this.removeShapes(this.getShapes());
  };

  /**
   * 修改操作前先保存，便于 prev 和 next 操作
   */


  Canvas.prototype.save = function () {
    // 当前 shapes 必须存在于 histories
    // 否则无法进行 prev 和 next
    var element = this.element,
        histories = this.histories,
        maxHistorySize = this.maxHistorySize,
        historyIndex = this.historyIndex;


    if (histories.length > historyIndex + 1) {
      histories.splice(historyIndex + 1);
    }

    var newHistory = {
      width: element.width,
      height: element.height,
      shapes: this.getShapes()
    };
    if (histories.length > 0) {
      histories.splice(histories.length, 0, newHistory);
    } else {
      histories.push(object.copy(newHistory), newHistory);
    }

    if (histories.length > maxHistorySize + 1) {
      histories.splice(0, 1);
    }

    this.historyIndex = histories.length - 1;
  };

  /**
   * 是否有上一步
   *
   * @return {boolean}
   */


  Canvas.prototype.hasPrev = function () {
    return this.histories[this.historyIndex - 1] ? true : false;
  };

  /**
   * 上一步，用于撤销
   *
   * @return {boolean} 是否撤销成功
   */


  Canvas.prototype.prev = function () {
    if (this.hasPrev()) {
      this.historyIndex--;
      this.emitter.fire(Emitter.RESET);
      var _histories$historyInd = this.histories[this.historyIndex],
          width = _histories$historyInd.width,
          height = _histories$historyInd.height,
          shapes = _histories$historyInd.shapes;

      if (shapes) {
        convertDimension(shapes, width, height, this.element.width, this.element.height);
      }
      return true;
    }
  };

  /**
   * 是否有下一步
   *
   * @return {boolean}
   */


  Canvas.prototype.hasNext = function () {
    return this.histories[this.historyIndex + 1] ? true : false;
  };

  /**
   * 下一步，用于恢复
   *
   * @return {boolean} 是否恢复成功
   */


  Canvas.prototype.next = function () {
    if (this.hasNext()) {
      this.historyIndex++;
      this.emitter.fire(Emitter.RESET);
      var _histories$historyInd2 = this.histories[this.historyIndex],
          width = _histories$historyInd2.width,
          height = _histories$historyInd2.height,
          shapes = _histories$historyInd2.shapes;

      if (shapes) {
        convertDimension(shapes, width, height, this.element.width, this.element.height);
      }
      this.refresh();
      return true;
    }
  };

  /**
   * 销毁
   */


  Canvas.prototype.dispose = function () {
    this.emitter.dispose();
  };

  return Canvas;
}();

Canvas.Emitter = Emitter;
Canvas.shapes = {
  Arrow: Arrow,
  Doodle: Doodle,
  Heart: Heart,
  Line: Line,
  Oval: Oval,
  Polygon: Polygon,
  Rect: Rect,
  Star: Star,
  Text: Text
};

return Canvas;

})));
