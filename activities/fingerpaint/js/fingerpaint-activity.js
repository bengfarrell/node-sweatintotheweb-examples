$(document).resize( function() {
    onResize();
});

function init() {
    paint = new Paint($("#canvas"));
    $("#color-red").addClass("selected");
    paint.setColor("red");

    if (speech) {
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
        speech.addCommand(["ross"], onBobRossifyCommand);
        speech.start();
    }
    onResize();
}

function onResize() {
    paint.resizeCanvas($(document).width(), $(document).height());
}

function onClearCanvasCommand(data) {
    paint.clearAll();
}

function onBobRossifyCommand(data) {
    paint.bobrossify($("#bobross"));
}

function onChangeColor(data) {
    console.log("Set color: " + data.word);
    $(".swatch.selected").removeClass("selected");
    $("#color-" + data.word).addClass("selected");
    paint.setColor(data.word);

}

var isBrushDown = false;
var isEraserDown = false;

function onGesture(data) {
    if (data.gestureType == nuimotion.Events.Gestures.Wave.types.hand &&
        data.step == nuimotion.Events.Gestures.Progress.complete) {
        paint.clearAll();
    }
}

function onSkeletonUpdate(data) {
    skeleton = data.skeleton;
    var left = toScreenCoordinates(skeleton[nuimotion.Joints.LEFT_HAND]);
    var right = toScreenCoordinates(skeleton[nuimotion.Joints.RIGHT_HAND]);

    if (left && left.active) {
        // make sure hands are extended and raised
        if (skeleton[nuimotion.Joints.LEFT_HAND].percentExtended > 93 &&
            skeleton[nuimotion.Joints.LEFT_SHOULDER].yRotation > -60 &&
            skeleton[nuimotion.Joints.LEFT_SHOULDER].yRotation < 40) {

            if (!isBrushDown) {
                isBrushDown = true;
                $("#drawcursor").removeClass("up");
                $("#drawcursor").addClass("down");
                paint.brushDown();
            }
        } else if (isBrushDown) {
            isBrushDown = false;
            $("#drawcursor").removeClass("down");
            $("#drawcursor").addClass("up");
            paint.brushUp();
        }
    }

    if (right && right.active) {
        if (skeleton[nuimotion.Joints.RIGHT_HAND].percentExtended > 93 &&
            skeleton[nuimotion.Joints.RIGHT_SHOULDER].yRotation > -60 &&
            skeleton[nuimotion.Joints.RIGHT_SHOULDER].yRotation < 40) {

            if (!isEraserDown) {
                isEraserDown = true;
                $("#erasercursor").removeClass("up");
                $("#erasercursor").addClass("down");
                paint.eraserDown();
            }
        } else if (isEraserDown) {
            isEraserDown = false;
            $("#erasercursor").removeClass("down");
            $("#erasercursor").addClass("up");
            paint.eraserUp();
        }
    }

    $("#drawcursor").offset({left: left.x, top: left.y});
    if (left && left.active && isBrushDown) {
        paint.moveBrush({"pageX": left.x, "pageY": left.y});
    }

    $("#erasercursor").offset({left: right.x, top: right.y});
    if (right && right.active && isEraserDown) {
        paint.moveEraser({"pageX": right.x, "pageY": right.y});
    }
}

function toScreenCoordinates(coords) {
    if (!coords) { return {x:0, y:0, active: false}};

    var centerScreen = { x: document.width/2, y: document.height/2 };
    return {x: centerScreen.x + coords.x, y: -(centerScreen.y + coords.y) + 600, active: coords.active };
}