/**
 * @file 状态基类
 * @author musicode
 */
define(function () {

  class State {

    constructor(props) {
      Object.assign(this, props)
      this.state = true
    }

    destroy() {

    }

  }

  return State

})