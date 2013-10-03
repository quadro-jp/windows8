(function () {

    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    WinJS.strictProcessing();

    app.onactivated = function (e) {

        if (e.detail.kind === activation.ActivationKind.launch) {

            if (e.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                Jidori.log('アプリケーションは新しく起動しました。アプリケーションを初期化します。');
            } else {
                Jidori.log('アプリケーションは中断状態から再度アクティブ化されました。アプリケーションの状態を復元します。');
                try { Manager.page = Jidori.pages.home; } catch (e) { }
            }

            if (app.sessionState.history) nav.history = app.sessionState.history;

            e.setPromise(WinJS.UI.processAll().then(processAllHandler));
        }
    }

    app.oncheckpoint = function (e) { app.sessionState.history = nav.history; };
    app.onready = function (e) { };
    app.start();

    function processAllHandler(e) {

        if (nav.location) {
            nav.history.current.initialPlaceholder = true;
            return nav.navigate(nav.location, nav.state);
        } else {
            if (Windows.UI.ViewManagement.ApplicationView.value == ViewState.SNAPPED) {
                Manager.page = Jidori.pages.snap;
            } else {
                return nav.navigate(Application.navigator.home);
            }
        }
    }
    
})();
