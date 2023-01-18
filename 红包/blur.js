var canvasWidth = window.innerWidth
var canvasHeight = window.innerHeight

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

canvas.width = canvasWidth
canvas.height = canvasHeight

var image = new Image()
let radius = 50 // 半径
var clippingRegion = { // 设置清晰的区域
    x: -1,
    y: -1,
    r: radius
}
var leftMargin = 0,
    topMargin = 0
image.src = 'picture.jpg'
image.onload = function() {
    let blurDiv = document.querySelector('.blur-div')
    blurDiv.style.width = canvasWidth + 'px'
    blurDiv.style.height = canvasHeight + 'px'
    let blurImage = document.querySelector('#blur-image')
    blurImage.style.width = image.width + 'px'
    blurImage.style.height = image.height + 'px'
    leftMargin = (image.width - canvas.width) / 2
    topMargin = (image.height - canvas.height) / 2
    blurImage.style.left = -leftMargin + 'px'
    blurImage.style.top = -topMargin + 'px'
    initCanvas()
}

function initCanvas() {
    clippingRegion = { // 设置清晰的区域
        x: Math.random() * (canvasWidth - radius * 2) + radius,
        y: Math.random() * (canvasHeight - radius * 2) + radius,
        r: radius
    }
    draw(image, clippingRegion)
}

function setClippingRegion(clippingRegion) {
    context.beginPath()
    context.arc(clippingRegion.x, clippingRegion.y, clippingRegion.r, 0, Math.PI * 2, false)
    context.clip() // 使图像只发生在剪辑区域
}

function draw(image, clippingRegion) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    setClippingRegion(clippingRegion)
    context.drawImage(image, leftMargin, topMargin, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
    context.restore()
}

function reset() {
    initCanvas()
}

function show() {
    // 使用setInetval实现慢慢展示的效果
    let Timer = setInterval(() => {
        if (clippingRegion.r > 2 * Math.max(canvasWidth, canvasHeight)) {
            clearInterval(Timer)
        }
        clippingRegion.r += 20
        draw(image, clippingRegion)
    }, 10)
}