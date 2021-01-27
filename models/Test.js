class Bus{
	constructor(station, line, towards, time) {
		this.station = station;
		this.line = line;
		this.towards = towards;
		this.time = time;
	}

	showTestData() {
        return this.line + " towards " + this.towards + ": " + toMinutes(this.time) 
		function toMinutes(seconds){
			if (Math.floor(seconds / 60) >= 1){return `${Math.floor(seconds/60)} mins`
			} else{return 'due'}
		}
	};

	showHeader(){
		return "Bus Stop : " + this.station
	}

	// editName(newName) {
	// 	this.name = newName
	// }
}; 

module.exports = Bus;
