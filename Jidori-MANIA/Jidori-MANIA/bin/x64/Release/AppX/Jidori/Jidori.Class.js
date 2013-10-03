/**
 * <p> ページ定義を簡略化します。 </p>
 *
 * @see     http://msdn.microsoft.com/ja-JP/library/windows/apps/hh770584
 * @author  aso
 * @version 1.0
 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /**
         * <p> コンストラクタ </p>
         *
         * @param name      名前
         * @param uri       関連付けるページのURI
         * @param viewData  ビューの振る舞いを定義したオブジェクト
         */
        Page: WinJS.Class.define(function Page (pageData, viewData) {

            this._pageData = pageData;
            this._viewData = viewData;

        }, {

            _pageData: null,
            _viewData: null,

            /**
             * <p> ページにアクセス可能になった際に実行されるメソッド </p>
             *
             * @param element   自身を表すオブジェクト
             * @param options   WinJS.Navigation.navigateから渡されるオブジェクト
             */
            onReady: function (element, options) { Utilities.log(this.pageData.id + ' :: onReadyは未定義です。'); },

            /**
             * <p> ページが破棄された際に実行されるメソッド </p>
             */
            onUnload: function () { Utilities.log(this.pageData.id + ' :: onUnloadは未定義です。'); },

            /**
             * <p> ページのレイアウトが更新された際に実行されるメソッド </p>
             *
             * @param element       自身を表すオブジェクト
             * @param viewState     更新後の状態
             * @param lastViewState 更新前の状態
             */
            onUpdateLayout: function (element, viewState, lastViewState) { Utilities.log(this.pageData.id + ' :: onUpdateLayoutは未定義です。'); },

            /**
             * <p> このメソッドが実行された際にページ定義が確定します。 </p>
             */
            create: function () {
                
                var appModel = Windows.ApplicationModel;
                var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
                var nav = WinJS.Navigation;
                var ui = WinJS.UI;
                var utils = WinJS.Utilities;
                
                /* 新しいページを定義します。 */
                WinJS.UI.Pages.define(this._pageData.uri, {

                    pageData: this._pageData,
                    viewData: this._viewData,
                    element: null,
                    view: null,
                    onReady: this.onReady,
                    onUnload: this.onUnload,
                    onUpdateLayout: this.onUpdateLayout,

                    ready: function (element, options) {

                        var listView;

                        this.element = element;

                        if (this.viewData && this.viewData.selector) {

                            listView = this.view = document.querySelector(this.viewData.selector).winControl;
                            listView.addEventListener("contentanimating", handler, false);

                            Jidori.utils.setProperties(listView, this.viewData);

                            this.updateLayout();
                        }

                        function handler(e) {
                            e.currentTarget.winControl.ensureVisible(Utilities.state.selected);
                            e.currentTarget.removeEventListener("contentanimating", handler, false);
                            e.preventDefault();
                        }
                        
                        if (this.onReady) this.onReady(element, options);

                        Class.Page.insertReadyFunction(element);
                    },

                    unload: function () {
                        
                        if (this.onUnload) this.onUnload();

                        Utilities.empty(this.element);

                        this.pageData = null;
                        this.viewData = null;
                        this.view = null;
                        this.onReady = null;
                        this.onUnload = null;
                        this.onUpdateLayout = null;
                    },

                    updateLayout: function (element, viewState, lastViewState) {

                        if (!this.view) return;

                        var listView = document.querySelector(this.view.selector).winControl;
                        var layout;

                        switch (Windows.UI.ViewManagement.ApplicationView.value) {
                            case 0:
                                layout = new ui.GridLayout();
                                break;

                            case 3:
                                layout = new ui.ListLayout()
                                break;
                        }

                        listView.layout = layout;

                        if (this.onUpdateLayout) this.onUpdateLayout(element, viewState, lastViewState);
                    }

                });

            }

        },{
            insertReadyFunction: function () { }
        })
    });
    
})();

/* ListViewのプロパティ設定する為のオブジェクト。 */
(function () {
    
    "use strict";

    WinJS.Namespace.define('Class', {

        ViewData: WinJS.Class.define(function ViewData(option) {
            for (var key in option) { this[key] = option[key]; }
        },

        { selector: null, template: null, onViewStateChange: null, oniteminvoked: null })
    });

})();



