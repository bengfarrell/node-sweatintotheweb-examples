function Paint(canvas) {
    var self = this;

    this._canvas = canvas;
    this._context = $(this._canvas)[0].getContext("2d");

    this._isBrushDown = false;
    this._isEraserDown = false;

    this._currentColor = "";

    this.constructor = function() {
        this._canvas.click(function() { console.log("click");})
        this._canvas.mousedown(self.brushDown);
        this._canvas.mouseup(self.brushUp);
        this._canvas.mousemove(self.moveBrush);
    }

    this.resizeCanvas = function(width, height) {
        this._context.canvas.width = width;
        this._context.canvas.height = height;
    }

    this.eraserDown = function() {
        //console.log("Eraser down");
        self._isEraserDown = true;
    }

    this.eraserUp = function() {
        //console.log("Eraser up");
        self._isEraserDown = false;
    }

    this.brushDown = function() {
        //console.log("Brush down");
        self._isBrushDown = true;
    }

    this.brushUp = function() {
        //console.log("Brush up");
        self._isBrushDown = false;
    }

    this.clearAll = function() {
        self._context.clearRect(0,0, self._canvas.width(), self._canvas.height());
    }

    this.moveBrush = function(event) {
        if (self._isBrushDown) {
            self._context.beginPath();
            self._context.arc(event.pageX, event.pageY, 12, 0, 2 * Math.PI, false);
            self._context.fillStyle = self._currentColor;
            self._context.fill();
        }
    }

    this.moveEraser = function(event) {
        if (self._isEraserDown) {
            self._context.beginPath();
            self._context.arc(event.pageX, event.pageY, 12, 0, 2 * Math.PI, false);
            self._context.fillStyle = "white";
            self._context.fill();
        }
    }

    this.setColor = function(color) {
        if (typeof(color) == "string") {
            self._currentColor = color;
            self._context.strokeStyle = color;
            self._context.lineWidth = 5;
            self._context.stroke();
        }
    }

    this.constructor();
}