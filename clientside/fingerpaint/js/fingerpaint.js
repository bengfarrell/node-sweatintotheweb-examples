$(document).ready( function() {
    $("#canvas").mousemove( function(event) {
   //     $("#drawcursor").offset({top: event.pageY, left: event.pageX});
    });

    paint = new Paint($("#canvas"));
    $("#color-red").addClass("selected");
    paint.setColor("red");
    speech = new SpeechRecognition();
    speech.keepAlive = true;
    speech.addListener(SpeechRecognition.Event.RESULTS, function(results) {
        if (results.final == "") {
            $("#speechinputresults").html("<strong>I'm hearing you say:</strong>" + results.interim)
        } else {
            $("#speechinputresults").html("<strong>You said:</strong>" + results.final)
        }
    });

    speech.addCommand(["red", "green", "blue", "yellow", "purple", "orange", "black"], onChangeColor);
    speech.addCommand(["clear", "erase", "start over"], onClearCanvasCommand);
    speech.start();
    onResize();
});

$(document).resize( function() {
    onResize();
});

function onResize() {
    paint.resizeCanvas($(document).width(), $(document).height());
}

function onClearCanvasCommand(data) {
    paint.clearAll();
}

function onChangeColor(data) {
    console.log("Set color: " + data.word);
    $(".swatch.selected").removeClass("selected");
    $("#color-" + data.word).addClass("selected");
    paint.setColor(data.word);

}


var connection = new WebSocket('ws://localhost:8080');

// Log errors
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

connection.onmessage = function (e) {
    var msg = JSON.parse(e.data);

    var draw = toScreenCoordinates(msg.draw);
    var erase = toScreenCoordinates(msg.erase);

    if (msg.events && msg.events.length > 0) {
        for (var event in msg.events) {
            switch (msg.events[event]) {
                case "brushDown":
                    $("#drawcursor").removeClass("up");
                    $("#drawcursor").addClass("down");
                    paint.brushDown();
                    break;

                case "brushUp":
                    $("#drawcursor").removeClass("down");
                    $("#drawcursor").addClass("up");
                    paint.brushUp();
                    break;

                case "eraserUp":
                    $("#erasercursor").removeClass("down");
                    $("#erasercursor").addClass("up");
                    paint.eraserUp();
                    break;

                case "eraserDown":
                    $("#erasercursor").removeClass("up");
                    $("#erasercursor").addClass("down");
                    paint.eraserDown();
                    break;

                case Events.Gestures.Wave.types.any:
                    paint.clearAll();
                    break;
            }
        }
    }

    $("#drawcursor").offset({left: draw.x, top: draw.y});
    if (msg.draw && msg.draw.isBrushDown) {
        paint.moveBrush({"pageX": draw.x, "pageY": draw.y});
    }

    $("#erasercursor").offset({left: erase.x, top: erase.y});
    if (msg.erase && msg.erase.isEraserDown) {
        paint.moveEraser({"pageX": erase.x, "pageY": erase.y});
    }
}


function toScreenCoordinates(coords) {
    if (!coords) { return {x:0, y:0}};

    var centerScreen = { x: document.width/2, y: document.height/2 };
    return {x: centerScreen.x + coords.x, y: -(centerScreen.y + coords.y) + 600 };
}