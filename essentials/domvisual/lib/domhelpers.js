/*
function getComputedDimensions(element) {
    var browserName=navigator.appName,
        ret = {},
        cs;
    if (browserName === "Microsoft Internet Explorer") {
        return [
            element.offsetWidth,
            element.offsetHeight,
            1
        ];
    } else {
        cs = document.defaultView.getComputedStyle(element, "");
        return [
            cs.getPropertyValue("width"),
            cs.getPropertyValue("height"),
            1
        ];
    }
}
exports.getComputedDimensions = getComputedDimensions;
*/
