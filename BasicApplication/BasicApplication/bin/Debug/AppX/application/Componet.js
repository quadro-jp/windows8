/* Header */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        Header: WinJS.Class.define(function Header(element, options) {

            /// <signature>
            ///   <summary>ヘッダーを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            var str = '<button class="win-backbutton" aria-label="Back"></button>' +
                    '<h1 class="titlearea win-type-ellipsis">' +
                    '<img src="/images/assets/logo.png" />' +
                    '<span class="win-type-x-large chevron">　&#xE099;　</span>' +
                    '<span class="win-type-x-large pagesubtitle">' + (options && options.title ? options.title : document.title) + '</span>' +
                    '</h1>';
            element.innerHTML = str;

            element.querySelector('img').onclick = function () {
                if (WinJS.Navigation.location != Application.navigator.home) {
                    Jidori.pages.search.options.queryText = Manager.settings.queryText;
                    Manager.page = Jidori.pages.home;
                }
            }
        }),

        MyVideoButton: WinJS.Class.define(function MyVideoButton(element, options) {

            /// <signature>
            ///   <summaryボタンを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            element.innerHTML = '<div class="ui-select-inner-container local"></div>';
            element.className = 'ui-select-button';
            element.addEventListener('click', function () {
                Jidori.pages.picker.options.defualt = Manager.settings.tutorialFolder;
                Manager.page = Jidori.pages.picker;
            });
        }),

        WebServiceButton: WinJS.Class.define(function WebServiceButton(element, options) {

            /// <signature>
            ///   <summary>ボタンを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            element.innerHTML = '<div class="ui-select-inner-container web"></div>';
            element.className = 'ui-select-button';

            if (navigator.onLine) {
                element.addEventListener('click', function (e) {
                    Jidori.pages.search.options.queryText = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].queryText;
                    Manager.page = Jidori.pages.search;
                });
            } else {
                element.querySelector('.ui-select-inner-container').style.backgroundColor = '#eeeeee';
                element.querySelector('h2').style.color = '#aaaaaa';
            }
        })
    })

})();