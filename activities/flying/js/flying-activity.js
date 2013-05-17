$(document).ready( function() {
    birdSprite = new BirdSprite($("#bird"));
});

/**
 * on skeleton update
 * @param data
 */
function onSkeletonUpdate(data) {
    birdSprite.updateSkeleton(data
    );
}

function onEvent(data) {
    birdSprite.updateState(data.eventType);
}