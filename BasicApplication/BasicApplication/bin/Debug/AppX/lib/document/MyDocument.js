(function () {

    WinJS.Namespace.define('Metro', {

        Class: {

            Document: WinJS.Class.define(function Document(folder) {

                this._name = folder.name;
                this._folder = folder;

            }, {

                getLibraryName: function () {
                    return this._name;
                },

                getLibrary: function () {
                    return this._folder;
                },

                getFolderAsync: function (name) {
                    return this._folder.getFolderAsync(name);
                },

                getFileAsync: function (name) {
                    return this._folder.getFileAsync(name);
                },

                getFilesAsync: function () {

                    //var fileInformationFactory = new Windows.Storage.BulkAccess.FileInformationFactory(iStorageQueryResultBase, thumbnailMode, uInt32);
                    //var fileInformationFactory = new Windows.Storage.BulkAccess.FileInformationFactory(iStorageQueryResultBase, thumbnailMode, uInt32, thumbnailOptions);
                    //var fileInformationFactory = new Windows.Storage.BulkAccess.FileInformationFactory(iStorageQueryResultBase, thumbnailMode, uInt32, thumbnailOptions, boolean);

                    var options = createOptions(this._folder);
                    var fileInformationFactory = new Windows.Storage.BulkAccess.FileInformationFactory(options.fileQuery, options.dataSourceOptions.mode);
                    return fileInformationFactory.getFilesAsync();
                },

                createFolderAsync: function (name) {
                    return this._folder.createFolderAsync(name);
                },

                createFileAsync: function (name) {
                    return this._folder.createFileAsync(name);
                },

                createStorageDataSource: function () {

                    var options = createOptions(this._folder);

                    var dataSource = new WinJS.UI.StorageDataSource(options.fileQuery, options.dataSourceOptions);

                    return dataSource;
                }

            }),
        }
    });

    function createOptions(folder) {

        var queryOptions = new Windows.Storage.Search.QueryOptions;
        queryOptions.folderDepth = Windows.Storage.Search.FolderDepth.deep;
        queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

        var fileQuery = folder.createItemQueryWithOptions(queryOptions);
        var dataSourceOptions = {
            mode: Windows.Storage.FileProperties.ThumbnailMode.picturesView,
            requestedThumbnailSize: 190,
            thumbnailOptions: Windows.Storage.FileProperties.ThumbnailOptions.none
        };

        return { fileQuery: fileQuery, dataSourceOptions: dataSourceOptions };
    }

    function directoryNotFoundException() {
        throw new Exception.DirectoryNotFoundException();
    }

    function fileNotFoundException() {
        throw new Exception.FileNotFoundException();
    }

})();

(function () {

    var _documentsLibrary, _picturesLibrary, _videosLibrary, _userLibrary;

    WinJS.Namespace.define("MyDocument", {

        createUserLibrary: function (knownFolders, userLibraryName, folderName, callback) {

            var lib = knownFolders.createFolderAsync(folderName).done(function (folder) {
                MyDocument[userLibraryName] = new Metro.Class.Document(folder);
                callback();
            }, function () {
                knownFolders.getFolderAsync(folderName).done(function (folder) {
                    MyDocument[userLibraryName] = new Metro.Class.Document(folder);
                    callback();
                });
            });
        },

        picturesLibrary: new Metro.Class.Document(Windows.Storage.KnownFolders.picturesLibrary),
        videosLibrary: new Metro.Class.Document(Windows.Storage.KnownFolders.videosLibrary)
    });

})();