/* VideoDataをバインドするVideoDataBinderを構築します。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ */
        VideoDataBinder: WinJS.Class.define(function VideoDataBinder() {

            this._bindingList = new Class.BindingList();

        }, {

            _bindingList: null,

            itemDataSource: {
                set: function (dataSource) {
                    value.itemDataSource = dataSource;
                }
            },

            itemFilter: { update: function () { } },

            listView: null,

            setListView: function (view) {
                this.listView = view;
                this.listView.itemDataSource = this._bindingList.itemDataSource;
            },

            search: function (source, queryText) {

                var api = new Class.FormatForSearchAPI(source, queryText);

                /* オフラインだった場合、空のプロミスを返す。 */
                if (navigator.onLine) {
                    return Search.searchAsync(api.source, api.url).then(function (json) {
                        var videoData = new Class.VideoData(source, json);
                        this.add(videoData);
                        return this;
                    }.bind(this));
                } else {
                    return new WinJS.Promise(function (complete, error, progress) {
                        complete(this._bindingList);
                        this.itemFilter.update(this._bindingList);
                    }.bind(this));
                }
            },

            add: function (data) {
                this._bindingList.add(data);
                this.itemFilter.update(this._bindingList);
            },

            unshift: function (data) {
                this._bindingList.unshift(data);
                this.itemFilter.update(this._bindingList);
            },

            clear: function () {
                this._bindingList = new WinJS.Binding.List();
            }
        },

        {

        })
        
    });

})();

/* VideoDataからリストを作成します。フィルタリング機能を提供します。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ */
        BindingList: WinJS.Class.define(function BindingList() {

            this._bindingList = new WinJS.Binding.List();
        }, {

            _bindingList: null,

            itemDataSource: {
                get: function () {
                    return this._bindingList.dataSource;
                }
            },

            add: function (data) {

                data.forEach(function (item) {
                    this._bindingList.push(item);
                }.bind(this));

                this.groups = this.getGroups(this._bindingList, 'group');
            },

            unshift: function (data) {

                data.forEach(function (item) {
                    this._bindingList.unshift(item);
                }.bind(this));

                this.groups = this.getGroups(this._bindingList, 'group');
            },

            getGroups: function (array, key) {

                var groups = [];

                for (var i in array._keyMap) {
                    groups.push(array._keyMap[i].data.group);
                }

                return groups;
            },

            /* リストビューをフィルタリング処理する為の配列を取得します。 */
            getGroupFilterByKey: function (array, key) {

                var uniqueValues = [];
                var groups = [];

                array.forEach(function (data) { if (data[key]) groups.push(data[key]); });

                Utilities.getUniqueArray(groups).forEach(function (value) {
                    if (value != undefined) uniqueValues.push({ results: null, text: value, predicate: function (item) { return item.group[key] === value; } });
                });

                return uniqueValues;
            },

            /* リストビューをフィルタリング処理する為の配列を取得します。 */
            getFilters: function (key) {

                return this.getGroupFilterByKey(this.groups, key);
            },

            /* フィルタリング済みのリストを取得します。 */
            createFiltered: function (predicate) {
                return this._bindingList.createFiltered(predicate);
            }
        })
    });

})();

