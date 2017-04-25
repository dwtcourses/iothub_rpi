var five = require("johnny-five");
var Raspi = require("raspi-io");
var sensor = require('ds18x20');


function fetchTemperature(callback) {
    sensor.isDriverLoaded(function (err, isLoaded) {
        if (isLoaded) {
            sensor.list(function (err, listOfDeviceIds) {
                sensor.get(listOfDeviceIds[0], function (err, tempObj) {
                    callback({
                        celsius:    tempObj,
                        fahrenheit: tempObj * 9/5 + 32

                    });
                });
            });
        }
    });

}



module.exports = function(eventEmitter) {
    var board = new five.Board({
        io: new Raspi()
    });
    var pins    = require("./pins.js")

    board.on("ready", function() {
        var green   = new five.Led(pins.greenLed);
        var red     = new five.Led(pins.redLed);

        // Check the sensor every second.
        setInterval(function () {
            fetchTemperature(function(obj) {
                eventEmitter.emit("temperature:change", obj ,green, red);
            });
        }, 1000); 

        // Listen to any event named disableAlert
        // If we get an event, disable the red LED
        eventEmitter.on('disableAlert', function() {
            red.stop();
            red.off();
        })

    });
};


