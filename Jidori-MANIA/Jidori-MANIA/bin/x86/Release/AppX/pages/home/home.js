﻿(function () {

    "use strict";
    
    var videosLibrary = Windows.Storage.KnownFolders.videosLibrary;
    var jidoriFolder = Manager.settings.jidoriFolder;
    var tutorialFolder = Manager.settings.tutorialFolder;

    var view = new Jidori.Class.ViewData({
        selector: '.listView',
        itemTemplate: Template.SearchResultRenderer,
        oniteminvoked: function (args) {
            args.detail.itemPromise.done(function (videoData) {
                Jidori.openVideoData(videoData.data);
            });
        }
    });

    var page = new Jidori.Class.Page(Jidori.pages.home, view);

    page.onReady = function (element, options) {

        setupNavigation();

        MyDocument.createUserLibrary(videosLibrary, 'userLibrary', Manager.settings.jidoriFolder, function () {
            MyDocument.createUserLibrary(videosLibrary, 'tutorialLibrary', Manager.settings.tutorialFolder, setupContent);
        });
    }

    page.onUpdateLayout = function (element, viewState, lastViewState) {
        if (window.innerWidth < 1280) {
            image.style.display = 'none';
        } else {
            image.style.display = 'block';
        }
    }

    page.create();

    function setupNavigation() {
    
        var start = Jidori.canvas.draw('navigation', 0, 0, 420, 125);
        var search = Jidori.canvas.fill('navigation', 0, 130, [{ x: 140, y: 130 }, { x: 165, y: 165 }, { x: 140, y: 200 }, { x: 0, y: 200 }]);
        var play = Jidori.canvas.fill('navigation', 145, 130, [{ x: 245, y: 130 }, { x: 270, y: 165 }, { x: 245, y: 200 }, { x: 145, y: 200 }, { x: 170, y: 165 }]);
        var record = Jidori.canvas.fill('navigation', 250, 130, [{ x: 420, y: 130 }, { x: 420, y: 200 }, { x: 250, y: 200 }, { x: 275, y: 165 }]);
        
        start.addEventListener('click', function () {
            Manager.page = Jidori.pages.start;
        });

        search.addEventListener('click', function () {
            Jidori.contract.search.SearchPane.show();
            return;
            Jidori.pages.search.options.queryText = Manager.settings.queryText;
            Manager.page = Jidori.pages.search;
        });

        play.addEventListener('click', function () {
            Jidori.pages.picker.options.defualt = Manager.settings.jidoriFolder;
            Manager.page = Jidori.pages.picker;
        });

        record.addEventListener('click', function () {
            Manager.page = Jidori.pages.record;
        });

    }

    function setupContent() {

        var listView = Jidori.selector(view.selector).winControl;
        var videoDataBinder = new Jidori.Class.VideoDataBinder();

        videoDataBinder.search(VideoSource.YOUTUBE, Jidori.pages.search.options.queryText).done(function (bindingList) {

            /* 検索結果にローカルの動画情報を追加 */
            MyDocument.tutorialLibrary.getFilesAsync().done(function (item) {

                /* ローカル動画情報からバインドデータを生成 */
                var videoData = new Class.VideoData(VideoSource.LOCAL_VIDEO, item);
                //videoData.reverse();

                /* バインドデータを追加 */
                if (videoData.length > 1) bindingList.unshift(videoData);

                MyDocument.userLibrary.getFilesAsync().done(function (item) {

                    /* ローカル動画情報からバインドデータを生成 */
                    var videoData = new Class.VideoData(VideoSource.LOCAL_VIDEO, item);
                    //videoData.reverse();

                    /* バインドデータを追加 */
                    if (videoData.length > 1) bindingList.unshift(videoData);

                    /* ビューにデータをバインド */
                    videoDataBinder.setListView(listView);
                });
            });
        });
    }

})();
