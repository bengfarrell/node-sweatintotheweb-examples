/**
 * Touch-based remote controller for your presentation courtesy 
 * of the folks at http://remotes.io
 */

(function(window){
    $(".reveal").fadeTo("slow", 0.1);

    onActivatePresentation = function(event) {
        $("body").addClass("activeUser");
        $(".reveal").fadeTo("slow", 1);
    }

    onDeactivatePresentation = function(event) {
        $("body").removeClass("activeUser");
        $(".reveal").fadeTo("slow", 0.1);
    }

    onSwipeLeftEvent = function(event) {
        if (event.step == nuimotion.Events.Gestures.Progress.complete) {
            Reveal.right();
        }
    }

    onSwipeRightEvent = function(event) {
        if (event.step == nuimotion.Events.Gestures.Progress.complete) {
            Reveal.left();
        }
    }

    onSwipeUpEvent = function(event) {
        if (event.step == nuimotion.Events.Gestures.Progress.complete) {
            Reveal.down();
        }
    }

    onSwipeDownEvent = function(event) {
        if (event.step == nuimotion.Events.Gestures.Progress.complete) {
            Reveal.up();
        }
    }

    nuimotion.init("ws://localhost:8080");
    nuimotion.addListener([
        nuimotion.Events.SKELETON_TRACKING,
        nuimotion.Events.USER_IS_VISIBLE,
        nuimotion.Events.NEW_USER],  onActivatePresentation);

    nuimotion.addListener([
        nuimotion.Events.SKELETON_STOPPED_TRACKING,
        nuimotion.Events.USER_IS_OUT_OF_SCENE,
        nuimotion.Events.USER_IS_LOST],  onDeactivatePresentation);

    nuimotion.addGesture(nuimotion.Events.Gestures.Swipe.types.left, onSwipeLeftEvent);
    nuimotion.addGesture(nuimotion.Events.Gestures.Swipe.types.right, onSwipeRightEvent);
    nuimotion.addGesture(nuimotion.Events.Gestures.Swipe.types.up, onSwipeUpEvent);
    nuimotion.addGesture(nuimotion.Events.Gestures.Swipe.types.down, onSwipeDownEvent);

})(window);