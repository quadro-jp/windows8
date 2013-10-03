(function () {

    "use strict";

    WinJS.Namespace.define('Canvas', {

        //図形を描画します。
        draw: function (selectors, x, y, width, height, randomColor) {
            var c = createCanvas(selectors);
            var ctx = c.context;
            var canvas = c.canvas;
            canvas.style.left = x + 'px';
            canvas.style.top = y + 'px';
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = randomColor ? getRandomColor() : '#FFFFFF';
            ctx.fillRect(x, y, width, height);

            return canvas;
        },

        fill: function (selectors, x, y, path, randomColor) {
            var c = createCanvas(selectors);
            var ctx = c.context;
            var canvas = c.canvas;
            canvas.style.left = x + 'px';
            canvas.style.top = y + 'px';
            canvas.width = getMaxWidth(x, path);
            canvas.height = getMaxHeight(y, path);
            ctx.beginPath();
            ctx.fillStyle = randomColor ? getRandomColor() : '#FFFFFF';
            ctx.moveTo(0, 0);
            path.forEach(function (pos) { ctx.lineTo(pos.x - x, pos.y - y); });
            ctx.fill();

            return canvas;
        }

    });

    function createCanvas(selectors) {
        var container = document.getElementById(selectors);
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        container.appendChild(canvas);
        canvas.className = 'jidori-canvas'
        return { container: container, canvas: canvas, context: context };
    }

    function getMaxWidth(start, array) {
        var temp = 0;
        array.forEach(function (value) { temp = value.x > temp ? value.x : temp });
        return temp - start;
    }

    function getMaxHeight(start, array) {
        var temp = 0;
        array.forEach(function (value) { temp = value.y > temp ? value.y : temp });
        return temp - start;
    }

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }

})();
