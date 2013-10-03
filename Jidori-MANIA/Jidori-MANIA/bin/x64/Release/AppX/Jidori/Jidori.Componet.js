/* Header */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        Header: WinJS.Class.define(function Header(element, options) {

            /// <signature>
            ///   <summary>ヘッダーを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            var str = '<button class="win-backbutton" aria-label="Back"></button>' +
                    '<h1 class="titlearea win-type-ellipsis">' +
                    '<img src="/images/assets/logo.png" />' +
                    '<span class="win-type-x-large chevron">　&#xE099;　</span>' +
                    '<span class="win-type-x-large pagesubtitle">' + (options && options.title ? options.title : document.title) + '</span>' +
                    '</h1>';
            element.innerHTML = str;

            element.querySelector('img').onclick = function () {
                if (WinJS.Navigation.location == Application.navigator.home) return;
                WinJS.Navigation.navigate(Application.navigator.home);
            }
        })
    });

})();

/* Monitor */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        Monitor: WinJS.Class.define(function Monitor(element, monitorType) {

            /// <signature>
            ///   <summary>モニタークラス</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="type" type="Number">モニタータイプ</param>
            /// </signature>

            if (!element || !monitorType) throw new Exception.IllegalArgumentException();

            this.element = element;
            this.element.id = getElementIdByType(monitorType);
            this.monitorType = monitorType;

            /* ローカル動画情報からバインドデータを生成 */
            var videoDataBinder = new Class.VideoDataBinder();
            this.bindingList = videoDataBinder._bindingList;
            this.setListView = videoDataBinder.setListView.bind(videoDataBinder);
            
        }, {
            
            videoDataBinder: null,
            element: null,
            monitorType: null,
            state: null,
            videoData: null,
            hasVideoPlayer: false,
            setVideoPlayer: function setVideoPlayer(videoData) {

                /// <signature>
                ///   <summary>ビデオプレーヤーを作成します。</summary>
                ///   <param name="list" monitorType="videoData">html要素</param>
                /// </signature>

                if (!videoData) throw new Exception.IllegalArgumentException();

                this.videoData = videoData;
                this.hasVideoPlayer = true;

                if (this.videoData.fileType == VideoSource.BLANK) this.hasVideoPlayer = false;
                if (this.videoData && !this.videoData.fileType) this.hasVideoPlayer = false;
                if (this.element) getVideoPlayerByVideoData(this);
            },
            removeVideoPlayer: function () {

                /// <signature>
                ///   <summary>ビデオプレーヤーを削除します。</summary>
                /// </signature
                
                if (Jidori.selector('#ytplayer')) Jidori.selector('#ytplayer').src = '#';

                Utilities.empty(this.element);

                this.videoData = null;
                this.hasVideoPlayer = false;
            },
            setMonitorSize: function (state) {

                /// <signature>
                ///   <summary>ビデオプレーヤーを作成します。</summary>
                ///   <param name="state" type="Number">html要素</param>
                /// </signature>

                if (!state) throw new Exception.IllegalArgumentException();

                this.state = state;
                
                try {
                    switch (state) {

                        case MonitorState.LARGE :

                            this.element.className = 'largeMonitor';
                            this.element.styles({ 'width': screen.width - 100 - 320 + 'px', 'height': screen.height - 120 - 70 + 'px' });
                            break;

                        case MonitorState.SMALL :

                            this.element.className = 'smallMonitor';
                            this.element.styles({ 'width': 320 + 'px', 'height': 240 + 'px' });
                            break;
                    }
                } catch (error) { Jidori.log('要素を取得できませんでした。'); }

            },
            destroy: function () {
                if (this.element) this.element = null;
            }

        }, {
            primaryMonitor: {
                id: 'primaryMonitor',
                selector: '#primaryMonitor'
            },

            secondaryMonitor: {
                id: 'secondaryMonitor',
                selector: '#secondaryMonitor'
            }
        })
    });

    function getElementIdByType(monitorType) {

        if (!monitorType) throw new Exception.IllegalArgumentException();

        return monitorType == 0 ? Component.Monitor.primaryMonitor.id : Component.Monitor.secondaryMonitor.id;
    }

    function getVideoPlayerByVideoData(monitor) {

        var element = monitor.element, videoData = monitor.videoData, player;

        switch (videoData.fileType) {

            case VideoSource.LOCAL_VIDEO:
                player = new Jidori.Component.LocalVideoPlayer(element, videoData, true);
                break;

            case VideoSource.MY_VIDEO:
                player = new Jidori.Component.LocalVideoPlayer(element, videoData, true);
                break;

            case VideoSource.YOUTUBE:
                player = new Jidori.Component.YoutubeVideoPlayer(element, videoData, false);
                break;

            case VideoSource.BLANK:
                player = new Jidori.Component.BlankVideoPlayer(element, null);
                break;

            default:
                player = new Jidori.Component.LocalVideoPlayer(element, videoData, true);
                break;
        }

        return player;
    }
})();

