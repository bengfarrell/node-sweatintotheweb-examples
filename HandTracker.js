var s2web = require("node-sweatintotheweb/handtracker");
var frameLoop;
var s2web = require("node-sweatintotheweb/followthehand");
var WebSocketServer = require('websocket').server;
var http = require('http');

s2web.context.on = function(name) {
    switch (name) {
        case "SKELETON_TRACKING":
            if (!frameLoop) {
                console.log("Start tracking");
                frameLoop = setInterval(onUpdate,50);
            }
            break;

        case "SKELETON_STOPPED_TRACKING":
            if (frameLoop) {
                console.log("Stop tracking");
                clearInterval(frameLoop);
                frameLoop = null;
            }
    }
};

function onUpdate() {
    var hands = s2web.getHands();

    var l = hands.left_hand;
    if (l.active) {
        //  console.log(l);
    }
}

process.on('exit', function() {
    s2web.close();
});
s2web.init();