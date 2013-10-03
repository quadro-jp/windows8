(function () {

    "use strict";

    Example.initialize();

    Manager.ViewManager.onChange = function (args) {

        if (args == 2) Manager.page = Jidori.pages.snap;

        if (args != 2 && WinJS.Navigation.history.backStack.length > 0) {
            WinJS.Navigation.back();
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

                if (!WinJS.Navigation.location) {
                    WinJS.Navigation.location.history.current = {
                        location: Application.navigator.home, initialState: {}
                    };
                }

                return Manager.page = 'home';
            }));
        }
    }

    function navigationEventHandler(args) {

        /* ホームに戻ってきたら実行 */
        if (args.detail.location == Jidori.pages.home.uri && args.type == 'navigated') {

        }
    }

    Class.Page.insertReadyFunction = function (element) {

    }

})();