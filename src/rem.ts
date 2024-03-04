// adjust body font size
if (document.body) {
  document.body.style.fontSize = 16 + 'px'
} else {
  const DOMContentLoadedHandler = () => {
    document.body.style.fontSize = 16 + 'px'
    document.removeEventListener('DOMContentLoaded', DOMContentLoadedHandler)
  }
  document.addEventListener('DOMContentLoaded', DOMContentLoadedHandler)
}

let setTimer: any
function resize() {
  function setRemUnit() {
    const docEl = document.documentElement
    // const width = Math.min(docEl.clientWidth, docEl.clientHeight)
    // const width = Math.min(docEl.clientWidth, 500)
    const rem = Math.min(docEl.clientWidth / 1440, 1) * 16

    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()
  clearTimeout(setTimer)
  setTimer = setTimeout(setRemUnit, 1000) // 增加延时，有些浏览器反映慢，需要等待高度稳定
}

resize()

// reset rem unit on page resize
window.addEventListener('resize', resize)
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    resize()
  }
})

export {}