/* DualMonitor */
(function () {

    "use strict";

    var isCaptureStart = false;
    var isDrag = false;
    var isMouseDown = false;
    var isAnimation = false;

    WinJS.Namespace.define("Component", {

        DualMonitor: WinJS.Class.define(function DualMonitor(element) {

            /// <signature>
            ///   <summary>２画面ビデオプレーヤーのコンテナを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            /// </signature>

            if (!element) throw new Exception.IllegalArgumentException();

            this.element = element;
            this.element.id = DualMonitor.id;

            Jidori.player = this;

        }, {
            element: null,
            primaryMonitor: null,
            secondaryMonitor: null,
            previewMonitor: null,
            videoData: null,
            setVideoPlayer: function(videoData){

                /// <signature>
                ///   <summary>２画面ビデオプレーヤーを作成します。</summary>
                ///   <param name="videoData" type="videoData">２画面分のビデオ情報オブジェクト</param>
                /// </signature>
                
                if (!videoData) videoData = Component.DualMonitor.defaultData;
                if (!videoData.primary) videoData.primary = { fileType: VideoSource.BLANK };
                if (!videoData.secondary) videoData.secondary = { fileType: VideoSource.BLANK };

                this.videoData = videoData;

                createElement(this);
                setZoomMonitor(this);

                var relatedVideoListContainer = document.querySelector('.largeMonitor .RelatedVideoListContainer')
                if (relatedVideoListContainer) {
                    setVideoListPosition();
                    relatedVideoListContainer.style.opacity = 1;
                }

                var primaryMonitor = this.primaryMonitor.element.querySelector('video');
                var secondaryMonitor = this.secondaryMonitor.element.querySelector('video');

                /* ドラッグでシークバーを操作は実装保留
                $('body').on('mousedown', function (e) {
                    isMouseDown = true;
                    isDrag = false;
                });

                $('body').on('mouseup', function (e) {
                    isMouseDown = false;
                });

                $('body').on('mousemove', function (e) {
                    if (!isMouseDown) return;
                    if (!primaryMonitor) return;
                    if (document.getElementById("ytplayer")) return;

                    isDrag = true;

                    var ratio = e.clientX / screen.width;
                    var currentTime = primaryMonitor.duration * ratio;
                    
                    if (currentTime <= secondaryMonitor.duration) secondaryMonitor.currentTime = currentTime;
                    if (currentTime <= primaryMonitor.duration) primaryMonitor.currentTime = currentTime;
                });
                */

                this.primaryMonitor.element.addEventListener('click', toggleMonitor, false);
                this.secondaryMonitor.element.addEventListener('click', toggleMonitor, false);

                function primaryMonitorClickHandler(e) {
                    if (isDrag) {
                        isDrag = false;
                        return;
                    }
                    Jidori.log('clickTarget::' + e.target.className);
                    Jidori.log('primaryMonitorClickHandler::' + e.currentTarget.id);
                    primaryMonitor.className = 'largeMonitor';
                    secondaryMonitor.className = 'smallMonitor';
                    switchMonitor();
                }

                function secondaryMonitorClickHandler(e) {
                    if (isDrag) {
                        isDrag = false;
                        return;
                    }
                    Jidori.log('clickTarget::' + e.target.className);
                    Jidori.log('secondaryMonitorClickHandler::' + e.currentTarget.id);
                    primaryMonitor.className = 'smallMonitor';
                    secondaryMonitor.className = 'largeMonitor';
                    switchMonitor();
                }

            },
            toggleMonitor: toggleMonitor,
            capture: {
                toggle: function () {
                    isCaptureStart ? stopCapture() : execCapture();
                },
                stopCapture: stopCapture
            },
            setCountDown: function(){

                var videoData = Jidori.player.primaryMonitor.videoData;
                var list = Jidori.player.primaryMonitor.list;
                var monitor = Jidori.player.primaryMonitor;

                Utilities.media.videoData = videoData;
                Utilities.media.list = list;

                Jidori.player.isCountDownComplete = false;
                Jidori.player.primaryMonitor.removeVideoPlayer();
                Manager.video = '#';

                var jidoriFolder = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].jidoriFolder;
                var countdown = new Jidori.Component.CountDown(Jidori.player.primaryMonitor.element, function (monitor) {
                    try {

                        Jidori.player.isCountDownComplete = true;
                        Jidori.player.removeCountDown();

                        //録画開始時の処理
                        var videoData = Jidori.player.primaryMonitor.videoData;

                        /* ファイル名 */
                        var filename = Utilities.media.getSuggestedFileName(videoData.name);

                        Media.camera.execCapture(jidoriFolder, filename, onCaptureStart, onCaptureStop);

                    } catch (error) { Jidori.log(error); }

                    function onCaptureStart(storageFile) {
                        Jidori.selector('.LIVE').style.opacity = 0;
                        Jidori.selector('.REC').style.opacity = 1;

                        var primaryMonitor = document.querySelector(Component.Monitor.primaryMonitor.selector + ' .video');

                        if (primaryMonitor) {
                            primaryMonitor.addEventListener('ended', onPrimaryMonitorComplete);
                            Jidori.log('プライマリモニタにイベントハンドラを追加！');
                        }
                    }

                    function onPrimaryMonitorComplete() {

                        Jidori.log('プライマリモニタ動画再生完了！');

                        var primaryMonitor = document.querySelector(Component.Monitor.primaryMonitor.selector + ' .video');

                        if (primaryMonitor) {
                            Jidori.player.capture.stopCapture();
                            primaryMonitor.removeEventListener('ended', onPrimaryMonitorComplete);
                        }
                    }

                    function onCaptureStop(storageFile) {
                        Jidori.selector('.LIVE').style.opacity = 1;
                        Jidori.selector('.REC').style.opacity = 0;
                        Storage.setRelationData(videoData.name, videoData, storageFile);
                        Storage.setRelationData(storageFile.name, storageFile, videoData);

                        var capturedVideoData = new Class.FileInformationParser([storageFile], false);
                        Jidori.player.secondaryMonitor.bindingList.unshift(capturedVideoData);
                    }
                });
            },
            removeCountDown: function () {

                try {
                    var videoData = Utilities.media.videoData;
                    var list = Utilities.media.list;

                    Jidori.player.primaryMonitor.removeVideoPlayer();
                    Jidori.player.primaryMonitor.setVideoPlayer(videoData, list);

                    if (Jidori.player.isCountDownComplete) {
                        Jidori.player.isCountDownComplete = false;
                        //Jidori.selector('#primaryMonitor video').pause();
                    }
                } catch (error) { Jidori.log('デュアルモニタ　録画停止に失敗しました。'); }
            },
            destroy: function () {

                this.primaryMonitor.destroy();
                this.secondaryMonitor.destroy();
                Utilities.media.videoData = null;
                Manager.video = null;
                Media.camera.destroy();
                Jidori.camera = null;
                Jidori.player = null;
            }

        }, {
            id: 'DualMonitor',
            selector: '#DualMonitor',
            defaultData: {
                primary: { fileType: VideoSource.BLANK },
                secondary: { fileType: VideoSource.BLANK },
                zoom: MonitorType.PRIMARY_MONITOR
            }
        })
    });

    function createElement(dualMonitor) {

        var element = dualMonitor.element;
        var videoData = dualMonitor.videoData;
        var primaryMonitor = document.createElement('div')
        var secondaryMonitor = document.createElement('div');

        primaryMonitor.id = Component.Monitor.primaryMonitor.id;
        secondaryMonitor.id = Component.Monitor.secondaryMonitor.id;
        element.appendChild(primaryMonitor);
        element.appendChild(secondaryMonitor);

        dualMonitor.primaryMonitor = new Jidori.Component.Monitor(primaryMonitor, MonitorType.PRIMARY_MONITOR);
        dualMonitor.primaryMonitor.setVideoPlayer(videoData.primary);
        dualMonitor.secondaryMonitor = new Jidori.Component.Monitor(secondaryMonitor, MonitorType.SECONDARY_MONITOR);
        dualMonitor.secondaryMonitor.setVideoPlayer(videoData.secondary);

        /* プレビューモニターは常時生成 */
        dualMonitor.previewMonitor = new Jidori.Component.PreviewMonitor(dualMonitor.secondaryMonitor.element.querySelector('.VideoContainer'));
    }

    function setZoomMonitor(dualMonitor) {

        var monitorType = dualMonitor.videoData.zoom;

        switch (monitorType) {

            case MonitorType.PRIMARY_MONITOR:

                dualMonitor.primaryMonitor.setMonitorSize(MonitorState.LARGE);
                dualMonitor.secondaryMonitor.setMonitorSize(MonitorState.SMALL);

                break;

            case MonitorType.SECONDARY_MONITOR:

                dualMonitor.primaryMonitor.setMonitorSize(MonitorState.SMALL);
                dualMonitor.secondaryMonitor.setMonitorSize(MonitorState.LARGE);

                break;
        }
    }

    function toggleMonitor(e) {

        if (isAnimation) return;

        try {

            if (e) {

                if (isCaptureStart) return;

                var id = e.target.id ? e.target.id : 'unkown';
                var className = e.target.className ? e.target.className : 'unkown';

                if (className.indexOf('win') != -1) return;
                if (className.indexOf('item') != -1) return;
                if (className.indexOf('unkown') != -1) return;
                Jidori.log('id > ' + id + ', class > ' + className);

                toggleClass();
                switchMonitor();

            } else {
                toggleClass();
                switchMonitor();
            }

        } catch (error) {

        }
    }

    function toggleClass() {

        Jidori.selector('#primaryMonitor').toggleClass('largeMonitor', 'smallMonitor');
        Jidori.selector('#secondaryMonitor').toggleClass('largeMonitor', 'smallMonitor');
        Jidori.log(Jidori.selector('#primaryMonitor').className + ", " + Jidori.selector('#secondaryMonitor').className);
    }

    function switchMonitor() {

        Jidori.log('switchMonitor');
        isAnimation = true;

        setVideoListPosition();

        $('.largeMonitor').stop(true).animate({ width: screen.width - 100 - 320, height: screen.height - 120 - 70 });
        $('.smallMonitor').stop(true).animate({ width: 320, height: 240 }, {
            complete: function () {
                $('.RelatedVideoListContainer').stop(true).animate({ 'opacity': '1' }, {
                    complete: function () { isAnimation = false; }, duration: 250
                });
            }
        });
    }

    function setVideoListPosition() {
        var listContainerHeight = $('.RelatedVideoListContainer').outerHeight();
        var listContainerWidth = $('.RelatedVideoListContainer').outerWidth() + 20;
        $('.largeMonitor .RelatedVideoListContainer').css({ top: -listContainerHeight, left: -listContainerWidth, 'opacity': 0 });
        $('.smallMonitor .RelatedVideoListContainer').css({ top: 20, left: 0, 'opacity': 0 });
    }
    function execCapture() {

        if (WinJS.Navigation.location != Jidori.pages.play.uri) {
            Utilities.showDialog('カメラを起動しますか？', function () { Manager.page = Jidori.pages.play; });
            return;
        }

        if (!Jidori.player.primaryMonitor.hasVideoPlayer) {
            Utilities.showDialog('お手本動画が選択されていません。お手本動画を選択しますか？', function () {
                Manager.page = Jidori.pages.start;
            });
            return;
        };

        if (Media.camera.isPreviewStart) {

            Utilities.showDialog('5秒後録画を開始します。録画を開始しますか？', function () {
                tryCapture();
            });
        }
    }

    function tryCapture() {

        try {
            isCaptureStart = true;
            if (Jidori.selector('#secondaryMonitor').hasClass('largeMonitor')) Jidori.player.toggleMonitor();
            Jidori.player.setCountDown();
            Jidori.selector('#Controller #captureButton').querySelector('.win-label').textContent = 'stop';
        } catch (error) {
            isCaptureStart = false;
            Jidori.selector('#Controller #captureButton').querySelector('.win-label').textContent = 'capture';
            Jidori.log('tryCapture > ' + error);
        }
    }
    function stopCapture() {

        try {

            if (isCaptureStart) Media.camera.stopCapture();

            isCaptureStart = false;
            Jidori.player.removeCountDown();
            Jidori.selector('#Controller #captureButton .win-label').textContent = 'capture';

        } catch (error) {

            isCaptureStart = false;
            Jidori.player.removeCountDown();
            Jidori.selector('#Controller #captureButton .win-label').textContent = 'capture';
        }
    }

})();