/* 検索アイテムをフィルタリングします。 */
/* @TODO リストビューの指定をできるようにしよう */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ */
        ItemFilter: WinJS.Class.define(function ItemFilter(selectors, category) {
            this.selectors = selectors;
            this.category = category;
        }, {

            update: function (bindingList) {

                var selectors = this.selectors;
                var category = this.category;
                var container = Jidori.selector(selectors);
                var innerHTML = ''

                if (bindingList._bindingList._lastNotifyLength > 0) {
                    container.innerHTML = '<div class="filterarea"><div class="filterbar"></div><select class="filterselect"></select></div>';
                } else {
                    if (!navigator.onLine) {
                        Jidori.selector('.result').innerHTML = '<div class="resultsmessage win-type-x-large">ネットワークに接続されていません。</div>';
                        Jidori.selector('.resultslist').style.display = 'none';
                    } else {
                        Jidori.selector('.result').innerHTML = '<div class="resultsmessage win-type-x-large">検索に一致する結果がありません。</div>';
                    }
                    return;
                }

                var array = [{ results: null, text: "すべて", predicate: function (item) { return true; } }];
                var filters = bindingList.getFilters(category);

                filters.forEach(function (filter) { array.push(filter); });

                this._filters = array;
                this._populateFilterBar(container, bindingList);
                this._applyFilter(this._filters[0], bindingList);
            },
            _filters: null,

            // この関数は、指定されたフィルターを使用して検索データをフィルター処理します。
            _applyFilter: function (filter, originalResults) {

                if (filter.results === null) filter.results = originalResults.createFiltered(filter.predicate);

                return filter.results;
            },

            // この関数は、ユーザーによる新しいフィルターの選択に対応します。
            // 選択一覧と表示結果を更新します。
            _filterChanged: function (element, filterIndex) {
                var filterBar = element.querySelector(".filterbar");
                var listView = document.querySelector(".resultslist").winControl;
                var itemDataSource;

                if(filterBar.querySelector(".highlight")) WinJS.Utilities.removeClass(filterBar.querySelector(".highlight"), "highlight");

                if (filterIndex != null) {
                    WinJS.Utilities.addClass(filterBar.childNodes[filterIndex], "highlight");
                    if (document.querySelector(".result")) document.querySelector(".result").innerHTML = '';
                    document.querySelector(".filterselect").selectedIndex = filterIndex;
                    document.querySelector(".resultslist").style.display = 'block';
                    itemDataSource = this._filters[filterIndex].results.dataSource;
                } else {
                    if (!Jidori.selector("section").hasClass('Jidori-TUTORIAL')) {
                        Jidori.selector(".result").innerHTML = '<div class="resultsmessage win-type-x-large">動画が見つかりませんでした。</div>';
                    } else {
                        Jidori.selector(".result").innerHTML = '<div class="resultsmessage win-type-x-large">Jidori-TUTORIAL フォルダに動画を入れてください。</div>';
                    }
                    document.querySelector(".resultslist").style.display = 'none';
                    itemDataSource = null;
                }
                listView.itemDataSource = itemDataSource;
            },

            // この関数は、フィルター選択一覧を生成します。
            _populateFilterBar: function (element, originalResults) {
                var filterBar = element.querySelector(".filterbar");
                var listView = document.querySelector(".resultslist").winControl;
                var li, option, filterIndex;
                var utils = WinJS.Utilities;

                if (filterBar) filterBar.innerHTML = "";

                for (filterIndex = 0; filterIndex < this._filters.length; filterIndex++) {

                    this._applyFilter(this._filters[filterIndex], originalResults);

                    li = document.createElement("span");

                    /* ファイル自体はフィルターに表示しない */
                    if (this._filters[filterIndex].text.indexOf('.') != -1) li.style.display = 'none';

                    li.filterIndex = filterIndex;
                    li.tabIndex = 0;
                    li.textContent = this._filters[filterIndex].text + " (" + this._filters[filterIndex].results.length + ")";
                    li.onclick = function (args) { this._filterChanged(element, args.target.filterIndex); }.bind(this);
                    li.onkeyup = function (args) {
                        if (args.key === "Enter" || args.key === "Spacebar")
                            this._filterChanged(element, args.target.filterIndex);
                    }.bind(this);
                    utils.addClass(li, "win-type-interactive");
                    utils.addClass(li, "win-type-x-large");
                    filterBar.appendChild(li);

                    if (filterIndex === 0) {
                        utils.addClass(li, "highlight");
                        listView.itemDataSource = this._filters[filterIndex].results.dataSource;
                    }

                    option = document.createElement("option");
                    option.value = filterIndex;
                    option.textContent = this._filters[filterIndex].text + " (" + this._filters[filterIndex].results.length + ")";
                    element.querySelector(".filterselect").appendChild(option);
                }

                element.querySelector(".filterselect").onchange = function (args) { this._filterChanged(element, args.currentTarget.value); }.bind(this);
            }

        })
    });

})();

/* 検索ソースでグルーピング。ソース毎のラベルデータを追加した配列を返します。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ。 */
        SearchResultGroup: WinJS.Class.define(function SearchResultGroup(name) {

            return [{ id: 0, label: true, mediaType: name, group: {} }];
        })
    });

})();

/* 検索結果を一括で構造化します。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ。 */
        VideoData: WinJS.Class.define(function VideoData(videoSource, data) {

            if (!data) {
                return [];
            } else {
                switch (videoSource) {

                    case VideoSource.YOUTUBE:

                        var result = new Class.YoutubeParser(data);

                        break;

                    case VideoSource.LOCAL_VIDEO:

                        var result = new Class.FileInformationParser(data);

                        break;
                }

                return result;
            }
        })
    });

})();

