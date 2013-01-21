var s2web = require("node-sweatintotheweb/followthehand");
var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];
var frameLoop;

s2web.context.on = function(name) {
    console.log(name);
    for (var c in connections) {
        connections[c].sendUTF('{ "gesture": "' + name + '" }');
    }

    if (!frameLoop) {
        frameLoop = setInterval(onUpdate,50);
    }
};

process.on('exit', function() {
    s2web.close();
});


function onUpdate() {
    var hand = s2web.getHand();
    for (var c in connections) {
        connections[c].sendUTF('{ "x":' + hand.x +  ', "y":' + hand.y + ', "z":' + hand.z + '}');
    }
}

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


    cnct.on('message', function(message) {
        /*if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }*/
    });
    cnct.on('close', function(reasonCode, description) {
       // console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

s2web.init();
