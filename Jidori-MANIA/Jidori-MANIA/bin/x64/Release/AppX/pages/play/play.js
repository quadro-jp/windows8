(function () {

    "use strict";

    var page = new Jidori.Class.Page(Jidori.pages.play);
    
    page.onReady = function (element, options) {
        
        var container = Jidori.selector('.play section');

        this.dualMonitor = new Jidori.Component.DualMonitor(container);
        this.dualMonitor.setVideoPlayer(options);
    }

    page.onUnload = function () {

        if (document.getElementById("ytplayer")) document.getElementById("ytplayer").src = '#';
        if (this.dualMonitor) this.dualMonitor.destroy();
    }

    page.create();

})();