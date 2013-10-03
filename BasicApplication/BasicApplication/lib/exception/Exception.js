(function () {

    "use strict";

    WinJS.Namespace.define('Exception', {

        ManifestException: WinJS.Class.derive(Error, function IllegalArgumentException() {
            this.message = 'マニフェストで機能を宣言する必要があります。';
            this.name = 'IllegalArgumentException';
        }),

        IllegalArgumentException: WinJS.Class.derive(Error, function IllegalArgumentException() {
            this.message = '引数の数が一致しませんでした。';
            this.name = 'IllegalArgumentException';
        }),

        DirectoryNotFoundException: WinJS.Class.derive(Error, function DirectoryNotFoundException() {
            this.message = 'ディレクトリが存在しませんでした。';
            this.name = 'DirectoryNotFoundException';
        }),

        FileNotFoundException: WinJS.Class.derive(Error, function FileNotFoundException() {
            this.message = 'ファイルが存在しませんでした。';
            this.name = 'FileNotFoundException';
        }),

        NullReferenceException: WinJS.Class.derive(Error, function NullReferenceException() {
            this.message = 'Nullオブジェクトを参照しています。';
            this.name = 'NullReferenceException';
        }),

        PlatformNotSupportException: WinJS.Class.derive(Error, function PlatformNotSupportException() {
            this.message = 'このプラットフォームではサポートされていません。';
            this.name = 'PlatformNotSupportException';
        }),
        
    });
    
})();