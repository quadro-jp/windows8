(function () {

    "use strict";

    WinJS.Application.addEventListener(ContentEvent.READY, readyHandler);

    function readyHandler(e) {

        // アプリバーを設定
        document.getElementById("home").addEventListener("click", clickHandler, false);
        document.getElementById("captureButton").addEventListener("click", clickHandler, false);

        /* アプリケーションバーを定義 */
        Example.applicationBar = document.getElementById('applicationBar').winControl;
    }

    function clickHandler(e) {

        switch (e.target.id) {

            case 'home':

                if (WinJS.Navigation.location != Application.navigator.home) {
                    Example.pages.search.options.queryText = Manager.settings.queryText;
                    Manager.page = Jidori.pages.home;
                }

                break;

            case 'search':

                Example.pages.search.options.queryText = Storage.getLatestRecordsFromTable(1, Example.tables.SETTINGS)[0].queryText;
                Manager.page = Example.pages.search;

                break;

            case 'captureButton':

                Example.player.capture.toggle();

                break;

            default:

                break;
        }

        Jidori.applicationBar.hide();
    }

})();
