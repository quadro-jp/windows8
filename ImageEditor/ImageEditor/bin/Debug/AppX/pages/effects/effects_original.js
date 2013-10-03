(function () {

    WinJS.Namespace.define('Effects', {
        apply: apply
    });
    
    var IMAGE = "/pages/effects/picture.jpg";
    var imageObj, img, canvas, context, stage;
    var ColorMatrix = {

        defualt: [
            1, 1, 1, 0, 0,
            1, 1, 1, 0, 0,
            1, 1, 1, 0, 0,
            0, 0, 0, 1, 0
        ],
        gray: [
            0.34, 0.5, 0.16, 0, 0,
            0.34, 0.5, 0.16, 0, 0,
            0.34, 0.5, 0.16, 0, 0,
            0, 0, 0, 1, 0
        ],
        sepia: [
            0.32, 0.47, 0.15, 0, 0,
            0.26, 0.39, 0.12, 0, 0,
            0.19, 0.28, 0.10, 0, 0,
            0, 0, 0, 1, 0
        ],
        reverse: [
            -1, -1, -1, 0, 0,
            -1, -1, -1, 0, 0,
            -1, -1, -1, 0 ,
            0, 0, 0, 1, 0
        ]
    }

    imageObj = new Image();
    imageObj.onload = function () {
        canvas = document.querySelector("#world");
        stage = new createjs.Stage(canvas);
        img = this;
        bmp = new createjs.Bitmap(img);
        bmp.cache(0, 0, img.width, img.height);
        stage.addChild(bmp);
        stage.update();
    };

    imageObj.src = IMAGE;

    //モノクロ加工
    function GrayEffect() {
        var greyScaleFilter = new createjs.ColorMatrixFilter(ColorMatrix.gray);
        bmp.filters = [greyScaleFilter];
        bmp.cache(0, 0, img.width, img.height);
    }

    //セピア加工
    function SepiaEffect() {
        var greyScaleFilter = new createjs.ColorMatrixFilter(ColorMatrix.sepia);
        bmp.filters = [greyScaleFilter];
        bmp.cache(0, 0, img.width, img.height);
    }

    //色反転
    function ReverseEffect() {
        var greyScaleFilter = new createjs.ColorMatrixFilter(ColorMatrix.reverse);
        bmp.filters = [greyScaleFilter];
        bmp.cache(0, 0, img.width, img.height);
    }

    //ぼかし
    function BlurEffect() {
        var blurFilter = new createjs.BoxBlurFilter(32, 2, 2);
        bmp.filters = [blurFilter];
        bmp.cache(0, 0, img.width, img.height);
    }

    //2値化
    function BinarizeEffect() {
        context = bmp.cacheCanvas.getContext('2d');
        var imageData = context.getImageData(0, 0, 640, 360);
        var data = imageData.data;
        var threshold = document.getElementById("range").value;
        var Y;
        var n = data.length;
        
        for (var i = 0; i < n; i += 4) {
            //グレースケールの計算
            Y = 0.298912 * data[i] + 0.586611 * data[i + 1] + 0.114478 * data[i + 2];

            Y = Y > threshold ? 255 : 0;
            
            // red
            data[i] = Y;
            // green
            data[i + 1] = Y;
            // blue
            data[i + 2] = Y;
            //alpha
            data[i + 3] = 255;
        }

        context.putImageData(imageData, 0, 0);
    }

    function apply(effectName) {

        bmp.filters = [];
        bmp.cache(0, 0, img.width, img.height);

        switch (effectName) {
            case "Gray":
                GrayEffect();
                break;
            case "Sepia":
                SepiaEffect();
                break;
            case "Reverse":
                ReverseEffect();
                break;
            case "Blur":
                BlurEffect();
                break;
            case "Binarize":
                BinarizeEffect();
                break;
            default:
                break;
        }

        stage.update();
    }

})();