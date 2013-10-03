(function () {
    "use strict";

    WinJS.Namespace.define("ToastNotification", {
        show: show
    });

    function show(image, message) {
        var toast = createToast(image, message);
        getNotifier().show(new Windows.UI.Notifications.ToastNotification(toast));
    }

    function createToast(image, message) {
        var toastTemplate = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(Windows.UI.Notifications.ToastTemplateType.toastImageAndText01);
        var imageNodes = toastTemplate.getElementsByTagName("image");
        imageNodes[0].setAttribute("src", image);
        var textNodes = toastTemplate.getElementsByTagName("text");
        textNodes[0].appendChild(toastTemplate.createTextNode(message));

        return toastTemplate;
    }

    function getNotifier() {
        return Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
    }

})();