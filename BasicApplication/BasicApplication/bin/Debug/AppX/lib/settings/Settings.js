(function () {

    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;
    WinJS.strictProcessing();

    WinJS.Namespace.define('Settings', {
        APP_NAME: "Metro",
        VERSION: "1.0",
        DEVELOPER: "createch inc.",
    });

    //window.Jidori = window;

    /* Application */
    WinJS.Namespace.define(Settings.APP_NAME, {});

    /* contract */
    WinJS.Namespace.define("Contract", {});
    WinJS.Namespace.define("FilePicker", {});
    WinJS.Namespace.define("Search", {});
    WinJS.Namespace.define("ViewMode", {});

    /* display */
    WinJS.Namespace.define('Canvas', {});
    WinJS.Namespace.define('Component', {});
    WinJS.Namespace.define('ToastNotification', {});

    /* events */
    WinJS.Namespace.define('ContentEvent', {});
    WinJS.Namespace.define('NavigationEvent', {});

    /* exception */
    WinJS.Namespace.define('Exception', {});

    /* file */
    WinJS.Namespace.define('MyDocument', {});

    /* manager */
    WinJS.Namespace.define('Manager', {});

    /* media */
    WinJS.Namespace.define('Media', {});
    WinJS.Namespace.define('VideoSource', {});
    
    /* net */
    WinJS.Namespace.define("Template", {});

    /* storage */
    WinJS.Namespace.define("Storage", {});

    /* utils */
    WinJS.Namespace.define("Utilities", {});

    /* video */
    WinJS.Namespace.define("Video", {});

})();