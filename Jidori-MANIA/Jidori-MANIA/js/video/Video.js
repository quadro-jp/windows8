(function () {

    "use strict";

    WinJS.Namespace.define("Video", {
        getFileFromVideosLibrary: getFileFromVideosLibrary
    });

    function getFileFromVideosLibrary(videoFolder, filename, callback) {

        var videosLibrary = Windows.Storage.KnownFolders.videosLibrary;

        return videosLibrary.getFolderAsync(videoFolder).then(function (folder) {
            
            folder.getFileAsync(filename).then(function (storageFile) {
                if (callback) callback(storageFile);
            }, error);
        }, error);
    }

    function error() {
        Jidori.log('ファイルが見つかりませんでした');
    }

})();