"use strict";

var Service, Characteristic;
var request = require("request");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-stateless-switch", "StatelessSwitch", StatelessSwitch);
};

function StatelessSwitch(log, config) {
    this.log = log;
    this.name = config.name;

    this.onUrl = config.onUrl;

    this.homebridgeService = new Service.Switch(this.name);
    this.homebridgeService.getCharacteristic(Characteristic.On)
        .on("get", this.getStatus.bind(this))
        .on("set", this.setStatus.bind(this));
}

StatelessSwitch.prototype = {

    identify: function (callback) {
        this.log("Identify requested!");
        callback();
    },

    getServices: function () {
        return [this.homebridgeService];
    },

    getStatus: function (callback) {
        callback(null, false);
    },

    setStatus: function (on, callback) {
        this.makeSetRequest(true, callback);
    },

    makeSetRequest: function (on, callback) {
        var statelessSwitch = this;
        var onUrl = this.onUrl;

        // if (onUrl.length === 0) {
        //     this.log("Ignoring setStatus() request 'offUrl' or 'onUrl' is not defined");
        //     callback(new Error("No 'onUrl' defined!"));
        //     return;
        // }

        this._httpRequest(onUrl, function (error, response, body) {
            if (error) {
                statelessSwitch.log("setStatus() failed: %s", error.message);
                statelessSwitch.resetSwitchWithTimeout();
                callback(error);
            }
            else if (response.statusCode !== 200) {
                statelessSwitch.log("setStatus() http request returned http error code: %s", response.statusCode);
                statelessSwitch.resetSwitchWithTimeout();
                callback(new Error("Got html error code " + response.statusCode));
            }
            else {
                statelessSwitch.log("setStatus() successfully set switch to %s", on? "ON": "OFF");
                statelessSwitch.resetSwitchWithTimeout();
                callback(undefined, body);
            }
        }.bind(this));
    },

    resetSwitchWithTimeout: function () {
        this.log("Resetting switch to OFF");
        setTimeout(function () {
            this.homebridgeService.setCharacteristic(Characteristic.On, false);
        }.bind(this), 1000);

    },

    _httpRequest: function (url, callback) {
        request(url,
            function (error, response, body) {
                callback(error, response, body);
            }
        )
    }
}
