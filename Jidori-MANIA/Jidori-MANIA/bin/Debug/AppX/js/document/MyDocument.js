(function () {
    "use strict";

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