﻿// ページ コントロール テンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    //プライバシーポリシーの URL
    var privacyURL = "http://www.createch.jp/privacy.html";

    WinJS.UI.Pages.define("/pages/privacy/privacy.html", {
        // この関数は、ユーザーがこのページに移動するたびに呼び出されます。
        // ページ要素にアプリケーションのデータを設定します。
        ready: function (element, options) {
            // TODO: ここでページを初期化します。
            Windows.System.Launcher.launchUriAsync(Windows.Foundation.Uri(privacyURL));
        },

        unload: function () {
            // TODO: このページからの移動に対応します。
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: viewState の変更に対応します。
        }
    });
})();