/* FileInformationParserをパースします。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ。 */
        FileInformationParser: WinJS.Class.define(function FileInformationParser(data, label) {

            var source = VideoSource.LOCAL_VIDEO;
            var fileInformation = data;
            var n = data.length;
            var result = [];

            for (var i = 0; i < n; i++) {

                if (fileInformation[i].displayType != 'ファイル フォルダー') {

                    var info = fileInformation[i];
                    var url;

                    try{
                        url = URL.createObjectURL(info.thumbnail, {oneTimeOnly: false}); 
                    } catch (error) {
                        url = Settings.ALT_IMAGE;
                    }
                    data = {
                        id: i + 1,
                        label: false,
                        mediaType: source,
                        fileInformation: info,
                        group: {
                            folder: info.path.split('\\')[4]
                        },
                        contentType: 'video/' + source,
                        fileType: source,
                        displayName: info.displayName,
                        name: info.displayName,
                        path: info.path,
                        information: {
                            videoid: null,
                            title: info.displayName,
                            url: null,
                            embed: null,
                            apiplayer: null,
                            author: Metro.user.name,
                            screenshot: null,
                            thumbnail: url,
                            filename: info.name,
                            description: null,
                            favoriteCount: '―',
                            viewCount: '―'
                        }
                    }

                    result.push(data);
                }
            }

            //result.reverse();

            if (label === undefined) result.push(new Class.SearchResultGroup(source)[0]);

            return result;

        })
    });

})();

/* Youtube検索結果パースします。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ。 */
        YoutubeParser: WinJS.Class.define(function YoutubeParser(data) {
            
            var source = VideoSource.YOUTUBE;
            var json = data;
            var n = data.feed.entry.length;
            var title = json.feed.title.$t;
            var groupKey = title.split(': ')[1];
            var groupTitle = groupKey;
            var groupSubTitle = json.feed.author[0].name.$t;
            var object, data, videoid, embed;
            var result = new Class.SearchResultGroup(source);

            for (var i = 0; i < n; i++) {

                object = json.feed.entry[i];
                videoid = object.link[3].href.split('v=')[1];
                embed = 'http://www.youtube.com/embed/' + videoid;

                data = {
                    id: i + 1,
                    mediaType: source,
                    label: false,
                    group: {
                        key: groupKey,
                        title: groupTitle,
                        subtitle: groupSubTitle,
                        category: object.media$group.media$category[0].label,
                    },
                    contentType: 'video/' + source,
                    fileType: source,
                    name: source + '-' + videoid,
                    information: {
                        videoid: videoid,
                        title: object.title.$t,
                        url: object.media$group.media$content[0].url,
                        embed: embed + "?autoplay=1&controls=1&rel=0&showinfo=0&modestbranding=1",
                        apiplayer: embed + "?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1&enablejsapi=1",
                        author: object.author[0].name.$t,
                        screenshot: object.media$group.media$thumbnail[0].url,
                        thumbnail: object.media$group.media$thumbnail[2].url,
                        filename: 'unkown',
                        description: object.media$group.media$description.$t,
                        favoriteCount: object.yt$statistics ? object.yt$statistics.favoriteCount.insertComma() : '―',
                        viewCount: object.yt$statistics ? object.yt$statistics.viewCount.insertComma() : '―'
                    }
                }

                result.push(data);
            }

            return result;

        })
    });

})();

/* 動画検索URLを生成します。 */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ。 */
        FormatForSearchAPI: WinJS.Class.define(function FormatForSearchAPI(source, query) {

                switch (source) {

                    case 'youtube':

                        return {
                            url: "http://gdata.youtube.com/feeds/api/videos?vq=" + encodeURI(query) + "&lr=ja&alt=json",
                            query: query,
                            source: source
                        }

                        break;

                    case 'niconico':

                        return {
                            url: "http://ext.nicovideo.jp/api/search/search/" + encodeURI(query) + "?mode=watch&order=d&page=1&sort=n",
                            query: query,
                            source: source
                        }

                        break;
                }

        }, {

        }, {

        })
    });

})();




/* コメント */
(function () {

    "use strict";

    WinJS.Namespace.define('Class', {

        /* コンストラクタ */
        ClassName: WinJS.Class.define(function ClassName() {

        },

        /* インスタンスメンバー */
        {
        
        },

        /* スタティックメンバー */
        {

        })
    });

})();

Object.freeze(Class);