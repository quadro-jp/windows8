(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        AccountPicture: WinJS.Class.define(function AccountPicture(element, options) {

            /// <signature>
            ///   <summary>アカウントの写真を取得します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            ///   <returns type="String" />
            /// </signature>
            
            if (options && options.id) element.id = options.id;

            var image = document.createElement("img");
            image.src = getLargeImage();
            image.style.width = element.style.width;
            image.style.height = element.style.height;

            element.appendChild(image);
        }),

        AccountDisplayName: WinJS.Class.define(function AccountDisplayName(element, options) {
            getDisplayName().done(function (name) { element.textContent = name });
        }),
            
    });

    function getDisplayName() {
        return Windows.System.UserProfile.UserInformation.getDisplayNameAsync();
    }

    function getSmallImage() {
        var image = Windows.System.UserProfile.UserInformation.getAccountPicture(Windows.System.UserProfile.AccountPictureKind.smallImage);
        return URL.createObjectURL(image, { oneTimeOnly: true });
    }

    function getLargeImage() {
        var image = Windows.System.UserProfile.UserInformation.getAccountPicture(Windows.System.UserProfile.AccountPictureKind.largeImage);
        return URL.createObjectURL(image, { oneTimeOnly: true });
    }

})();
