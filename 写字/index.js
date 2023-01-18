var canvasWidth = Math.min(800, document.body.clientWidth - 20)
var canvasHeight = canvasWidth
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
canvas.width = canvasWidth
canvas.height = canvasHeight
var strokeColor = 'black'
var isMouseDonw = false
var lastLoc = { x: 0, y: 0 } // 计算上一次的坐标
var lastTime = 0 // 计算上一次的时间点
var lastLineWidth = -1 // 计算上一次笔的宽度 为了使笔过渡平滑，如果宽度变化很大会取一次平均值
var maxLineWidth = 30 // 最大线条宽度
var minLineWidth = 1 // 最小线条宽度
var maxStrokeV = 10 // 最大移动速度
var minStrokeV = 0.1 // 最小移动速度

window.onload = function() {
    $('.controller').css('width', canvasWidth + 'px')
    drawGrid(context)
    $(".clear-btn").click(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawGrid(context)
    })
    $('.color-btn').click(function() {
        $('.color-btn').removeClass('btn_selected')
        $(this).addClass('btn_selected')
        strokeColor = $(this).css('background-color')
    })
    canvas.onmousedown = function(e) {
        e.preventDefault()
        beginStroke({ x: e.clientX, y: e.clientY })
    }
    canvas.onmouseup = function(e) {
        e.preventDefault()
        endStroke()
    }
    canvas.onmouseout = function(e) {
        e.preventDefault()
        endStroke()
    }
    canvas.onmousemove = function(e) {
        e.preventDefault()
        if (isMouseDonw) {
            moveStroke({ x: e.clientX, y: e.clientY })
        }
    }
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault()
        let touch = e.touches[0]
        beginStroke({ x: touch.pageX, y: touch.pageY })
    })
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault()
        if (isMouseDonw) {
            let touch = e.touches[0]
            moveStroke({ x: touch.pageX, y: touch.pageY })
        }
    })
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault()
        endStroke()
    })

}

function beginStroke(point) {
    isMouseDonw = true
    lastLoc = windowToCanvas(point.x, point.y)
    lastTime = new Date().getTime()
}

function endStroke() {
    isMouseDonw = false
}

function moveStroke(point) {
    let curLoc = windowToCanvas(point.x, point.y)
    var s = calcDistance(curLoc, lastLoc)
    var curTime = new Date().getTime()
    var t = curTime - lastTime
    var lineWidth = cakcLineWidth(t, s) // 传入时间和距离来对应笔画的粗细

    // draw
    context.beginPath()
    context.moveTo(lastLoc.x, lastLoc.y)
    context.lineTo(curLoc.x, curLoc.y)
    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.stroke()
    context.closePath()
    lastLoc = curLoc
    lastTime = curTime
    lastLineWidth = lineWidth
}

function cakcLineWidth(t, s) {
    var v = s / t // 计算移动笔的速度
    let resultLineWidth
    if (v < minStrokeV) {
        resultLineWidth = maxLineWidth
    } else if (v >= maxStrokeV) {
        resultLineWidth = minLineWidth
    } else {
        resultLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - v) * (maxLineWidth - minLineWidth)
    }
    if (lastLineWidth === -1) { //第一次
        return resultLineWidth
    } else {
        return lastLineWidth * 2 / 3 + resultLineWidth / 3
    }
}

function calcDistance(loc1, loc2) { // 计算2个点之间的距离
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
}

function windowToCanvas(x, y) {
    var canvasBox = canvas.getBoundingClientRect()
    return {
        x: Math.round(x - canvasBox.left),
        y: Math.round(y - canvasBox.top)
    }
}

function drawGrid(ctx) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgb(230,11,9)'
    ctx.lineWidth = 8
    ctx.moveTo(3, 3)
    ctx.lineTo(canvasWidth - 3, 3)
    ctx.lineTo(canvasWidth - 3, canvasHeight - 3)
    ctx.lineTo(3, canvasHeight - 3)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvasWidth, canvasHeight)
    ctx.moveTo(canvasWidth / 2, 0)
    ctx.lineTo(canvasWidth / 2, canvasHeight)
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(canvasWidth, 0)
    ctx.moveTo(0, canvasHeight / 2)
    ctx.lineTo(canvasWidth, canvasHeight / 2)
    ctx.lineWidth = 1
    ctx.setLineDash([20, 5]);
    ctx.stroke()
}