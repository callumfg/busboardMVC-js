class Bus{
	constructor(station, line, towards, time) {
		this.station = station;
		this.line = line;
		this.towards = towards;
		this.time = time;
	}

	showTestData() {
//		return this.name + ", id: " + this.id; 
        return "Stop name " + this.station + " : " + this.line + " towards " + this.towards + " in " + this.time + " seconds"
//console.log(`${bus.line} towards ${bus.towards} : ${toMinutes(bus.time)}`))
	};

	// editName(newName) {
	// 	this.name = newName
	// }
}; 

module.exports = Bus;
