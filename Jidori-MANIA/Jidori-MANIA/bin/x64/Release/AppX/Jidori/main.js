(function () {

    "use strict";

    Jidori.initialize();

    Manager.ViewManager.onChange = function (args) {

        if (args == 2) Manager.page = Jidori.pages.snap;

        if (args != 2 && WinJS.Navigation.history.backStack.length > 0) {
            WinJS.Navigation.back();
        }

        if (args != 2 && WinJS.Navigation.history.backStack.length == 0) {
            Manager.page = Jidori.pages.home;
        }
    }

    Metro.start();

    WinJS.Application.addEventListener(ContentEvent.ACTIVATED, activatedHandler);
    WinJS.Navigation.addEventListener(NavigationEvent.BEFORE_NAVIGATE, navigationEventHandler);
    WinJS.Navigation.addEventListener(NavigationEvent.NAVIGATING, navigationEventHandler);
    WinJS.Navigation.addEventListener(NavigationEvent.NAVIGATED, navigationEventHandler);

    function activatedHandler(e) {

        if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.search) {
            e.setPromise(WinJS.UI.processAll().then(function () {
                if (!WinJS.Navigation.location) WinJS.Navigation.location.history.current = { location: Application.navigator.home, initialState: {} };
                return Jidori.navigate(Jidori.pages.search, { queryText: e.detail.queryText });
            }));
        }
    }

    function navigationEventHandler(args) {

        /* ホームに戻ってきたら実行 */
        if (args.detail.location == Jidori.pages.home.uri && args.type == 'navigated') {

        }

        /* ナビゲーションバック実行時に変数を空にしておく */
        if (args.type == 'navigated') Manager.page = '';
    }

    Jidori.Class.Page.insertReadyFunction = function (element) {

        if (WinJS.Navigation.location != Jidori.pages.play.uri) {
            if (document.querySelector('#rec')) document.querySelector('#rec').style.display = 'none';
            if (document.querySelector('#captureButton')) document.querySelector('#captureButton').style.display = 'none';
        }

        if (!Media.camera.isAvailable) {
            if (document.querySelector('#rec')) document.querySelector('#rec').style.display = 'none';
            if (document.querySelector('#captureButton')) document.querySelector('#captureButton').style.display = 'none';
        }
    }

})();