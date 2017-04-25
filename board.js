var five = require("johnny-five");
var Raspi = require("raspi-io");

module.exports = function(eventEmitter) {
    var board = new five.Board({
        io: new Raspi()
    });
    var pins    = require("./pins.js")

    board.on("ready", function() {
        // This requires OneWire support using the ConfigurableFirmata
        var multi = new five.Multi({
            controller: "DHT11_I2C_NANO_BACKPACK"
        });

        multi.on("change", function() {
            console.log("Thermometer");
            console.log("  fahrenheit        : ", this.thermometer.fahrenheit);
            eventEmitter.emit("temperature:change", this, green, red);
        });

        var green   = new five.Led(pins.greenLed);
        var red     = new five.Led(pins.redLed);

        // Listen to any event named disableAlert
        // If we get an event, disable the red LED
        eventEmitter.on('disableAlert', function() {
            red.stop();
            red.off();
        })

    });
};


