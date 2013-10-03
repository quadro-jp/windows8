(function () {

    "use strict";

    var page = new Jidori.Class.Page(Jidori.flyout.setting);

    page.onReady = function (element, options) {
        settingsQueryText.value = Manager.settings.queryText;
    }

    page.create();

})();
