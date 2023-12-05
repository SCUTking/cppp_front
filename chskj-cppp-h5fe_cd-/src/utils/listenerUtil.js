/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:51:03
 */
export function addEventListen(target, event, handler, capture = false) {
  if (
    target.addEventListener &&
    typeof target.addEventListener === 'function'
  ) {
    target.addEventListener(event, handler, capture);
  }
}

export function removeEventListen(target, event, handler, capture = false) {
  if (
    target.removeEventListener &&
    typeof target.removeEventListener === 'function'
  ) {
    target.removeEventListener(event, handler, capture);
  }
}
