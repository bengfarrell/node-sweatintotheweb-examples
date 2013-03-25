// Main Generic Activity
//
// All purpose activity to accept commands for which joints to listen for and what events to listen for
// Will hopefully turn into a good template for any activity or a backend that any browser based application
// can use with no modifications

var nuimotion = require("nuimotion");
var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];
var frameLoop;

/* milliseconds between frame loop iterations */
var frameDelay = 50;

/* joints to listen for in update frame loop */
var joints = [];

/**
 * nui motion event - send event straigh on in web socket
 * also, listen for when skeleton is tracking to start frame loop
 * @param name
 */
nuimotion.context.on = function(name) {
    // send on device event
    for (var c in connections) {
        connections[c].sendUTF('{ "device_event": "' + name + '" }');
    }
    switch (name) {
        case Events.SKELETON_TRACKING:
            if (!frameLoop) {
                // skeleton is tracking, start update/frame loop
                console.log("Skeleton is Tracking");
                frameLoop = setInterval(onUpdate,frameDelay);
            }
            break;

        case Events.SKELETON_STOPPED_TRACKING:
            if (frameLoop) {
                // skeleton is no longer tracking, shutdown frame/update loop
                console.log("Skeleton is Not Tracking");
                clearInterval(frameLoop);
                frameLoop = null;
            }
    }
};

/**
 * on message recieved from client
 * @param data
 */
function onMessage(data) {
    if (data.type == "utf8") {
        message = JSON.parse(data.utf8Data);
        switch (message.command) {
            case "setJoints":
                joints = message.data;
                break;
        }
    }
}

/**
 * frame loop update, check if we have any joints to
 * listen for and send them on through the sockets
 */
function onUpdate() {
    if (joints.length > 0) {
        var skeleton = nuimotion.getJoints.apply(this, joints);
        for (var c in connections) {
            connections[c].sendUTF(JSON.stringify(skeleton));
        }
    }
}

/**
 * listen for Node process shutdown and close NUIMotion appropriately
 */
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
    cnct.on('message', onMessage)
});

nuimotion.init();