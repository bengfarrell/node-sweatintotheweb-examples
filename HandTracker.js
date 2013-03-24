// GENERIC HAND TRACKER
//
// Send motion updates when skeleton is tracking
// For more specific activities, it may be nice to be
// more conservative with the socket server sending messages to the client

var nuimotion = require("nuimotion");
var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];
var frameLoop;
var frameDelay = 50; /* milliseconds between frame loop iterations */

nuimotion.context.on = function(name) {
    for (var c in connections) {
        connections[c].sendUTF('{ "device_event": "' + name + '" }');
    }
    switch (name) {
        case Events.SKELETON_TRACKING:
            if (!frameLoop) {
                console.log("Start tracking");
                frameLoop = setInterval(onUpdate,frameDelay);
            }
            break;

        case Events.SKELETON_STOPPED_TRACKING:
            if (frameLoop) {
                console.log("Stop tracking");
                clearInterval(frameLoop);
                frameLoop = null;
            }

        default:
            console.log(name);
    }
};

function onUpdate() {
    var hands = {"motion_update": s2web.getHands() };
    for (var c in connections) {
        connections[c].sendUTF(JSON.stringify(hands));
    }
}

process.on('exit', function() {
   nuimotion.close();
});

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', function(request) {
    var cnct = request.accept();
    connections.push( cnct );
    console.log((new Date()) + ' Connection accepted.');
    cnct.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer disconnected.');
    });
});

s2web.init();