var five = require("johnny-five");
var Raspi = require("raspi-io");

module.exports = function(eventEmitter) {
    var board = new five.Board({
        io: new Raspi()
    });
    var pins    = require("pins.js")

    board.on("ready", function() {
        // This requires OneWire support using the ConfigurableFirmata
        var thermometer = new five.Thermometer({
            controller: "DS18B20",
            pin: pins.temperature
        });

        var green   = new five.Led(pins.greenLed);
        var red     = new five.Led(pins.redLed);

        thermometer.on("change", function() {
            eventEmitter.emit("temperature:change", this, green, red);
        });

        // Listen to any event named disableAlert
        // If we get an event, disable the red LED
        eventEmitter.on('disableAlert', function() {
            red.stop();
            red.off();
        })

    });
};