/* BlankVideoPlayer */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        BlankVideoPlayer: WinJS.Class.define(function BlankVideoPlayer(element, videoData, controls) {

            /// <signature>
            ///   <summary>空のビデオプレーヤーを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="file" type="string">ファイルの場所を表す文字列。</param>
            ///   <param name="controls" type="boolean">コントローラーを表示するか。</param>
            /// </signature>

            var container = document.createElement('div');
            container.className = 'VideoContainer';
            element.appendChild(container);

            if (element.id == Component.Monitor.primaryMonitor.id) {

                var blankPlayer = document.createElement('div');
                blankPlayer.className = 'BlankPlayer';
                container.appendChild(blankPlayer);

                var inner = document.createElement('div');
                inner.className = 'inner-container';
                blankPlayer.appendChild(inner);
                inner.addEventListener('click', clickHandler);

            } else {
                
                var video = document.createElement('video');
                container.appendChild(video);

                video.className = 'video';
                video.controls = controls || false;
            }

            this.videoList = new Jidori.Component.VideoList(element);
            
        }, {
            videolist: null
        })
    });

    function clickHandler(e){
        if (e.currentTarget.className == 'inner-container') {
            e.preventDefault();
            e.stopPropagation();
            Manager.page = Jidori.pages.start;
        }
    }

})();

