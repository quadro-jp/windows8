(function () {

    "use strict";

    var videosLibrary = Windows.Storage.KnownFolders.videosLibrary;

    WinJS.Namespace.define("FilePicker", {
        
        videosLibrary: {
            pickSaveFileAsync: pickSaveFileAsync,
            pickSingleFileAsync: pickSingleFileAsync
        }
    });

    function getCurrentState() {

        var currentState = Windows.UI.ViewManagement.ApplicationView.value;

        if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped && !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            return false;
        } else {
            return true;
        }
    }


    function pickSaveFileAsync() {

        //if(FilePicker.getCurrentState()) return;

        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.videosLibrary;
        savePicker.fileTypeChoices.insert("video/mp4", [".mp4"]);
        savePicker.suggestedFileName = Settings.suggestedFileName;
        return savePicker.pickSaveFileAsync();
    }

    function pickSingleFileAsync() {

        //if (FilePicker.getCurrentState()) return;

        var picker = new Windows.Storage.Pickers.FileOpenPicker();
        picker.fileTypeFilter.append("*");
        picker.viewMode = ViewMode.THUMBNAIL;
        picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.videosLibrary;
        return picker.pickSingleFileAsync();
    }

})();

(function () {

    "use strict";

    WinJS.Namespace.define("FilePicker", {

        picturesLibrary: {
            pickSingleFileAsync: pickSingleFileAsync 
        }

    });

    function pickSingleFileAsync() {

        var picker = new Windows.Storage.Pickers.FileOpenPicker();
        picker.fileTypeFilter.append("*");
        picker.viewMode = FilePicker.type.THUMBNAIL;
        picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        return picker.pickSingleFileAsync();
    }

    Contract.addContract('filepicker', FilePicker);

})();