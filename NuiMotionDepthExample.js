var nuimotion = require("nuimotion/depth");
nuimotion.init();

setInterval( getDepthFrame, 500);

function getDepthFrame() {
    var dframe = nuimotion.getDepthFrame();
    console.log(dframe);
    var rgbframe = nuimotion.getRGBFrame();
    console.log(rgbframe);
}