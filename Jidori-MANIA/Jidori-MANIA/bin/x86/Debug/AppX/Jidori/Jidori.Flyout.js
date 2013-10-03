/* フライアウト定義 */
(function () {

    "use strict";

    WinJS.Namespace.define('Flyout', {
        SETTINGS: 0
    });

    WinJS.Namespace.define('Jidori.flyout', {

        show: function (type) {

            switch (type) {

                case 0:
                    //WinJS.UI.SettingsFlyout.showSettings('options', Jidori.flyout.setting);
                    break;
            }
        }
    });

})();