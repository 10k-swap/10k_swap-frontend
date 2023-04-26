export function isIOS() {
  return window && /iP(ad|hone|od)/i.test(window.navigator.userAgent)
}

export function isAndroid() {
  return window && /(Android)/i.test(window.navigator.userAgent)
}
