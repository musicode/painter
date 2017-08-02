/**
 * @file 日志
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return {

      log(msg) {
        console.log(msg)
      }

      error(msg) {
        console.error(msg)
      }

    }

})