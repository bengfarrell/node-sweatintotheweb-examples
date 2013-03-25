Sweatin' To the Web for Node.js
===============================

Usage and interaction examples for Sweatin' To the Web for Node.js.  Most, if not all examples will communicate over web sockets



Generic Usage Examples
======================

These activities are a little more generic, and closer to what you'd want to kick off your own project.



SkeletonTracker.js
------------------

The first of the generic activities as we start to create things that can be used for many purposes by the browser.
This activity tracks any skeletal joint - sending x, y, z coordinates to the browser along with arm extension percentages and whether
the arm is active plus a position confidence factor.

The following events are also dispatched: "NEW_USER", "USER_IS_VISIBLE", "USER_IS_OUT_OF_SCENE", "USER_IS_LOST", "SKELETON_STOPPED_TRACKING", "SKELETON_CALIBRATING",
"SKELETON_TRACKING", "SKELETON_CALIBRATION_FAILED", "DEVICE_INITIALIZED", "DEVICE_ERROR"

The events are sent as they occur, however, the skeleton updates are sent at an interval defined internally to the activity (every 50ms is the default).


Gestures.js
-----------

Example activity to add gesture event listeners for waves and swipes.  Both gesture categories have various gestures of their own.
You can listen for swipe up, swipe left, swipe right, swipe down, wave with left hand, wave with right hand, or wave with any hand.

Gesture listeners are added by calling addGestureListener(gesturecategory, gesturetype).

The following events are also dispatched: "NEW_USER", "USER_IS_VISIBLE", "USER_IS_OUT_OF_SCENE", "USER_IS_LOST", "SKELETON_STOPPED_TRACKING", "SKELETON_CALIBRATING",
"SKELETON_TRACKING", "SKELETON_CALIBRATION_FAILED", "DEVICE_INITIALIZED", "DEVICE_ERROR"



Special Activities
==================

These activities are specific to a real browser-based application.  They are great for reference and to demo, but you probably wouldn't want to use these to start your own project.


FingerPaint.js
--------------

Tracks when left and right arms are extended almost fully to indicate that the user has their "brush" on the "canvas".
Motion events are sent over websockets to allow the user to draw on a browser canvas, or if the brush isn't down, then track where their hands are.

Left hand events are the paintbrush, while right hand movement is the eraser.

