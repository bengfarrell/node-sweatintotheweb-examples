node-sweatintotheweb-examples
=============================

Usage and interaction examples for node-sweatintotheweb AddOns


Main.js
=======

Main.js is becoming deprecated as we create new specific modules that accomplish a set task.
This was simply a hello world type example where we could wave and it would follow a gesture.
Better examples are coming


HandTracker.js
==============

The first of the generic activities as we start to create things that can be used for many purposes by the browser.
This activity tracks hands (both left and right) - sending x, y, z coordinates to the browser along with arm extension percentages and whether
the arm is active.  The activity also sends the "body_center" or torso coordinates to better tell where the hands are in relation to the body.

The following events are also dispatched: "NEW_USER", "USER_IS_VISIBLE", "USER_IS_OUT_OF_SCENE", "USER_IS_LOST", "SKELETON_STOPPED_TRACKING", "SKELETON_CALIBRATING",
"SKELETON_TRACKING", "SKELETON_CALIBRATION_FAILED", "DEVICE_INITIALIZED", "DEVICE_ERROR"

The events are sent as they occur, however, the hand updates are sent at an interval defined internally to the activity (every 50ms is the default).