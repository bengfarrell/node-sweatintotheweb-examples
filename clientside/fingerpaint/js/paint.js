function Paint(canvas) {
    var self = this;

    this._canvas = canvas;
    this._context = $(this._canvas)[0].getContext("2d");

    this._isBrushDown = false;

    this.constructor = function() {
        $(this._canvas).mousedown(self.brushDown);
        $(this._canvas).mouseup(self.brushUp);
        $(this._canvas).mousemove(self.moveBrush);
    }

    this.brushDown = function(event) {
        self._isBrushDown = true;
        self._context.beginPath();
        self._context.moveTo(event.clientX, event.clientY);
    }

    this.brushUp = function() {
        self._isBrushDown = false;
        self._context.beginPath();
    }

    this.moveBrush = function(event) {
        if (self._isBrushDown) {
            self._context.lineTo(event.clientX, event.clientY);
            self._context.stroke();
        }
    }

    this.setColor = function(color) {
        if (typeof(color) == "string") {
            self._context.strokeStyle = color;
            self._context.stroke();
        }
    }

    this.constructor();
}