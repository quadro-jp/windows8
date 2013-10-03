(function () {

    "use strict";

    WinJS.Namespace.define('Metro', {
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


    /* 管理クラスを構築します */

    var _pageManager = Manager.create(Example.managers.pageManager, { "pageData": null }, onPageDataChange);
    var _pageData;

    console.log(Manager.page);

    Object.defineProperty(Manager, "page", {
        get: function () {
            return _pageData;
        },
        set: function (pageData) {
            _pageData = pageData;
            Manager.getManagementObject(Example.managers.pageManager).pageData = pageData;
        }
    });

    function onPageDataChange(pageData) {

        //ページへ遷移します。
        if (!pageData) return;
        WinJS.Navigation.navigate(pageData.uri, pageData.options);
        Manager.getManagementObject(Example.managers.pageManager).pageData = null;
    }

    /* 検索チャームから検索された場合の処理 */
    Contract.search.SearchPane.onquerysubmitted = function (args) {
        Example.pages.search.options.queryText = args.queryText;
        Manager.page = Example.pages.search;
    };

    /* フライアウトを設定します */
    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            'about': { title: 'アプリケーションの説明', href: Example.flyout.about.uri },
            'privacy': { title: 'プライバシーポリシー', href: Example.flyout.privacy.uri },
            'options': { title: 'オプション', href: Example.flyout.setting.uri }
        }
        WinJS.UI.SettingsFlyout.populateSettings(e);
    }

});

function hello() {
    console.log('hello. ' + Metro.user.name + '!');
}

function start() {

}