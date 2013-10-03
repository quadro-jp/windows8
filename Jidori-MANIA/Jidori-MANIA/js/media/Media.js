(function () {

    "use strict";

    WinJS.strictProcessing();

    var mediaCaptureMgr;

    WinJS.Namespace.define("Media", {
        camera: {
            getDeviceInformation: getDeviceInformation,
            createAsync: initializeAsync,
            destroy: destroy,
            onInitializeComplete: function () { },
            onInitializeError: function () { },
            showSettings: showSettings,
            execCapture: execCapture,
            stopCapture: stopCapture,
            videoElement: null,
            isAvailable: null,
            isPreviewStart: null,
            isCaptureStart: null
        }
    });

    function getDeviceInformation() {

        try{
            var deviceInformation = Windows.Devices.Enumeration.DeviceInformation;
            var type = Windows.Devices.Enumeration.DeviceClass.videoCapture;

            deviceInformation.findAllAsync(type).done(function (devices) {
                Media.camera.isAvailable = devices.length > 0 ? true : false;
            });
        } catch (error) {
            Media.camera.isAvailable = false;
        }
    }

    function initializeAsync(element) {

        if (!element) return;
        if (!Media.camera.isAvailable) throw new Exception.PlatformNotSupportException();

        Media.camera.videoElement = element;
        Media.camera.isPreviewStart = false;
        Media.camera.isCaptureStart = false;

        try{
            mediaCaptureMgr = new Windows.Media.Capture.MediaCapture();
            return mediaCaptureMgr.initializeAsync().then(initializeComplete, initializeError);
        } catch (error) {
            throw new Exception.PlatformNotSupportException();
        }
    }

    function initializeComplete(op) {
        Media.camera.onInitializeComplete();
        startPreview();
    }

    function initializeError(op) {
        Media.camera.onInitializeError();
    }

    function startPreview() {
        try{
            if (mediaCaptureMgr) {
                Media.camera.isPreviewStart = true;
                Media.camera.videoElement.src = URL.createObjectURL(mediaCaptureMgr);
                Media.camera.videoElement.play();
            } else {
                Media.camera.createAsync(Media.camera.videoElement);
            }
        } catch (error) {
            Utilities.log('Media::' + error);
        }
    }

    function showSettings() {
        if (mediaCaptureMgr)  Windows.Media.Capture.CameraOptionsUI.show(mediaCaptureMgr);
    }

    function destroy() {
        if (mediaCaptureMgr) {
            mediaCaptureMgr = null;
            Media.camera.isPreviewStart = false;
            Media.camera.videoElement.src = '#';
        }
    }

    //録画を開始する

    var _videoFolder;
    var _fileName;
    var _storageFile;
    var _onCaptureStart;
    var _onCaptureStop;

    function execCapture(videoFolder, fileName, start, stop) {

        if (!videoFolder || !fileName) throw new Exception.IllegalArgumentException();

        _videoFolder = videoFolder;
        _fileName = fileName;
        _onCaptureStart = start;
        _onCaptureStop = stop;

        if (_videoFolder) {
            Utilities.log(_videoFolder + 'フォルダに録画をします');
            var folder = MyDocument.videosLibrary.getFolderAsync(videoFolder).then(onExists, onError);
        } else {
            throw new Exception.DirectoryNotFoundException();
        }
    }

    function onExists(folder) {

        folder.createFileAsync(_fileName, Windows.Storage.CreationCollisionOption.generateUniqueName).done(function (newFile) {

            Utilities.log('録画を開始');

            var storageFile = _storageFile = newFile;
            var encodingProfile = Windows.Media.MediaProperties.MediaEncodingProfile.createMp4(Windows.Media.MediaProperties.VideoEncodingQuality.hd720p);
            mediaCaptureMgr.startRecordToStorageFileAsync(encodingProfile, storageFile).then(function () {
                Media.camera.isCaptureStart = true;
                if (_onCaptureStart) _onCaptureStart(_storageFile);
            });
        });
    }

    function onError() {
        throw new Exception.DirectoryNotFoundException();
    }

    function stopCapture() {

        if (!Media.camera.isCaptureStart) return;

        try {
            mediaCaptureMgr.stopRecordAsync().done(function () {

                Utilities.log('録画を停止');

                Media.camera.isCaptureStart = false;
                if (_onCaptureStop) _onCaptureStop(_storageFile);
            });
        } catch (error) {

            Utilities.log('録画が正常に終了しませんでした');
        }
    }

})();