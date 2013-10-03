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

        SearchResultRenderer: SearchResultRenderer,
        StorageDataSourceRenderer: StorageDataSourceRenderer
    });

    function SearchResultRenderer(itemPromise, recycledElement) {

        if (!recycledElement) recycledElement = document.createElement('div');

        recycledElement.className = 'item';
        //recycledElement.style.backgroundColor = 'black';


        var str;
        var renderComplete = itemPromise.then(function (item) {

            if (item.data.label) {

                str = '<div class="item-' + item.data.mediaType + '"></div>'
            } else {

                var info = item.data.information;
                var className = info.thumbnail == Settings.PROGRESS_IMAGE ? 'generateThumbnail' : 'thumbnail'
                str = '<div class="item-inner-container">' +
                '<div class="' + className + ' item-image">' +
                '<img data-src="' + info.filename + '" src="' + info.thumbnail + '" />' +
                '</div>' +
                '<div class="item-content">' +
                '<h3 class="item-title win-type-ellipsis">' + info.title + '</h3>' +
                '<h6 class="item-author win-type-ellipsis">' + info.author + '</h6>' +
                '<h4 class="item-favoriteCount">お気に入り <span>' + info.favoriteCount + '</span></h4>' +
                '<h4 class="item-viewCount">再生回数 <span>' + info.viewCount + '</span></h4>' +
                '</div>' +
                '</div>';
            }

            recycledElement.innerHTML = str;
            
            return item.ready;

        });

        return { element: recycledElement, renderComplete: renderComplete };
    }

    function StorageDataSourceRenderer(itemPromise, recycledElement) {

        var container, imageContainer, contentContainer, img, overlay, overlayText, str;

        if (recycledElement === null) {

            recycledElement = document.createElement("div");
            recycledElement.className = 'item';

            container = document.createElement("div");

            imageContainer = document.createElement("div");
            imageContainer.className = 'item-image';
            imageContainer.innerHTML = "<img />";


            str = '<h3 class="item-title win-type-ellipsis">' + 'title' + '</h3>' +
                '<h6 class="item-author win-type-ellipsis">' + 'author' + '</h6>' +
                '<h4 class="item-favoriteCount">お気に入り <span>' + '―' + '</span></h4>' +
                '<h4 class="item-viewCount">再生回数 <span>' + '―' + '</span></h4>';

            contentContainer = document.createElement("div");
            contentContainer.className = 'item-content';
            contentContainer.innerHTML = str;

            recycledElement.appendChild(container);
            container.appendChild(imageContainer);
            container.appendChild(contentContainer);

        }

        img = imageContainer.querySelector("img");
        overlay = contentContainer.querySelector(".item-title");
        overlayText = contentContainer.querySelector(".item-author");
        img.style.opacity = 0;

        var renderComplete = itemPromise.then(function (item) {

            if (item.data.isOfType(Windows.Storage.StorageItemTypes.folder)) {

                container.className = 'item-local_video';
                imageContainer.style.display = 'none';
                contentContainer.style.display = 'none';

            } else {

                container.className = 'item-inner-container';

                if (item.data.path.indexOf(Manager.settings.jidoriFolder) != -1) {
                    recycledElement.style.backgroundColor = 'black';
                } else {
                    recycledElement.style.backgroundColor = '#333333';
                }

                overlay.innerText = item.data.name;
                overlayText.innerText = Metro.user.name;
            }


            return item.ready;

        }).done(function (item) {

            if (img) {
                return WinJS.UI.StorageDataSource.loadThumbnail(item, img);
            } else {

            }

        });

        return { element: recycledElement, renderComplete: renderComplete };
    }

})();