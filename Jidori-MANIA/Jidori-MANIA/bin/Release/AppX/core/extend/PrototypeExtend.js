HTMLElement.prototype.styles = function (css) {
    for (var property in this.style) {
        if (css[property]) this.style[property] = css[property];
    }
}

String.prototype.deleteComma = function () {
    var string = this;
    while (string != (string = string.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return string;
}

String.prototype.insertComma = function () {
    var string = this;
    var temporary = "";
    while (string != (temporary = string.replace(/^([+-]?\d+)(\d\d\d)/, "$1,$2"))) {
        string = temporary;
    }
    return string;
}
