/* ユーティリティを定義 */
(function () {

    "use strict";

    WinJS.Namespace.define('Jidori', {

        Class: Class,
        canvas: Canvas,
        contract: Contract,
        Component: Component,
        utils: Utilities,

        //selectorsにマッチした最初のHTMLエレメントを返します。
        selector: Utilities.selector,

        selectorAll: Utilities.selectorAll,

        //ログを出力します。
        log: function (str) {
            Utilities.log(str);
        }
    });

})();



/* 初期化時の処理を定義 */
(function () {

    "use strict";

    WinJS.Namespace.define('Jidori', {
        initialize: initialize,
    });



    /* アプリケーション起動時に初期化します */
    function initialize() {


        /* ストレージを初期化します */


        /* ユーザー設定のデフォルト値 */
        var _defualt = {
            jidoriFolder: Settings.DEFUALT_USER_FOLDER,
            tutorialFolder: Settings.DEFUALT_TUTORIAL_FOLDER,
            videoType: Settings.VIDEO_TYPE,
            queryText: Settings.DEFUALT_QUERY_TEXT
        };

        /* テーブルを作成します */
        Storage.createTables(Jidori.tables);

        /* 設定テーブルにレコードが存在しない場合、デフォルト値を書き込みます */
        if (Storage.getAllRecordFromTable(Jidori.tables.SETTINGS).length == 0) Storage.insertRecordToTable(_defualt, Jidori.tables.SETTINGS);

        /* 設定テーブルにレコードが存在する場合、設定値が妥当かチェックし適宜デフォルト値で上書きします */
        var _settingsRecord = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0];
        var _jidoriFolder = _settingsRecord.jidoriFolder || Settings.DEFUALT_TUTORIAL_FOLDER;
        var _tutorialFolder = _settingsRecord.tutorialFolder || Settings.DEFUALT_USER_FOLDER;
        var _videoType = _settingsRecord.videoType || Settings.VIDEO_TYPE;
        var _queryText = _settingsRecord.queryText || Settings.DEFUALT_QUERY_TEXT;
        var _settings = { jidoriFolder: _jidoriFolder, tutorialFolder: _tutorialFolder, videoType: _videoType, queryText: _queryText };

        /* チェック後の設定を保存 */
        Storage.editRecord(_settings, Jidori.tables.SETTINGS, 0);

        /* ページデータに反映 */
        Jidori.pages.search.options.queryText = _queryText;

        /* 動画の関連情報をチェック */
        checkRelatedData();

        function checkRelatedData() {

            /* 動画の関連付けをチェック */
            var tableList = Storage.getTablesName();

            /* ローカル動画の関連情報をチェック */
            tableList.forEach(function (name) {

                /* 関連動画情報のキーに.を含む場合は、ローカル動画として処理 */
                if (name.indexOf('.') != -1) {
                    checkLocalVideoRelatedData(name);
                }
                /* 関連動画情報のキーに.mp4を含む場合は、ローカル動画として処理 */
                else if (name.indexOf('.youtube') != -1) {
                    checkWebserviceVideoRelatedData(name);
                }

            });
        }

        /* レコードが0件のテーブルを削除 */
        function checkLocalVideoRelatedData(name) {

            if (name == Jidori.tables.SETTINGS) return;

            Jidori.log('◇checkLocalVideoRelatedData ---> ' + name);

            if (Storage.getAllRecordFromTable(name).length == 0) {
                Storage.dropTable(name);
            }
        }

        /* レコードが0件のテーブルを削除 */
        function checkWebserviceVideoRelatedData(folder, name) {

            if (name == Jidori.tables.SETTINGS) return;

            Jidori.log('◆checkWebserviceVideoRelatedData ---> ' + name);

            if (Storage.getAllRecordFromTable(name).length == 0) {
                Storage.dropTable(name);
            }
        }



        /* 管理クラスを構築します */
        var _settingsManager = Manager.create(Jidori.managers.settingsManager, { "settings": null }, onSettingChange);

        Object.defineProperty(Manager, "settings", {
            get: function () {
                return _settings;
            },
            set: function (settings) {
                _settings = settings;

                Manager.getManagementObject(Jidori.managers.settingsManager).settings = settings;
                Storage.editRecord(_settings, Jidori.tables.SETTINGS, 0);
            }
        });

        function onSettingChange(settings) {
            
        }

        var _pageManager = Manager.create(Jidori.managers.pageManager, { "pageData": null }, onPageDataChange);
        var _pageData;

        Object.defineProperty(Manager, "page", {
            get: function () {
                return _pageData;
            },
            set: function (pageData) {
                _pageData = pageData;
                Manager.getManagementObject(Jidori.managers.pageManager).pageData = pageData;
            }
        });

        function onPageDataChange(pageData) {

            //ページへ遷移します。
            if (!pageData) return;
            WinJS.Navigation.navigate(pageData.uri, pageData.options);
            Manager.getManagementObject(Jidori.managers.pageManager).pageData = null;
        }

        var _monitorManager = Manager.create(Jidori.managers.monitorManager, { "video": null }, onVideoDataChange);
        var _video;

        Object.defineProperty(Manager, "video", {
            get: function () {
                return _video;
            },
            set: function (video) {
                _video = video;
                Manager.getManagementObject(Jidori.managers.monitorManager).video = video;
            }
        });

        function onVideoDataChange(video) {

            if (!video) return;

            Jidori.log('動画が変更されます');

            var primaryMonitor = document.querySelector(Component.Monitor.primaryMonitor.selector + ' .video');
            var secondaryMonitor = document.querySelector(Component.Monitor.secondaryMonitor.selector + ' .video');
            var previewMonitor = document.querySelector('#PreviewMonitor');

            if (primaryMonitor) {
                Jidori.log('プライマリモニタを頭出しします');
                if (primaryMonitor.currentTime) {
                    primaryMonitor.currentTime = 0;
                    primaryMonitor.play();
                }
            }

            if (secondaryMonitor) {
                secondaryMonitor.addEventListener('ended', onSecondaryMonitorComplete);
                if (video != '#') {
                    Jidori.log('セカンダリモニタに動画をセットします ' + video);
                    secondaryMonitor.src = video;
                    secondaryMonitor.play();
                }
            } else {
                Jidori.log('異常事態発生！');
            }

            if (previewMonitor) {
                if (video == '#') {
                    Jidori.log('ライブ映像に切り替え');
                    Jidori.selector('#PreviewMonitor').style.display = 'block';
                    $('#PreviewMonitor').stop(true).animate({ 'opacity': 1 }, {
                        complete: function () {
                            secondaryMonitor.src = '#';
                        }
                    });
                    Jidori.selector('.LIVE').style.opacity = 1;
                    Jidori.selector('.REC').style.opacity = 0;
                    Jidori.selector('.LIVE').style.display = 'block';
                    Jidori.selector('.REC').style.display = 'block';
                } else {
                    Jidori.log('自撮り映像に切り替え');
                    $('#PreviewMonitor').stop(true).animate({ 'opacity': 0.0 }, {
                        complete: function () {
                            Jidori.selector('#PreviewMonitor').style.display = 'none';
                        }
                    });
                    Jidori.selector('.LIVE').style.opacity = 0;
                    Jidori.selector('.REC').style.opacity = 0;
                    Jidori.selector('.LIVE').style.display = 'none';
                    Jidori.selector('.REC').style.display = 'none';
                }
            } else {
                Jidori.log('異常事態発生！');
            }
        }

        function onSecondaryMonitorComplete() {
            //Jidori.log('動画再生完了！');
            var player = document.querySelector(Component.Monitor.secondaryMonitor.selector + ' .video');
            if (player) {
                Manager.video = '#';
            }
        }

        /* ユーザーライブラリを定義します */
        WinJS.Namespace.define('MyDocument', {
            userLibrary: null,
            tutorialLibrary: null
        });



        /* ユーザーデバイスをチェックします。 */
        Media.camera.getDeviceInformation();



        /* 検索チャームから検索された場合の処理 */
        Jidori.contract.search.SearchPane.onquerysubmitted = function (args) {
            Jidori.pages.search.options.queryText = args.queryText;
            Manager.page = Jidori.pages.search;
        };



        /* フライアウトを設定します */
        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = {
                'about': { title: 'アプリケーションの説明', href: Jidori.flyout.about.uri },
                'privacy': { title: 'プライバシーポリシー', href: Jidori.flyout.privacy.uri },
                'options': { title: 'オプション', href: Jidori.flyout.setting.uri }
            }
            WinJS.UI.SettingsFlyout.populateSettings(e);
        }
    }

})();




