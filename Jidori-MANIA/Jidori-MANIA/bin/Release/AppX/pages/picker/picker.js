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
        options.defualt = options.defualt ? options.defualt : Manager.settings.tutorialFolder;
        videoDataBinder.listView = listView;
        videoDataBinder.itemFilter = new Jidori.Class.ItemFilter('.filters', 'type');
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

            if (Jidori.selector('.filterbar')) Jidori.selector('.filterbar').addEventListener("click", updateTitle, false);

            if (options.defualt) {
                updateTitle();
            } else {
                Jidori.selector('header .pagesubtitle').textContent = 'すべての動画';
            }
        });
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

    function updateTitle(args) {
        var selected = Jidori.selector('.highlight');
        if (selected) Jidori.selector('header .pagesubtitle').textContent = selected.textContent.split(" (")[0] + ' Folder';
    }

})();
