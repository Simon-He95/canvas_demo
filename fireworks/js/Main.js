javascript: !(function () {
  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1000;
  textCanvas.height = 300;
  var textctx = textCanvas.getContext("2d");
  textctx.fillStyle = "#000000";
  textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.zIndex = -1;

  var context = canvas.getContext("2d");

  var canvasSky = document.createElement("canvas");
  var contextSky = canvas.getContext("2d");
  canvasSky.width = document.body.clientWidth;
  canvasSky.height = (document.body.clientWidth * 3) / 4;

  function drawStar(ctx, R, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot / 180) * Math.PI);
    ctx.scale(R, R);
    starPath(ctx);
    ctx.fillStyle = "#fb3";
    // ctx.strokeStyle = '#fd5'
    // ctx.lineWidth = 3
    // ctx.lineJoin = 'round'

    ctx.fill();
    // ctx.stroke()
    ctx.restore();
  }

  function starPath(ctx) {
    ctx.beginPath();
    for (var i = 0; i < 5; i++) {
      ctx.lineTo(
        Math.cos(((18 + i * 72) / 180) * Math.PI),
        -Math.sin(((18 + i * 72) / 180) * Math.PI)
      );
      ctx.lineTo(
        Math.cos(((54 + i * 72) / 180) * Math.PI) * 0.5,
        -Math.sin(((54 + i * 72) / 180) * Math.PI) * 0.5
      );
    }
    ctx.closePath();
  }

  function fillMoon(ctx, d, x, y, R, rot, fillColor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(R, R);
    pathMoon(ctx, d);
    ctx.fillStyle = fillColor || "#fb5";
    ctx.fill();
    ctx.restore();
  }

  function pathMoon(ctx, d) {
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0.5 * Math.PI, 1.5 * Math.PI, true);
    ctx.moveTo(0, -1);
    ctx.arcTo(d, 0, 0, 1, dis(0, -1, d, 0) / d);
    ctx.closePath();
  }

  function dis(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    clearCanvas();
  }

  function clearCanvas() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  function mouseDownHandler(e) {
    var x = e.clientX;
    var y = e.clientY;

    createFireworks(
      x,
      y,
      ["朱梦单", "我爱你", "永远"][Math.floor(Math.random() * 3)]
    );
    // const heart = new Heart(contextSky, x, y, 6);
    // heart.draw();
  }
  document.addEventListener("mousedown", mouseDownHandler);

  var particles = [];

  function createFireworks(x, y, text = "") {
    var skyStyle = context.createRadialGradient(
      canvasSky.width / 2,
      canvasSky.height,
      0,
      canvasSky.width / 2,
      canvasSky.height,
      canvasSky.height
    ); // 绘制星空背景
    skyStyle.addColorStop(0.0, "#035");
    skyStyle.addColorStop(1.0, "black");
    context.fillStyle = skyStyle;

    context.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 200; i++) {
      var R = (Math.random() * canvasSky.width) / 240 + canvasSky.width / 240; // 随机大圆的半径
      var x = Math.random() * (canvasSky.width - 2 * R) + R; // 随机偏移量
      var y = (Math.random() * (canvasSky.height - 2 * R) + R) * 0.65; // 随机偏移量
      var a = Math.random() * 360; // 随机旋转角度
      drawStar(contextSky, R, x, y, a); // 绘制星星
    }
    fillMoon(
      contextSky,
      2,
      (canvasSky.width * 2) / 3,
      canvasSky.width / 6,
      canvasSky.width / 12,
      30
    ); //绘制月亮

    var hue = Math.random() * 360;
    var hueVariance = 30;

    function setupColors(p) {
      p.hue =
        Math.floor(Math.random() * (hue + hueVariance - (hue - hueVariance))) +
        (hue - hueVariance);
      p.brightness = Math.floor(Math.random() * 21) + 50;
      p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
    }

    if (text != "") {
      var gap = 6;
      var fontSize = 120;

      textctx.font = fontSize + "px Verdana";
      textctx.fillStyle = "#ffffff";

      var textWidth = textctx.measureText(text).width;
      var textHeight = fontSize;

      textctx.fillText(text, 0, textHeight);
      var imgData = textctx.getImageData(0, 0, textWidth, textHeight * 1.2);

      textctx.fillStyle = "#000000";
      textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      for (var h = 0; h < textHeight * 1.2; h += gap) {
        for (var w = 0; w < textWidth; w += gap) {
          var position = (textWidth * h + w) * 4;
          var r = imgData.data[position],
            g = imgData.data[position + 1],
            b = imgData.data[position + 2],
            a = imgData.data[position + 3];

          if (r + g + b == 0) continue;

          var p = {};

          p.x = x;
          p.y = y;

          p.fx = x + w - textWidth / 2;
          p.fy = y + h - textHeight / 2;

          p.size = Math.floor(Math.random() * 2) + 1;
          p.speed = 1;

          setupColors(p);

          particles.push(p);
        }
      }
    } else {
      var count = 100;
      for (var i = 0; i < count; i++) {
        //角度
        var angle = (360 / count) * i;
        //弧度
        var radians = (angle * Math.PI) / 180;

        var p = {};

        p.x = x;
        p.y = y;
        p.radians = radians;

        //大小
        p.size = Math.random() * 2 + 1;

        //速度
        p.speed = Math.random() * 5 + 0.4;

        //半径
        p.radius = Math.random() * 81 + 50;

        p.fx = x + Math.cos(radians) * p.radius;
        p.fy = y + Math.sin(radians) * p.radius;

        setupColors(p);

        particles.push(p);
      }
    }
  }
  function drawFireworks() {
    clearCanvas();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      p.x += (p.fx - p.x) / 10;
      p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

      p.alpha -= 0.006;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
      context.closePath();

      context.fillStyle =
        "hsla(" + p.hue + ",100%," + p.brightness + "%," + p.alpha + ")";
      context.fill();
    }
  }

  //requestAnimationFrame
  var lastStamp = 0;
  function tick(opt = 0) {
    if (opt - lastStamp > 2000) {
      lastStamp = opt;
      createFireworks(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
    }

    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "rgba(0,0,0," + 10 / 100 + ")";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "lighter";

    drawFireworks();

    requestAnimationFrame(tick);
  }
  tick();
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
  createFireworks()
})();