/* 動画読み込みの処理を定義 */
(function () {

    "use strict";

    WinJS.Namespace.define('Jidori', {

        openVideoData: function (videoData) {

            if (videoData.label) return;

            if (videoData.group && videoData.group.folder) {
            
                switch (videoData.group.folder) {

                    case Manager.settings.jidoriFolder:
                        openVideoDataFromMyDance(videoData.fileInformation);
                    break;

                    default:
                        openVideoDataFromMyTutorial(videoData.fileInformation);
                    break;
                }

            }else{
    
                switch (videoData.fileType) {

                    /* ファイルタイプがVideoSource.LOCAL_VIDEOは全て自撮り動画として処理 */
                    case VideoSource.LOCAL_VIDEO: openVideoDataFromMyDance(videoData.fileInformation); break;

                        /* ファイルタイプがVideoSource.MY_VIDEOは自撮り動画以外として処理 */
                    case VideoSource.MY_VIDEO: openVideoDataFromMyTutorial(videoData.fileInformation); break;

                        /* ファイルタイプがVideoSource.YOUTUBEは自撮り動画以外として処理 */
                    case VideoSource.YOUTUBE: openVideoDataFromYoutube(videoData); break;

                    case VideoSource.BLANK: break;
                }
            }
        }
    });

    function openVideoDataFromMyTutorial (videoData) {

        if (videoData) {
            var relatedVideoData = { fileType: VideoSource.BLANK };
            Jidori.pages.play.options = { primary: videoData, secondary: relatedVideoData, zoom: MonitorType.PRIMARY_MONITOR };
            Manager.page = Jidori.pages.play;
        }
    }

    function openVideoDataFromMyDance(videoData) {

        if (videoData) {

            var related = Storage.getLatestRecordsFromTable(1, videoData.name);

            if (related.length > 0) {


                if (related[0].folder) {

                    MyDocument.tutorialLibrary.getFileAsync(related[0].src).then(function (relatedVideoData) {
                        Jidori.pages.play.options = { primary: relatedVideoData, secondary: videoData, zoom: MonitorType.SECONDARY_MONITOR };
                        Manager.page = Jidori.pages.play;
                    },

                    function (error) {

                        /* 暫定処理として関連動画がなければブランクプレーヤーを作成 */

                        var relatedVideoData = { fileType: VideoSource.BLANK }
                        Jidori.pages.play.options = { primary: relatedVideoData, secondary: videoData, zoom: MonitorType.SECONDARY_MONITOR };
                        Manager.page = Jidori.pages.play;
                    });
                }else{
                    Jidori.pages.play.options = { primary: related[0], secondary: videoData, zoom: MonitorType.SECONDARY_MONITOR };
                    Manager.page = Jidori.pages.play;
                }

            } else {

                var relatedVideoData = { fileType: VideoSource.BLANK };
                Jidori.pages.play.options = { primary: relatedVideoData, secondary: videoData, zoom: MonitorType.SECONDARY_MONITOR };
                Manager.page = Jidori.pages.play;
            }
        }
    }

    function openVideoDataFromYoutube(videoData) {

        Jidori.pages.play.options = { primary: videoData, secondary: null, zoom: MonitorType.PRIMARY_MONITOR };
        Manager.page = Jidori.pages.play;
    }

})();