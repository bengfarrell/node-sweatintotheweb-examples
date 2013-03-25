$(document).ready( function() {
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
    var msg = JSON.parse(e.data);
    left = msg[Joints.LEFT_SHOULDER];
    if (left && left.active) {
        rotateSprite($(".left.wing"), -left.yRotation-90)
    }
    right = msg[Joints.RIGHT_SHOULDER];
    if (right && right.active) {
        rotateSprite($(".right.wing"), -right.yRotation+90)
    }
}

/**
 * rotate a sprite
 * @param sprite
 * @param degrees
 */
function rotateSprite(sprite, degrees) {
    $(sprite).css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        '-o-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'});
}