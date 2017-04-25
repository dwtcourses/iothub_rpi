#  IoT Hub demo using a ds18x20 temperature sensor

### How to use this code
* Install a recent version of Raspbian Jessie
* Update node by running:
        
        $ update-nodejs-and-nodered

* Download the code with git

        $ git clone https://github.com/whelmed/iothub_rpi.git
        $ cd iothub_rpi
* Install the dependencies

        $ npm install

* Edit the creds.js with your device credentials

    * You can generate a new device in the Azure portal under the device blade of your IoT app
* Edit the pins you're using in the pins.js file
* Run the code
        
        $ nodejs app.js
    