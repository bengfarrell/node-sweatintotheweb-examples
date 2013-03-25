// Gestures
// Generic Gestures Application
// Turn on and off whatever you'd like to send on via web sockets

var nuimotion = require("nuimotion");

// Comment and uncomment whatever gestures you need to send on
nuimotion.addGestureListener(Events.Gestures.Swipe.SWIPE, Events.Gestures.Swipe.types.right);
nuimotion.addGestureListener(Events.Gestures.Swipe.SWIPE, Events.Gestures.Swipe.types.left);
nuimotion.addGestureListener(Events.Gestures.Swipe.SWIPE, Events.Gestures.Swipe.types.up);
nuimotion.addGestureListener(Events.Gestures.Swipe.SWIPE, Events.Gestures.Swipe.types.down);
//nuimotion.addGestureListener(Events.Gestures.Wave.WAVE, Events.Gestures.Wave.types.left);
//nuimotion.addGestureListener(Events.Gestures.Wave.WAVE, Events.Gestures.Wave.types.right);
nuimotion.addGestureListener(Events.Gestures.Wave.WAVE, Events.Gestures.Wave.types.any);

var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];

nuimotion.context.on = function(name) {
    console.log(name)
    for (var c in connections) {
        switch (name) {
            case Events.Gestures.Wave.types.any:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.types.left:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.types.right:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.types.up:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
            case Events.Gestures.Swipe.types.down:
                connections[c].sendUTF('{ "gesture_event": "' + name + '" }');
                break;
        }

    }
};

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

nuimotion.init();