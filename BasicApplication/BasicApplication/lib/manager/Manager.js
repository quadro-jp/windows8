/**
 * <p> 管理クラス </p>
 *
 * @see     
 * @author  aso
 * @version 1.0
 */
(function () {

    "use strict";

    var _models = [];

    WinJS.Namespace.define('Manager', {

        ViewManager: { viewState: ViewState.fullScreenLandscape, lastViewState: ViewState.fullScreenLandscape, onChange: function () { } },

        create: function (name, property, method) {

            WinJS.Class.mix(Core.Model, WinJS.Binding.mixin, WinJS.Binding.expandProperties(property));

            var _model = new Core.Model(name);

            for (var key in property) {
                _model.addProperty(key, property[key]);
                _model.bind(key, method);
            }

            _models[name] = _model;
        },

        getManagementObjectsList: getManagementObjectsList,

        getManagementObject: getManagementObject,

        getManagementObjects: getManagementObjects

    });

    function getManagementObjectsList() {

        var list = [];

        for (var key in _models) list.push(key);

        return list;
    }

    function getManagementObject(name) {

        var objct = _models[name];

        return objct;
    }

    function getManagementObjects() {

        var list = getManagementObjectsList();
        var objects = {};

        list.forEach(function (name) { objects[name] = getManagementObject(name); });

        return objects;
    }

})();

