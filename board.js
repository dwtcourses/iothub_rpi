var five = require("johnny-five");
var Raspi = require("raspi-io");
var sensor = require('ds18x20'); // This lib is used because raspi-io isn't playing nicely with 1-wire

// Fetches the temperature using the ds18x20 lib.
// https://www.npmjs.com/package/ds18x20
function fetchTemperature(callback) {
    sensor.isDriverLoaded(function (err, isLoaded) {
        // If the driver isn't loaded, you could load it manually or in code
        if (isLoaded) { 
            sensor.list(function (err, listOfDeviceIds) {
                sensor.get(listOfDeviceIds[0], function (err, tempObj) {
                    callback({
                        celsius: tempObj,
                        fahrenheit: tempObj * 9 / 5 + 32

                    });
                });
            });
        }
    });
}



module.exports = function (eventEmitter) {
    var board = new five.Board({
        io: new Raspi()
    });
    var pins = require("./pins.js")

    board.on("ready", function () {
        var green = new five.Led(pins.greenLed);
        var red = new five.Led(pins.redLed);
        var prev = 0;

        // Check the sensor every second.
        setInterval(function () {
            fetchTemperature(function (obj) {
                if (prev === obj.celsius) { // If the temp has changed...
                    return;
                }
                prev = obj.celsius;
                // Fire off a change notification
                eventEmitter.emit("temperature:change", obj, green, red);
            });
        }, 1000);

        // Listen to any event named disableAlert
        // If we get an event, disable the red LED
        eventEmitter.on('disableAlert', function () {
            red.off();
        });

        // Make sure to turn off the LEDS
        this.on("exit", function () {
            green.off();
            red.off();
        });
    });
};


