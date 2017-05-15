
(function() {

function reloadPage() {
    window.location.reload()
}

function reloadCSS() {
    function updateQueryStringParameter(uri, key, value) {

        var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
        separator = uri.indexOf("?") !== -1 ? "&" : "?";

        if (uri.match(re)) {
            return uri.replace(re, "$1" + separator + key + "=" + value + "$2");
        } else {
            return uri + separator + key + "=" + value;
        };
    };

    var links = document.getElementsByTagName("link");

    for (var i = 0; i < links.length;i++) {

        var link = links[i];

        if (link.rel === "stylesheet") {

            // Don"t reload external urls, they likely did not change
            if (
                link.href.indexOf("127.0.0.1") == -1 &&
                link.href.indexOf("localhost") == -1 &&
                link.href.indexOf("0.0.0.0") == -1 &&
                link.href.indexOf(window.location.host) == -1
                ) {
                continue;
            }

            var updatedLink = updateQueryStringParameter(link.href, "cactus.reload", new Date().getTime());

            if (updatedLink.indexOf("?") == -1) {
                updatedLink = updatedLink.replace("&", "?");
            };

            link.href = updatedLink;
        };
    };
};

function startSocket() {

    var MessageActions = {
        reloadPage: reloadPage,
        reloadCSS: reloadCSS
    };

    var socketUrl = "ws://" + window.location.host + "/_cactus/ws"
    var socket = new WebSocket(socketUrl);

    socket.onmessage = function(e) {
        var key = e.data;

        if (MessageActions.hasOwnProperty(key)) {
            MessageActions[key]()
        };
    };
};

startSocket();

})()
