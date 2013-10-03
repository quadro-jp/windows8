(function () {

    "use strict";

    var page = new Jidori.Class.Page(Jidori.pages.play);
    
    page.onReady = function (element, options) {
        
        var container = Jidori.selector('.play section');

        this.dualMonitor = new Jidori.Component.DualMonitor(container);
        this.dualMonitor.setVideoPlayer(options);

        if (options.primary && options.primary.name) Windows.Storage.ApplicationData.current.roamingSettings.values["lastTutorial"] = options.primary.name;

        if (Media.camera.isAvailable) {
            if (document.querySelector('#captureButton')) document.querySelector('#captureButton').style.display = '';
        }
    }

    page.onUnload = function () {

        if (document.querySelector('#captureButton')) document.querySelector('#captureButton').style.display = 'none';

        var elements = document.querySelectorAll('video');

        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].pause();
            }
        }

        if (this.dualMonitor) this.dualMonitor.destroy();
    }

    page.create();

})();