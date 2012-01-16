
/** this is probably useless
function getComputedWidth(element) {
    var browserName=navigator.appName;
    if (browserName === "Microsoft Internet Explorer") {
        return element.offsetWidth;
    } else {
        return document.defaultView.getComputedStyle(element, "").getPropertyValue("width");
    }
}
*/
