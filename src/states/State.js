/**
 * @file 状态基类
 * @author musicode
 */

import object from '../util/object'

export default class State {

  constructor(props, emitter) {
    object.extend(this, props)
    this.emitter = emitter
    this.state = true
  }

  on(type, handler) {
    this.emitter.on(type, handler, true)
    return this
  }

  off(type, handler) {
    this.emitter.off(type, handler)
    return this
  }

  destroy() {

  }

  draw() {

  }

}
