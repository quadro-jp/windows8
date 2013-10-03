(function () {

    "use strict";

    WinJS.Namespace.define("Contract", {
        addContract: addContract,
        filepicker: FilePicker ? FilePicker : {},
        search: Search ? Search : {}
    });

    function addContract(name, contract) {
        Contract[name] = contract;
    }

})();


