(function () {

    "use strict";

    var page = new Jidori.Class.Page(Jidori.flyout.setting);

    page.onReady = function (element, options) {
        //settingsJidoriVideoFolder.value = Manager.settings.jidoriFolder;
        //settingsTutorialVideoFolder.value = Manager.settings.tutorialFolder;
        settingsQueryText.value = Manager.settings.queryText;
    }

    page.create();

})();
