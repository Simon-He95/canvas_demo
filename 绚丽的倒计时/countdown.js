var WINDOW_WIDTH = 1020
var WINDOW_HEIGHT = 768
var R = 8
var LEFT = 30
var TOP = 60
var EndTime = new Date(2020, new Date().getMonth(), new Date().getDate() + 3, 0, 0, 0)
var curShowTimeSeconds = 0
var balls = []
var colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000']
window.onload = function() {
    WINDOW_WIDTH = document.body.clientWidth
    WINDOW_HEIGHT = document.body.clientHeight
    R = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1
    LEFT = Math.round(WINDOW_WIDTH / 10)
    TOP = Math.round(WINDOW_HEIGHT / 5)
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    canvas.width = WINDOW_WIDTH
    canvas.height = WINDOW_HEIGHT
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    (function run() {
        render(context)
        update()
        window.requestAnimationFrame(run)
    })()
}

function render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    var hour = parseInt(curShowTimeSeconds / 3600)
    var minutes = parseInt((curShowTimeSeconds - hour * 3600) / 60)
    var seconds = parseInt(curShowTimeSeconds % 60)

    renderDigit(LEFT, TOP, parseInt(hour / 10), ctx)
    renderDigit(LEFT + 15 * (R + 1), TOP, parseInt(hour % 10), ctx)
    renderDigit(LEFT + 30 * (R + 1), TOP, 10, ctx)
    renderDigit(LEFT + 39 * (R + 1), TOP, parseInt(minutes / 10), ctx)
    renderDigit(LEFT + 54 * (R + 1), TOP, parseInt(minutes % 10), ctx)
    renderDigit(LEFT + 69 * (R + 1), TOP, 10, ctx)
    renderDigit(LEFT + 78 * (R + 1), TOP, parseInt(seconds / 10), ctx)
    renderDigit(LEFT + 93 * (R + 1), TOP, parseInt(seconds % 10), ctx)
    for (var i = 0; i < balls.length; i++) {
        ctx.fillStyle = balls[i].color
        ctx.beginPath()
        ctx.arc(balls[i].x, balls[i].y, R, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}

function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = 'rgb(0,105,153)'
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                ctx.beginPath()
                let X = x + j * 2 * (R + 1) + (R + 1)
                let Y = y + i * 2 * (R + 1) + (R + 1)
                ctx.arc(X, Y, R, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}

function getCurrentShowTimeSeconds() {
    var curTime = new Date()
    var ret = EndTime.getTime() - curTime.getTime()
    ret = Math.round(ret / 1000)
    return ret >= 0 ? ret : 0
}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds()
    var nextHours = parseInt(nextShowTimeSeconds / 3600)
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60)
    var nextSeconds = parseInt(nextShowTimeSeconds % 60)

    var curHours = parseInt(curShowTimeSeconds / 3600)
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60)
    var curSeconds = parseInt(curShowTimeSeconds % 60)
    if (curSeconds !== nextSeconds) {
        if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
            addBalls(LEFT + 0, TOP, parseInt(curHours / 10))
        }
        if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
            addBalls(LEFT + 15 * (R + 1), TOP, parseInt(curHours % 10))
        }
        if (parseInt(nextMinutes / 10) !== parseInt(nextMinutes / 10)) {
            addBalls(LEFT + 39 * (R + 1), parseInt(curHours / 10))
        }
        if (parseInt(nextMinutes % 10) !== parseInt(nextMinutes % 10)) {
            addBalls(LEFT + 54 * (R + 1), TOP, parseInt(curHours % 10))
        }
        if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
            addBalls(LEFT + 78 * (R + 1), TOP, parseInt(curHours / 10))
        }
        if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
            addBalls(LEFT + 93 * (R + 1), TOP, parseInt(curHours % 10))
        }
        curShowTimeSeconds = nextShowTimeSeconds
    }
    ballsDown()
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                var aBall = {
                    x: x + j * 2 * (R + 1) + (R + 1),
                    y: y + i * 2 * (R + 1) + (R + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aBall)
            }
        }
    }

}

function ballsDown() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx
        balls[i].y += balls[i].vy
        balls[i].vy += balls[i].g
        if (balls[i].y >= WINDOW_HEIGHT - R) {
            balls[i].y = WINDOW_HEIGHT - R
            balls[i].vy = -balls[i].vy * 0.75
        }
    }
    let cnt = 0
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + R > 0 && balls[i].x - R < WINDOW_WIDTH) {
            balls[cnt++] = balls[i] // cnt记录当前在画布中的小球
        }
    }
    while (balls.length > Math.min(cnt, 300)) { // 删除不在画布中的小球
        balls.pop()
    }

}