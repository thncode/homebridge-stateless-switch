var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-stateless-switch", "StatelessSwitch", StatelessSwitch);
}

function StatelessSwitch(log, config) {

	this.log = log;

	this.name = config["name"];
	this.sn = config['sn'] || 'Unknown';

	this.service = new Service.StatelessProgrammableSwitch();

	var self = this;

//		self.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(self.value);
}

StatelessSwitch.prototype.getServices = function() {

	var informationService = new Service.AccessoryInformation();

	informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "Thomas Nemec")
		.setCharacteristic(Characteristic.Model, "Stateless Switch")
		.setCharacteristic(Characteristic.SerialNumber, this.sn);

	return [informationService, this.service];
}
