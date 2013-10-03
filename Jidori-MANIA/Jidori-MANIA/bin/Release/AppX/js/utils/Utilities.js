/* Date */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        getDateString: getDateString

    });

    function getDateString () {

        var date = new Date();

        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        return yy + '-' + mm + '-' + dd + '_' + h + '-' + m + '-' + s;
    }

})();



/* Numeric */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        formatDoubleDigit: formatDoubleDigit

    });

    function formatDoubleDigit(number) {
        return (number < 10) ? "0" + number : "" + number;
    }

})();



/* Storage */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        state: {

            _selected: 0,

            set selected(value) {
                this._selected = value;
            },
            get selected() {
                return this._selected;
            },

            getScrollPosition: function () {
                return Windows.Storage.ApplicationData.current.roamingSettings.values['scrollPosition'];
            },

            setScrollPosition: function (selectors) {
                var element = document.querySelector(selectors);

                if (element) {
                    var position = element.winControl._view.listView._lastScrollPosition + 'px';
                    Windows.Storage.ApplicationData.current.roamingSettings.values['scrollPosition'] = position;
                }
            }
        }
    });

})();

/* Media */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        media: {
            getSuggestedFileName: function (name) { return Utilities.getDateString() + '_' + name.split('.')[0] + '.mp4' },
            getEncodingProfile: Windows.Media.MediaProperties.MediaEncodingProfile.createMp4(Windows.Media.MediaProperties.VideoEncodingQuality.auto),
            generateUniqueName: Windows.Storage.CreationCollisionOption.generateUniqueName,
            
            replaceExisting: function () {
                return Windows.Storage.CreationCollisionOption.replaceExisting;
            },
            videoData: {}
        }

    });

})();


/* Object */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        setProperties: function (object, properties) {
            for (var key in properties) {
                object[key] = properties[key];
            }
        },
        getUniqueArray: function (array) {
        var storage = {};
        var uniqueArray = [];
        var i, value;
        for (i = 0; i < array.length; i++) {
            value = array[i];
            if (!(value in storage)) {
                storage[value] = true;
                uniqueArray.push(value);
            }
        }
        return uniqueArray;
    }

    });

})();

/* selector */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {
        
        //selectorsにマッチした最初のHTMLエレメントを返します。
        selector: function (selectors) {

            var element = document.querySelector(selectors);

            if (!element) return;

            element.addClass = function (className) {
                WinJS.Utilities.addClass(element, className);
                return element;
            }

            element.removeClass = function (className) {
                WinJS.Utilities.removeClass(element, className);
                return element;
            }

            element.hasClass = function (className) {
                return WinJS.Utilities.hasClass(element, className);
            }
            element.toggleClass = function (a, b) {
                WinJS.Utilities.hasClass(element, a) ? WinJS.Utilities.removeClass(element, a) : WinJS.Utilities.addClass(element, a);
                WinJS.Utilities.hasClass(element, b) ? WinJS.Utilities.removeClass(element, b) : WinJS.Utilities.addClass(element, b);
                return element;
            }

            return element;
        },

        selectorAll: function (selectors) {
            return document.querySelectorAll(selectors);
        },

        empty: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.empty">
            /// <summary locid="WinJS.Utilities.empty">
            /// Removes all the child nodes from the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" domElement="true" locid="WinJS.Utilities.empty_p:element">
            /// The element.
            /// </param>
            /// <returns type="HTMLElement" locid="WinJS.Utilities.empty_returnValue">
            /// The element.
            /// </returns>
            /// </signature>
            if (element.childNodes && element.childNodes.length > 0) {
                for (var i = element.childNodes.length - 1; i >= 0; i--) {
                    element.removeChild(element.childNodes.item(i));
                }
            }
            return element;
        }

    });

})();

/* log */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        //ログを出力します。
        log: function (str) {

            try { console.log(Settings.APP_NAME + '.log [ ' + str + ' ]'); } catch (e) { }
        }
    });

})();

/* Message */
(function () {

    "use strict";

    WinJS.Namespace.define('Utilities', {

        //ダイアログを表示します。
        showDialog: function showDialog(message, ok, cancel) {
                var msg = new Windows.UI.Popups.MessageDialog(message);
                msg.commands.append(new Windows.UI.Popups.UICommand("はい", ok));
                msg.commands.append(new Windows.UI.Popups.UICommand("いいえ", cancel || function () { }));
                msg.defaultCommandIndex = 0;
                msg.cancelCommandIndex = 1;
                msg.showAsync();
        }
    });

})();