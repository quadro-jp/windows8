(function () {

    "use strict";
    
    var view = new Class.ViewData({
        selector: '.listView',
        itemTemplate: Template.SearchResultRenderer,
        oniteminvoked: function (args) {
            
        }
    });

    var page = new Class.Page(Example.pages.home, view);

    page.onReady = function (element, options) {

    }

    page.create();
    
})();
