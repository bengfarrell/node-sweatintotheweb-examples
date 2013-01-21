var connection = new WebSocket('ws://localhost:8080');

// When the connection is open, send some data to the server
connection.onopen = function () {
    connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {

    var msg = JSON.parse(e.data);
    if (msg.gesture) {
        switch(msg.gesture) {
            case "Gesture_Wave":
                document.getElementById("message").innerHTML = "Welcome Back! I'm listening...";
                break;

            case "Gesture_LostHand":
                document.getElementById("message").innerHTML = "Bye!  Wave your hand to come back";
                break;
        }
    } else {
        var coords = toScreenCoordinates(JSON.parse(e.data));
        document.getElementById("cursor").style.marginTop = coords.y + "px";
        document.getElementById("cursor").style.marginLeft = coords.x + "px";
        //document.getElementById("cursor").style.width = coords.z + "px";
        //document.getElementById("cursor").style.height = coords.z + "px";
    }
};


function toScreenCoordinates(coords) {
    var centerScreen = { x: document.width/2, y: document.height/2 };
    return {x: centerScreen.x + coords.x, y: -(centerScreen.y + coords.y) };
}