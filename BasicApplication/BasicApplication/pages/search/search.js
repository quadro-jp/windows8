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
    
    var page = new Jidori.Class.Page(Jidori.pages.search, view);
    
    page.onReady = function (element, options) {

        var listView = document.querySelector(".resultslist").winControl;
        var videoDataBinder = new Jidori.Class.VideoDataBinder();
        videoDataBinder.listView = listView;
        videoDataBinder.itemFilter = new Jidori.Class.ItemFilter('.filters', 'category');
        videoDataBinder.search(VideoSource.YOUTUBE, options.queryText);

        document.querySelector(".titlearea .pagesubtitle").textContent = "Results for “" + options.queryText + '”';
        
        page.onUpdateLayout();
    }

    page.onUpdateLayout = function (element, viewState, lastViewState) {
        document.querySelector(".resultslist").style.height = Math.floor((screen.height - 160) / 260) * 260 + 'px';
    }

    page.onUnload = function () { }

    page.create();

    function handler(e) {
        var listView = document.querySelector(".resultslist").winControl;
        listView.ensureVisible(Jidori.utils.state.selected);
        listView.removeEventListener("contentanimating", handler, false);
        e.preventDefault();
    }

})();
