(function () {
    "use strict";

    WinJS.Namespace.define("Search", {
        searchAsync: searchAsync,
        SearchPane: Windows.ApplicationModel.Search.SearchPane.getForCurrentView()
    });

    /*
    動画サービスから動画を検索します。searchAsyncは、非同期で動作します。
    */
    function searchAsync(source, url) {

        return WinJS.xhr({ url: url }).then(function (data) {
            var json = JSON.parse(data.responseText);
            return json;
        },
        function (error) { });
    }

    Contract.addContract('search', Search);

})();
