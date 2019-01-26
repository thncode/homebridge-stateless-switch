var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-stateless-switch", "stateless-switch", StatelessSwitch);
}

function StatelessSwitch(log, config) {

	this.log = log;

	this.name = config["name"];
	this.url = config['url'];
	this.topic = config['topic'];
	this.sn = config['sn'] || 'Unknown';

	this.client_Id = 'switch_' + Math.random().toString(16).substr(2, 8);

	var self = this;

	self.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(0);

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
