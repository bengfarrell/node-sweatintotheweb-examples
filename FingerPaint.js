// FingerPaint
//
// When left hand is outstretched, apply painting strokes
// When right hand is outstreched, erase

var nuimotion = require("nuimotion");
var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];
var frameLoop;
var frameDelay = 50; /* milliseconds between frame loop iterations */


var isBrushDown = false;
var isEraserDown = false;

nuimotion.context.on = function(name) {
    for (var c in connections) {
        eventToSend = {"events": [name]};
        connections[c].sendUTF(JSON.stringify(eventToSend));
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
                isBrushDown = false;
                frameLoop = null;
            }
            break;

        case Events.Gestures.Wave.types.any:
            console.log("wave")
            //waves are sent on with any other event above outside this switch block
            break;
    }
};

function onUpdate() {
    var skeleton = nuimotion.getJoints(Joints.LEFT_HAND, Joints.LEFT_SHOULDER, Joints.RIGHT_HAND, Joints.RIGHT_SHOULDER);
    var motion = { events: [] };

    if (skeleton[Joints.LEFT_HAND].active) {
        // make sure hands are extended and raised
        if (skeleton[Joints.LEFT_HAND].percentExtended > 93 &&
            skeleton[Joints.LEFT_SHOULDER].yRotation > -60 &&
            skeleton[Joints.LEFT_SHOULDER].yRotation < 40) {

            if (!isBrushDown) {
                isBrushDown = true;
                motion.events.push("brushDown");
                console.log("brush down");
            }
        } else if (isBrushDown) {
            isBrushDown = false;
            motion.events.push("brushUp");
            console.log("brush up");
        }
        motion.draw = { "x": skeleton[Joints.LEFT_HAND].x, "y": skeleton[Joints.LEFT_HAND].y, "isBrushDown": isBrushDown };
    }

    if (skeleton[Joints.RIGHT_HAND].active) {
        if (skeleton[Joints.RIGHT_HAND].percentExtended > 93 &&
            skeleton[Joints.RIGHT_SHOULDER].yRotation > -60 &&
            skeleton[Joints.RIGHT_SHOULDER].yRotation < 40) {

            if (!isEraserDown) {
                isEraserDown = true;
                motion.events.push("eraserDown");
                console.log("eraser down");
            }
        } else if (isEraserDown) {
            isEraserDown = false;
            motion.events.push("eraserUp");
            console.log("eraser up");
        }

        motion.erase = { "x": skeleton[Joints.RIGHT_HAND].x, "y": skeleton[Joints.RIGHT_HAND].y, "isEraserDown": isEraserDown };
    }

    for (var c in connections) {
         connections[c].sendUTF(JSON.stringify(motion));
    }
}

process.on('exit', function() {
    nuimotion.close();
});


// next line is unused if left and right waves are in play
nuimotion.addGestureListener(Events.Gestures.Wave.WAVE, Events.Gestures.Wave.types.any);

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
        isBrushDown = false;
        console.log((new Date()) + ' Peer disconnected.');
    });
});

nuimotion.init();