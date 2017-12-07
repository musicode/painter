/**
 * @file 创建随机数
 * @author musicode
 */
export default function (length) {
  let min = Math.pow(10, length - 1)
  let max = Math.pow(10, length) - 1
  return min + Math.floor(Math.random() * (max - min))
}