/* PreviewMonitor */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        PreviewMonitor: WinJS.Class.define(function PreviewMonitor(element) {

            /// <signature>
            ///   <summary>プレビューモニターを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            /// </signature>

            if (Media.camera.isAvailable) {

                if (Jidori.camera) return;

                Jidori.camera = this;

                var video = document.createElement('video');
                video.id = 'PreviewMonitor';
                video.className = 'video';
                video.controls = false;
                element.appendChild(video);

                var live = document.createElement('div');
                live.className = 'LIVE';
                element.appendChild(live);

                var rec = document.createElement('div');
                rec.className = 'REC';
                element.appendChild(rec);

                Media.camera.createAsync(video).done(function () {
                    
                    var videoData = Jidori.player.secondaryMonitor.videoData;

                    Jidori.log('カメラを初期化');

                    if (videoData.fileType != VideoSource.BLANK) {
                        Jidori.log('自撮り動画をセット');
                        var src = URL.createObjectURL(videoData.fileInformation ? videoData.fileInformation : videoData, { oneTimeOnly: true });
                        Manager.video = src;
                    } else {
                        Jidori.log('自撮り動画が指定されていません');
                        Manager.video = '#';
                    }
                });

            } else {

                var container = document.createElement('div');
                container.className = 'VideoContainer';
                element.appendChild(container);

                container.innerHTML = '<div class="cameraInformation">カメラが見つかりません</div>';
            }
        })
    });

})();

