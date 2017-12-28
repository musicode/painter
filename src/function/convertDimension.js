/**
 * @file 转换图形尺寸
 * @author musicode
 */

import array from '../util/array'

export default function (shapes, oldWidth, oldHeight, newWidth, newHeight) {

  const widthRatio = newWidth / oldWidth
  const heightRatio = newHeight / oldHeight

  if (widthRatio !== 1 || heightRatio !== 1) {
    array.each(
      shapes,
      function (shape) {
        if (widthRatio !== 1) {
          if (shape.x) {
            shape.x *= widthRatio
          }
          if (shape.width) {
            shape.width *= widthRatio
          }
          if (shape.fontSize) {
            shape.fontSize *= widthRatio
          }
          if (shape.lineWidth) {
            shape.lineWidth *= widthRatio
          }
        }
        if (heightRatio !== 1) {
          if (shape.y) {
            shape.y *= heightRatio
          }
          if (shape.height) {
            shape.height *= heightRatio
          }
        }
        if (shape.points) {
          array.each(
            shape.points,
            function (point) {
              if (point.x) {
                point.x *= widthRatio
              }
              if (point.y) {
                point.y *= heightRatio
              }
            }
          )
        }
      }
    )
  }

}