(function () {

    "use strict";

    WinJS.Application.addEventListener(ContentEvent.READY, readyHandler);

    function readyHandler(e) {

        // アプリバーを設定
        document.getElementById("home").addEventListener("click", clickHandler, false);
        document.getElementById("captureButton").addEventListener("click", clickHandler, false);

        /* アプリケーションバーを定義 */
        Jidori.applicationBar = document.getElementById('applicationBar').winControl;
    }

    function clickHandler(e) {

        switch (e.target.id) {

            case 'home':

                if (WinJS.Navigation.location != Application.navigator.home) {
                    Jidori.pages.search.options.queryText = Manager.settings.queryText;
                    Manager.page = Jidori.pages.home;
                }

                break;

            case 'search':

                Jidori.pages.search.options.queryText = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].queryText;
                Manager.page = Jidori.pages.search;

                break;

            case 'captureButton':

                Jidori.player.capture.toggle();

                break;

            default:

                break;
        }

        Jidori.applicationBar.hide();
    }

})();
