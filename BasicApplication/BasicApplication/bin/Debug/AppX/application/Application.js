/* 初期化時の処理を定義 */
(function () {

    "use strict";

    WinJS.Namespace.define('Example', {
        initialize: initialize,
    });



    /* アプリケーション起動時に初期化します */
    function initialize() {
        Manager.page = Example.pages.home;
    }

})();
