window.onload = function() {
    $("img").lazyload({
        // 当图片完全加载的时候，插件默认地使用show()方法来将图显示出来。你也可以使用其他的效果
        effect: "fadeIn",
        load: function() {
            waterFall()
        }
    });
}

function waterFall() {
    // 求出列数
    // 创建数组
    // 图片循环遍历，除第一排不需要定位，取高度值，其它排定位处理

    var boxAll = document.querySelectorAll('.box')
    var boxWidth = document.querySelectorAll('.box')[0].offsetWidth
    var screenWidth = document.body.clientWidth
    var columns = parseInt(screenWidth / boxWidth)
    var heightArr = []
    boxAll.forEach((box, index) => {
        var boxHeight = box.offsetHeight
        if (index < columns) { //判断是第一排
            heightArr[index] = boxHeight
        } else {
            // 求最小索引
            var minHeight = Math.min(...heightArr)
            var minHeightIndex = heightArr.indexOf(minHeight)
            box.style.position = 'absolute'
            box.style.left = minHeightIndex * boxWidth + 'px' // 最小索引*box的宽度
            box.style.top = minHeight + 'px' // 最小索引的高度
                // 放完后在高度数组中更新最新的高度
            heightArr[minHeightIndex] += box.offsetHeight

        }
    })
}