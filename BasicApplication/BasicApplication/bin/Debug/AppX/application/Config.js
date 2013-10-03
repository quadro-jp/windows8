(function () {

    "use strict";

    WinJS.Namespace.define('Settings', {
        APP_NAME: "Jidori",
        VERSION: "1.0",
        DEVELOPER: "createch inc.",
        DEFUALT_USER_FOLDER: 'Jidori-VIDEO',
        DEFUALT_TUTORIAL_FOLDER: 'Jidori-TUTORIAL',
        DEFUALT_SUGGESTED_FILENAME: 'Jidori-Video',
        DEFUALT_QUERY_TEXT: '踊ってみた',
        VIDEO_TYPE: '.mp4',
        PROGRESS_IMAGE: '/images/assets/loading.gif',
        ALT_IMAGE: '/images/assets/broken.png'
    });

    WinJS.Namespace.define('Example', {
        managers: {
            settingsManager: 'settingsmanager',
            pageManager: 'pagemanager',
            monitorManager: 'monitormanager'
        },
        pages: {
            home: { id: 'home', title: 'home', uri: '/pages/home/home.html', options: {} },
            start: { id: 'start', title: 'start', uri: '/pages/start/start.html', options: {} },
            search: { id: 'search', title: 'search', uri: '/pages/search/search.html', options: {} },
            play: { id: 'play', title: 'play', uri: '/pages/play/play.html', options: {} },
            record: { id: 'record', title: 'search', uri: '/pages/play/play.html', options: {} },
            post: { id: 'post', title: 'post', uri: '/pages/post/post.html', options: {} },
            picker: { id: 'picker', title: 'picker', uri: '/pages/picker/picker.html', options: { defualt: null } },
            snap: { id: 'snap', title: 'snap', uri: '/pages/snap/snap.html', options: {} }
        },
        flyout: {
            about: { id: 'about', title: 'about', uri: '/pages/about/about.html', options: {} },
            privacy: { id: 'privacy', title: 'privacy', uri: '/pages/privacy/privacy.html', options: {} },
            setting: { id: 'setting', title: 'options', uri: "/pages/settings/settingFlyout.html", options: {} }
        },
        tables: {
            SETTINGS: 'settings',
        }
    });

})();