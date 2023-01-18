var canvas = document.querySelector('#canvas')
var context = canvas.getContext('2d')
canvas.width = 1200
canvas.height = 800

window.onload = function() {

    // 创建渐变色
    // var skyStyle = context.createLinearGradient(0, 0, 0, canvas.height)
    var skyStyle = context.createRadialGradient(canvas.width / 2, canvas.height, 0, canvas.width / 2, canvas.height, canvas.height) // 绘制星空北京
    skyStyle.addColorStop(0.0, '#035')
    skyStyle.addColorStop(1.0, 'black')
    context.fillStyle = skyStyle

    context.fillRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < 200; i++) {
        var R = Math.random() * 5 + 5 // 随机大圆的半径
        var x = Math.random() * (canvas.width - 2 * R) + R // 随机偏移量
        var y = (Math.random() * (canvas.height - 2 * R) + R) * 0.65 // 随机偏移量
        var a = Math.random() * 360 // 随机旋转角度
        drawStar(context, R, x, y, a) // 绘制星星
    }
    fillMoon(context, 2, 900, 200, 100, 30) //绘制月亮
    drawLand(context) // 绘制绿地
    drawText(context, '作者: 何健')

}

function drawStar(ctx, R, x, y, rot) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot / 180 * Math.PI)
    ctx.scale(R, R)
    starPath(ctx)
    ctx.fillStyle = '#fb3'
        // ctx.strokeStyle = '#fd5'
        // ctx.lineWidth = 3
        // ctx.lineJoin = 'round'

    ctx.fill()
        // ctx.stroke()
    ctx.restore()
}

function starPath(ctx) {
    ctx.beginPath()
    for (var i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI), -Math.sin((18 + i * 72) / 180 * Math.PI))
        ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 0.5, -Math.sin((54 + i * 72) / 180 * Math.PI) * 0.5)

    }
    ctx.closePath()
}

function fillMoon(ctx, d, x, y, R, rot, fillColor) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot * Math.PI / 180)
    ctx.scale(R, R)
    pathMoon(ctx, d)
    ctx.fillStyle = fillColor || '#fb5'
    ctx.fill()
    ctx.restore()
}

function pathMoon(ctx, d) {
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0.5 * Math.PI, 1.5 * Math.PI, true)
    ctx.moveTo(0, -1)
    ctx.arcTo(d, 0, 0, 1, dis(0, -1, d, 0) / d)
    ctx.closePath()
}

function dis(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function drawLand(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 600)
    ctx.bezierCurveTo(540, 400, 660, 800, canvas.width, 600)
    ctx.lineTo(1200, 800)
    ctx.lineTo(0, 800)
    ctx.closePath()
    var landStyle = ctx.createLinearGradient(0, 800, 0, 0)
    landStyle.addColorStop(0.0, '#030')
    landStyle.addColorStop(1.0, '#580')
    ctx.fillStyle = landStyle
    ctx.fill()
    ctx.restore()
}

function drawText(ctx, string) {
    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 20px Arial'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    var textStyle = ctx.createLinearGradient(1000, 0, 1200, 0)
    textStyle.addColorStop(0.0, 'black')
    textStyle.addColorStop(1.0, 'white')
    ctx.fillStyle = textStyle
    ctx.fillText(string, 1100, 750)
    ctx.closePath()
    ctx.restore()
}