/* LocalVideoPlayer */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        LocalVideoPlayer: WinJS.Class.define(function LocalVideoPlayer(element, videoData, controls) {

            /// <signature>
            ///   <summary>ローカルビデオプレーヤーを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="videoData" type="videoData">ビデオデータ</param>
            ///   <param name="controls" type="boolean">コントローラーを表示するか</param>
            ///   <param name="list" type="Array">リストに表示するビデオリスト</param>
            /// </signature>

            var container = document.createElement('div');
            container.className = 'VideoContainer';
            element.appendChild(container);

            var video = document.createElement('video');
            container.appendChild(video);
            
            video.className = 'video';
            video.controls = controls || false;

            var src = URL.createObjectURL(videoData.fileInformation ? videoData.fileInformation : videoData, { oneTimeOnly: true });

            if (element.id == Component.Monitor.primaryMonitor.id) {
                video.src = src;
                video.play();
            }

            this.videoList = new Jidori.Component.VideoList(element);
        }, {
            videolist: null
        })
    });

})();

/* YoutubeVideoPlayer */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        YoutubeVideoPlayer: WinJS.Class.define(function YoutubeVideoDisplay(element, videoData, controls) {

            /// <signature>
            ///   <summary>Youtubeビデオプレーヤーを作成します。</summary>
            ///   <param name="file" type="string">ファイルの場所を表す文字列。</param>
            ///   <param name="controls" type="boolean">コントローラーを表示するか。</param>
            /// </signature>

            var container = document.createElement('div');
            container.className = 'VideoContainer';
            element.appendChild(container);

            var iframe = document.createElement('iframe');
            container.appendChild(iframe);
            iframe.src = videoData.information ? videoData.information.embed : videoData.src;
            iframe.id = Component.YoutubeVideoPlayer.id;
            iframe.controls = controls || false;

            var cover = document.createElement('div');
            cover.className = Component.YoutubeVideoPlayer.id + '-cover';
            container.appendChild(cover);

            var image = document.createElement('img');
            image.src = videoData.information ? videoData.information.screenshot : videoData.sreenshot;
            cover.appendChild(image);

            this.videoList = new Jidori.Component.VideoList(element);
        }, {
            videolist: null
        }, {
            id: 'ytplayer',
            selector: '#ytplayer'
        })
    });

})();

