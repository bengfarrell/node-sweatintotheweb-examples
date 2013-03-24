// EVENTS SENDER

var nui = require("nuimotion");
var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];

nui.context.on = function(name) {
    for (var c in connections) {
        switch (name) {
            case Events.Gestures.Wave.WAVE:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.left:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.right:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.up:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.down:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
        }

    }
};

process.on('exit', function() {
    nui.close();
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

nui.init();