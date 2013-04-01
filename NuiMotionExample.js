// Activity Example
//
// Activity will query both hands (left and right), as well as get
// events for skeleton tracking, stop tracking.  Also will get
// left/right swipe gestures

var nuimotion = require("nuimotion");

// start the skeleton listener, add the joints a callback and (optionally) a frame rate in milliseconds for checking
nuimotion.startSkeletonListener( [
    nuimotion.Joints.LEFT_HAND,
    nuimotion.Joints.RIGHT_HAND ],
    onSkeletonUpdate /* , 50 (the default) */ );

nuimotion.addListener(
    [ nuimotion.Events.SKELETON_TRACKING,
        nuimotion.Events.SKELETON_STOPPED_TRACKING ],
    onEvent );

nuimotion.addGesture(
    [ nuimotion.Events.Gestures.Swipe.types.left,
        nuimotion.Events.Gestures.Swipe.types.right,
        nuimotion.Events.Gestures.Wave.types.any],
    onGesture);
nuimotion.init();

/**
 * listen for Node process shutdown and close NUIMotion appropriately
 */
process.on('exit', function() {
    nuimotion.close();
});

/**
 * skeleton update callback
 * @param skeleton
 */
function onSkeletonUpdate(skeleton) {
    //console.log(skeleton);
}

/**
 * on general event (user/device/etc)
 * @param eventType
 */
function onEvent(eventType) {
    console.log(eventType);
}

/**
 * on gesture event
 * @param gesture
 */
function onGesture(gesture) {
    console.log(gesture)
}