/* VideoList */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        VideoList: WinJS.Class.define(function VideoList(element, list) {

            /// <signature>
            ///   <summary>ビデオリストを作成します。</summary>
            ///   <param name="element" type="string">html要素</param>
            ///   <param name="list" type="Array">リストに表示するビデオリスト</param>
            /// </signature>

            if (element.id == Component.Monitor.primaryMonitor.id) return;

            createListView(element);

        }, {

        })
    });



    //----------------------



    function createListView(element) {

        //if (list.length == 0) return;

        var tableName = Jidori.player.primaryMonitor.videoData.name;
        var list = Storage.getAllRecordFromTable(tableName);
        var container;

        /* コンテナがなかったら新規に生成 */
        if (!container) {
            container = document.createElement('div');
            container.className = 'RelatedVideoListContainer';
            element.appendChild(container);
        }

        var listView = new WinJS.UI.ListView(container);

        listView.itemTemplate = Template.SearchResultRenderer;
        listView.layout = new WinJS.UI.ListLayout();
        listView.oniteminvoked = function (args) {

            args.detail.itemPromise.done(function (videoData) {

                var jidoriFolder = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].jidoriFolder;

                Video.getFileFromVideosLibrary(jidoriFolder, videoData.data.information.filename, function (StorageFile) {
                    var src = URL.createObjectURL(StorageFile, { oneTimeOnly: false });
                    Manager.video = src;
                });
            });
        }

        MyDocument.userLibrary.getFilesAsync().done(function (item) {

            var videoData = new Class.VideoData(VideoSource.LOCAL_VIDEO, item);
            var n = videoData.length;
            var result = [];
            var isExist = false;

            /* ラベルは削除しておく */
            for (var i = 0; i < n; i++) {
                if (videoData[i].label) {
                    videoData.splice(i, 1);
                    break;
                }
            }
            
            /* ファイルが存在しないレコードを削除 */

            n = videoData.length;

            list.forEach(function (item, index) {
                for (var i = 0; i < n; i++) {
                    if (videoData[i].fileInformation.name == item.src) {
                        result.push(videoData[i]);
                        isExist = true;
                    }
                }

                if(!isExist) {
                    Storage.deleteRecordFromTableByIndex(index, tableName);
                }

                isExist = false;
            });

            Jidori.player.secondaryMonitor.result = result.reverse();

            /* バインドデータを追加 */
            if (videoData.length > 0) Jidori.player.secondaryMonitor.bindingList.add(Jidori.player.secondaryMonitor.result);

            /* ビューにデータをバインド */
            Jidori.player.secondaryMonitor.setListView(listView);
        });
    }

    //----------------------

})();

