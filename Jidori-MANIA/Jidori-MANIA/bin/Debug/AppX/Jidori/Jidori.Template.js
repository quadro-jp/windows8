/**
 * <p> カスタムのレンダラー関数。 </p>
 *
 * @see     http://msdn.microsoft.com/ja-jp/library/windows/apps/hh781224.aspx
 * @author  aso
 * @version 1.0
 */
(function () {

    "use strict";

    WinJS.Namespace.define('Template', {
        SearchResultRenderer: SearchResultRenderer
    });

    function SearchResultRenderer(itemPromise, recycledElement) {

        if (!recycledElement) recycledElement = document.createElement('div');

        recycledElement.className = 'item';

        var str;
        var renderComplete = itemPromise.then(function (item) {

            if (item.data.label) {

                str = '<div class="item-' + item.data.mediaType + '"></div>';

            } else {

                var info = item.data.information;
                var className = info.thumbnail == Settings.ALT_IMAGE ? 'generateThumbnail' : 'thumbnail'
                str = '<div class="item-inner-container media-type-' + item.data.mediaType + '">' +
                '<div class="' + className + ' item-image">' +
                '<img data-src="' + info.filename + '" src="' + info.thumbnail + '" />' +
                '</div>';

                if(item.data.mediaType == VideoSource.YOUTUBE){
                    str += '<div class="item-content">' +
                    '<h3 class="item-title win-type-ellipsis">' + info.title + '</h3>' +
                    '<h6 class="item-author win-type-ellipsis">' + info.author + '</h6>' +
                    '<h4 class="item-favoriteCount">お気に入り <span>' + info.favoriteCount + '</span></h4>' +
                    '<h4 class="item-viewCount">再生回数 <span>' + info.viewCount + '</span></h4>';
                }

                if (item.data.mediaType == VideoSource.LOCAL_VIDEO) {

                    var date = item.data.fileInformation.dateCreated;
                    var yy = date.getFullYear();
                    var mm = date.getMonth() + 1;
                    var dd = date.getDate();
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    var created = yy + '.' + mm + '.' + dd + ' ' + Utilities.formatDoubleDigit(h) + ':' + Utilities.formatDoubleDigit(m);

                    str += '<div class="item-content">' +
                    '<h3 class="item-title win-type-ellipsis">' + info.title.replace(/^(\d+\-\d+\-+\d.\d+\-\d+\-\d+\_)/, '') + '</h3>' +
                    '<h4 class="item-favoriteCount">フォルダ <span>' + item.data.group.folder + '</span></h4>' +
                    '<h4 class="item-viewCount">作成日 <span>' + created + '</span></h4>';
                }

                '</div>' +
                '</div>';
            }

            recycledElement.innerHTML = str;
            
            return item.ready;

        }).done(function (item) {

            if (!item.data.label) {
                if (item.data.information.thumbnail == Settings.ALT_IMAGE) {
                    item.data = item.data.fileInformation;
                    if (item.data.addEventListener) {
                        return WinJS.UI.StorageDataSource.loadThumbnail(item, recycledElement.querySelector('img'));
                    } else {
                        item.data.onThumbnailUpdated = function () {
                            recycledElement.querySelector('img').src = URL.createObjectURL(item.data.thumbnail, { oneTimeOnly: true });
                        }
                    }
                }
            }

        });

        return { element: recycledElement, renderComplete: renderComplete };
    }

})();