var canvas = document.getElementById('clock')
var ctx = canvas.getContext('2d')
canvas.width = document.body.clientWidth - document.body.clientHeight < 0 ? document.body.clientWidth : document.body.clientHeight
canvas.height = canvas.width
var width = canvas.width
var height = width
var r = width / 2
var rem = width / 200

// canvas背景 —— 时钟圆形
function drawBackground() {
    // 保存最初的环境,否则第二次调用时候的圆心位置会存在偏差
    ctx.save()
        // 重新定义圆点左边到正方形的中心
    ctx.translate(r, r)
        // 起始路径
    ctx.beginPath()
        // 设置线条的宽度
    ctx.lineWidth = 10 * rem
        // 画圆
    ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI, false)
        // 绘制定义的路径
    ctx.stroke()

    // 定义一个数组存放12个小时数
    var hourArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
        // 定义填充数字的字体和大小
    ctx.font = 18 * rem + 'px Arial'
        // 定义字体对齐方式
    ctx.textAlign = 'center' // 水平对齐
    ctx.textBaseline = 'middle' // 垂直对齐
        // 遍历小时数添加坐标
    hourArr.forEach((number, index) => {
        // 定义每一个弧度 —— 圆是从最右边开始画也就是3点 即使0弧度
        var rad = 2 * Math.PI / 12 * index
            // 定义小时坐标，数字要小于半径放在圆内
        var x = Math.cos(rad) * (r - 30 * rem)
        var y = Math.sin(rad) * (r - 30 * rem)
            // 坐标点上填写数字
        ctx.fillText(number, x, y)
    })

    // 定义秒针跳动的点
    for (var i = 0; i < 60; i++) {
        // 定义每一个弧度
        var rad = 2 * Math.PI / 60 * i
            // 定义秒针盘坐标,在坐标和圆之间
        var x = Math.cos(rad) * (r - 16 * rem)
        var y = Math.sin(rad) * (r - 16 * rem)
            // 另外重新绘制
        ctx.beginPath()
            // 判断绘制圆坐标是小时坐标，突出颜色黑色，否则是灰色
        if (i % 5 === 0) {
            ctx.fillStyle = '#000'
        } else {
            ctx.fillStyle = '#ccc'
        }
        // 画秒针盘上一个个实心圆
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false)
            // 填充实心圆
        ctx.fill()
    }
}
// 定义时针指针
function drawHour(hour, minute) {
    // 保存之前状态 —— 这样旋转就不会影响到其他画布
    ctx.save()
        // 重新开始绘画
    ctx.beginPath()
        // 定义线的宽度
    ctx.lineWidth = 5 * rem
        // 定义每小时的弧度
    var rad = 2 * Math.PI / 12 * hour
        // 定义分针弧度
    var mrad = 2 * Math.PI / 12 / 60 * minute
        // 旋转小时指针
    ctx.rotate(rad + mrad)
        // 定义线两端结点的样式
    ctx.lineCap = "round"
        // 定义直线起点，时针下部分有超出圆点，要往下一点
    ctx.moveTo(0, 10 * rem)
        // 定义直线终点
    ctx.lineTo(0, -r / 2)
    ctx.stroke()
        // 还原之前状态
    ctx.restore()
}

// 定义分针指针
function drawMinute(minute) {
    // 保存之前状态 —— 这样旋转就不会影响到其他画布
    ctx.save()
        // 重新开始绘画
    ctx.beginPath()
        // 定义线的宽度
    ctx.lineWidth = 3 * rem
        // 定义分钟的弧度
    var rad = 2 * Math.PI / 60 * minute
        // 旋转分钟指针
    ctx.rotate(rad)
        // 定义线两端结点的样式
    ctx.lineCap = 'round'
        // 定义直线起点，秒针下部分有超出圆点，要往下一点
    ctx.moveTo(0, 20 * rem)
        // 定义直线终点
    ctx.lineTo(0, -r * 2 / 3)
    ctx.stroke()
        // 还原之前状态
    ctx.restore()
}

// 定义秒针指针
function drawSecond(second) {
    // 保存之前状态 —— 这样旋转就不会影响到其他画布
    ctx.save()
        // 重新开始绘画
    ctx.beginPath()
        // 定义线的宽度
    ctx.lineWidth = 3 * rem
        // 定义分钟的弧度
    var rad = 2 * Math.PI / 60 * second
        // 旋转分钟指针
    ctx.rotate(rad)
    ctx.fillStyle = '#c14543'
        // 秒针是尾部宽 —— 半圆，头细 —— 线填充
    ctx.arc(0, -r / 3, 2 * rem, 0, Math.PI, true)
    ctx.moveTo(2 * rem, (-r - 1 * rem) / 3)
    ctx.lineTo(-2 * rem, (-r - 1 * rem) / 3)
    ctx.lineTo(-0.5 * rem, r - 16 * rem)
    ctx.lineTo(0.5 * rem, r - 16 * rem)
    ctx.fill()
        // 还原之前状态
    ctx.restore()
}

// 三针交汇处的白点
function drawDot() {
    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI, false)
    ctx.fill()
}


// 封装小时分钟秒钟方法
function draw() {
    // 清除之前的canvas，再重新画
    ctx.clearRect(0, 0, width, height)
    var now = new Date()
    var hour = now.getHours()
    var minute = now.getMinutes()
    var second = now.getSeconds()
    drawBackground()
    drawHour(hour, minute)
    drawMinute(minute)
    drawSecond(second)
    drawDot()
        // 回复到初始状态圆心为0，再从头开始画
    ctx.restore()
}
draw()
window.onload = function() {
    (function run() {
        draw()
        window.requestAnimationFrame(run)
    })()
}