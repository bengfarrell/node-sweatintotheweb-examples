function BirdSprite(elem) {

    var self = this;

    /** DOM element that represents the bird */
    this.spriteElement = elem;

    this.left = $(self.spriteElement).find(".left.wing");

    this.right = $(self.spriteElement).find(".right.wing");

    /** velocity */
    this._velocity = { right: 0, left: 0 };

    /** current rotation */
    this._rotation = { right: 0, left: 0 };

    /** ground y position */
    this._ground = $(elem).position().top;

    /** gravity */
    this._gravity = 1;

    /**
     * update
     * @param message
     */
    this.updateSkeleton = function(data) {
        skl = data["skeleton"];
        left = skl[nuimotion.Joints.LEFT_SHOULDER];
        if (left && left.active) {
            var diff = self._rotation.left - left.yRotation;
            if (diff < 0) { self._velocity.left += Math.abs(diff)*.45; }
            self._rotation.left = left.yRotation;
           // $("#rotationLeft").html(left.yRotation);
           self._rotateSprite( self.left, -left.yRotation - 90);
        }
        right = skl[nuimotion.Joints.RIGHT_SHOULDER];
        if (right && right.active) {
            var diff = self._rotation.right - right.yRotation;
            if (diff > 0) { self._velocity.right += Math.abs(diff)*.45; }
            self._rotation.right = -right.yRotation + 90;
            //$("#rotationRight").html(-right.yRotation);
            self._rotateSprite( self.right, -right.yRotation + 90);
        }

        self._velocity.left -= 1;
        if (self._velocity.left < 0) { self._velocity.left = 0; }
        pos = $(self.spriteElement).offset();
        pos.top -= self._velocity.left;

        pos.top += self._calculateGravity(self._rotation.left);
        if (pos.top > self._ground) {
            pos.top = self._ground;
        }
        $(self.spriteElement).offset(pos);
    }

    /**
     * rotate a sprite
     * @param sprite
     * @param degrees
     */
    this._rotateSprite = function(sprite, degrees) {
        degrees += 180;
        $(sprite).css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            '-o-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)'});
    }

    /**
     * calculate gravity from angle
     * @param angle
     * @private
     */
    this._calculateGravity = function(angle) {
        return self._gravity * (Math.abs(angle)/90) + self._gravity*.15;
    }

    /**
     * manage visual state of sprite
     * @param state
     * @private
     */
    this.updateState = function(state) {
        switch (state) {
            case nuimotion.Events.NEW_USER:
            case nuimotion.Events.USER_IS_VISIBLE:
                $("#bird").addClass("hatching");
                break;

            case nuimotion.Events.SKELETON_TRACKING:
                $("#bird").removeClass("hatching");
                $("#bird").removeClass("unhatched");
                break;

            case nuimotion.Events.SKELETON_STOPPED_TRACKING:
                $("#bird").addClass("hatching");
                $("#bird").addClass("unhatched");
                break;

            case nuimotion.Events.USER_IS_LOST:
            case nuimotion.Events.USER_IS_OUT_OF_SCENE:
                $("#bird").removeClass("hatching");
                $("#bird").addClass("unhatched");

                break;
        }
    }
}