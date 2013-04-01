$(document).ready( function() {
    birdSprite = new BirdSprite($("#bird"));
});

var connection = new WebSocket('ws://localhost:8080');

/* send a command to set the joints we'd like to listen to */
connection.onopen = function() {
    var command = { "command": "setJoints", "data": [ Joints.LEFT_SHOULDER, Joints.RIGHT_SHOULDER ] };
    connection.send(JSON.stringify(command));
}

/* websocket connection listener error */
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

/**
 * recieve message from websocket connection/ NuiMotion backend
 * @param e
 */
connection.onmessage = function (e) {
    var message = JSON.parse(e.data);
    birdSprite.update(message);

}