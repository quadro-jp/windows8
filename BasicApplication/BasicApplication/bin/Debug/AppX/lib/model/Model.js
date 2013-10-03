(function () {

    WinJS.Namespace.define('Core', {

        Model: WinJS.Class.define(function Model(name) {

            this._initObservable();

            this.name = name;

        }, {
            name: 'Model'
        })
    });

})();