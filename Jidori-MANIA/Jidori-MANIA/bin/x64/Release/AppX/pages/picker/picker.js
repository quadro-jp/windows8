(function () {

    "use strict";

    var view = {
        selector: '.resultslist',
        itemTemplate: Template.SearchResultRenderer,
        oniteminvoked: function (args) {
            args.detail.itemPromise.done(function (videoData) {
                Jidori.openVideoData(videoData.data);
            });
        }
    };

    var page = new Jidori.Class.Page(Jidori.pages.picker, view);

    page.onReady = function (element, options) {

        var listView = document.querySelector(view.selector).winControl;
        var videoDataBinder = new Jidori.Class.VideoDataBinder();
        videoDataBinder.listView = listView;
        videoDataBinder.itemFilter = new Jidori.Class.ItemFilter('.filters', 'folder');
        Jidori.selector('header .pagesubtitle').textContent = options.defualt + ' Folder';
        Jidori.selector('section').addClass(options.defualt);
        
        MyDocument.videosLibrary.getFilesAsync().done(function (item) {

            /* ローカル動画情報からバインドデータを生成 */
            var videoData = new Class.VideoData(VideoSource.LOCAL_VIDEO, item);
            videoData.reverse();

            /* バインドデータを追加 */
            if (videoData.length > 1) videoDataBinder.add(videoData);

            /* ビューにデータをバインド */
            videoDataBinder.setListView(listView);
            page.onUpdateLayout();

            var groups = document.querySelectorAll('.filterselect option');
            var defuatIndex = null;

            for (var i = 0; i < groups.length; i++) {
                if (groups[i].innerHTML.split(' (')[0] == options.defualt) {
                    defuatIndex = i;
                    break;
                }
            }

            videoDataBinder.itemFilter._filterChanged(document.querySelector('.filters'), options.defualt ? defuatIndex : 0);
            Jidori.selector('.filterbar').addEventListener("click", updateTitle, false);

            if (options.defualt) {
                updateTitle();
            } else {
                Jidori.selector('header .pagesubtitle').textContent = 'すべての動画';
            }
        });

        /* 生成中のサムネイルを遅延読み込み */
        listView.addEventListener("contentanimating", onAnimating, false);
    }

    page.onUpdateLayout = function (element, viewState, lastViewState) {
        updateLayout(element, viewState, lastViewState);
    }

    page.onUnload = function () {
        if (Jidori.selector('.filterbar')) Jidori.selector('.filterbar').removeEventListener("click", updateTitle);
        Jidori.pages.picker.options.defualt = null;
    }

    page.create();



    function setupListView(element, itemDataSource) {

        var options = {
            itemDataSource: itemDataSource,
            itemTemplate: Template.StorageDataSourceRenderer,
            layout: new WinJS.UI.GridLayout(),
            selectionMode: "single"
        };

        var listView = new WinJS.UI.ListView(element, options);
    }

    function updateLayout(element, viewState) {

        var listView = document.querySelector(view.selector).winControl;

        listView.oniteminvoked = function (args) {
            args.detail.itemPromise.done(function (videoData) {
                Jidori.openVideoData(videoData.data);
            });
        }

        document.querySelector(".resultslist").style.height = Math.floor((screen.height - 160) / 260) * 260 + 'px';
    }


    function onAnimating() {

        var generatingList = Jidori.selectorAll('.generateThumbnail');

        if (generatingList.length > 0) {

            var n = generatingList.length;
            var element, dataSrc, url;

            for (var i = 0; i < n; i++) {

                element = generatingList[i].querySelector('img');
                dataSrc = element.getAttribute('data-src');
                WinJS.Utilities.removeClass(generatingList[i], 'generateThumbnail');
                loadThumbnail(element, { src: dataSrc });
            }
        }
    }

    function updateTitle(args) {
        var selected = Jidori.selector('.highlight');
        if (selected) Jidori.selector('header .pagesubtitle').textContent = selected.textContent.split(" (")[0] + ' Folder';
    }

    function loadThumbnail(element, options) {

        var requestedSize = 190;
        var thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode.picturesView;
        var thumbnailOptions = Windows.Storage.FileProperties.ThumbnailOptions.none;
        var dataSrc = options.src;

        MyDocument.userLibrary.getFileAsync(dataSrc).then(function (storageFile) {
            storageFile.getThumbnailAsync(thumbnailMode, requestedSize, thumbnailOptions).done(function (thumbnail) {
                var url = thumbnail ? URL.createObjectURL(thumbnail, { oneTimeOnly: false }) : 'images/assets/broken.png';
                element.setAttribute('src', url);
            }, function () {
                var url = 'images/assets/broken.png';
                element.setAttribute('src', url);
            });
        });
    }

})();
