// missing: switch.txt not existing: create!

var Service, Characteristic;
const fs = require('fs');

const readFile = "/root/.homebridge/switch.txt";

var switch1, key, func;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-stateless-switch", "StatelessSwitch", StatelessSwitch);
}

function StatelessSwitch(log, config) {

	this.log = log;

	this.name = config["name"];
	this.sn = config['sn'] || 'Unknown';
	
	this.acc = config["switch"];
	this.key = config["key"];

    this.setUpServices();

	var that = this;
	
    this.readData();
    
   	fs.watch(readFile, (event, filename) => {
   		if (event === 'change') this.readData();
   	});
}


StatelessSwitch.prototype.readData = function () {

	var data = fs.readFileSync(readFile, "utf-8");
	var lastSync = Date.parse(data.substring(0, 19));
	if (this.readtime == lastSync) return;
	this.readtime = lastSync;

	switch1 = parseFloat(data.substring(20));
	key = parseFloat(data.substring(22));
	func = parseFloat(data.substring(24));
	
	if (switch1 == this.acc && key == this.key) {
		
		this.log("Switch data: ", switch1, key, func);

		this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(func);
	}
}; 


StatelessSwitch.prototype.setUpServices = function() {

	this.informationService = new Service.AccessoryInformation();

	this.informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "Thomas Nemec")
		.setCharacteristic(Characteristic.Model, "Stateless Switch")
		.setCharacteristic(Characteristic.SerialNumber, this.sn);

	this.service = new Service.StatelessProgrammableSwitch();

	this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
  		.setProps({minValue: 0, maxValue: 2, validValues: [0, 1, 2]});
}


StatelessSwitch.prototype.getServices = function() {
	return [this.informationService, this.service];
}
