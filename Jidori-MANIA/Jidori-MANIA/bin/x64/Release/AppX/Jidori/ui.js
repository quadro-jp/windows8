(function () {

    "use strict";

    WinJS.Application.addEventListener(ContentEvent.READY, readyHandler);

    function readyHandler(e) {

        // アプリバーを設定
        document.getElementById("home").addEventListener("click", clickHandler, false);
        //document.getElementById("search").addEventListener("click", clickHandler, false);
        //document.getElementById("play").addEventListener("click", clickHandler, false);
        //document.getElementById("rec").addEventListener("click", clickHandler, false);
        document.getElementById("post").addEventListener("click", clickHandler, false);
        document.getElementById("policy").addEventListener("click", clickHandler, false);
        //document.getElementById("settings").addEventListener("click", clickHandler, false);
    }

    function clickHandler(e) {

        switch (e.target.id) {

            case 'home':

                Manager.page = Jidori.pages.home;


                break;

            case 'search':

                Jidori.pages.search.options.queryText = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].queryText;
                Manager.page = Jidori.pages.search;

                break;

            case 'play':

                Manager.page = Jidori.pages.pickerTutorial;

                break;

            case 'rec':

                

                break;

            case 'post':

                Manager.page = Jidori.pages.post;

                break;

            case 'policy':

                Manager.page = Jidori.pages.policy;

                break;

            default:

                break;
        }
    }

})();