/* CountDown */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        CountDown: WinJS.Class.define(function CountDown(element, callback) {

            /// <signature>
            ///   <summary>カウントダウンを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="callback" type="function">カウントダウン終了後のコールバック。</param>
            /// </signature>

            var container = document.createElement('div');
            container.id = 'countdownVideoContainer';
            container.className = 'VideoContainer';
            element.appendChild(container);

            var video = document.createElement('video');
            container.appendChild(video);
            video.src = '/images/assets/countdown.mp4';
            video.className = 'video';
            video.controls = false;
            video.play();
            video.addEventListener('ended', callback ? callback : function () { Jidori.log('カウントダウン終了'); });
        })
    });

})();

/* Buttons */
(function () {

    "use strict";

    WinJS.Namespace.define("Component", {

        
        MyVideoButton: WinJS.Class.define(function MyVideoButton(element, options) {

            /// <signature>
            ///   <summaryボタンを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            element.innerHTML = '<div class="ui-select-inner-container local"></div>';
            element.className = 'ui-select-button';
            element.addEventListener('click', function () {
                Jidori.pages.picker.options.defualt = Manager.settings.tutorialFolder;
                Manager.page = Jidori.pages.picker;
            });
        }),

        WebServiceButton: WinJS.Class.define(function WebServiceButton(element, options) {

            /// <signature>
            ///   <summary>ボタンを作成します。</summary>
            ///   <param name="element" type="HTMLElement">html要素</param>
            ///   <param name="options" type="Object">オプション</param>
            /// </signature>

            element.innerHTML = '<div class="ui-select-inner-container web"></div>';
            element.className = 'ui-select-button';

            if (navigator.onLine) {
                element.addEventListener('click', function (e) {
                    Jidori.pages.search.options.queryText = Storage.getLatestRecordsFromTable(1, Jidori.tables.SETTINGS)[0].queryText;
                    Manager.page = Jidori.pages.search;
                });
            } else {
                element.querySelector('.ui-select-inner-container').style.backgroundColor = '#eeeeee';
                element.querySelector('h2').style.color = '#aaaaaa';
            }
        })
    })

})();