(function () {

    "use strict";

    WinJS.Namespace.define('Metro', {
        Class: {},
        hello: hello,
        user: {
            name: null,
            accountPicture: null
        },
        start: start
    });

    Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function (name) {
        Metro.user.name = name;
    });

})();

WinJS.Utilities.ready(function () {

    Metro.start();


    /* 管理クラスを構築します */
    var _viewManager = Manager.create('ViewManager', { "viewState": Windows.UI.ViewManagement.ApplicationView.value }, changeViewState);
    var _applicationViewState;

    Object.defineProperty(Manager, "viewState", {
        get: function () {
            return Manager.getManagementObject('ViewManager').viewState;
        },
        set: function (viewState) {
            Manager.getManagementObject('ViewManager').viewState = viewState;
        }
    });

    function changeViewState(args) {
        Manager.ViewManager.onChange(args);
    }

    function resizeHandler(args) {
        Manager.viewState = Windows.UI.ViewManagement.ApplicationView.value;
    }

});

function hello() {
    console.log('hello. ' + Metro.user.name + '!');
}

function start() {

}