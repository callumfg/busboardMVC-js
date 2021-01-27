const Bus = require('../models/Test');
exports.getTestData = (req, res) => {
let topBus = [
new Bus('line', 'towards', 'time')
];
res.render('testView', {
	topBus: topBus,
})
}
exports.getBusHTML = (req, res) => {

		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var passedPostcode = req.params.postcode
		validatePostcode(passedPostcode)

		function validatePostcode (passedPostcode){
			var urlValPostcode = `https://api.postcodes.io/postcodes/${passedPostcode}/validate`
			var requestPost = new XMLHttpRequest()
			requestPost.open('GET', urlValPostcode, true)
		    requestPost.onreadystatechange = function () {
			if (requestPost.readyState === 4) {
				// console.log(requestPost.responseText)
				
					var reqPost = JSON.parse(requestPost.responseText)
					console.log(reqPost)
					if (reqPost.result === true){
						validPostcode(passedPostcode)
					}else {
						res.render('errorView', {
						passedPostcode: req.params.postcode})
					}
			}
		  }
	    requestPost.send()
		}	
		// validPostcode(passedPostcode)
		function validPostcode(passedPostcode){
		var urlLatLong = `https://api.postcodes.io/postcodes?q=${passedPostcode}`
		//getUrlLongLat(passedPostcode);
	    //var urlLatLong = getUrlLongLat()
		var requestLL = new XMLHttpRequest()
		requestLL.open('GET', urlLatLong, true)
		requestLL.onreadystatechange = function () {
			if (requestLL.readyState === 4) {
					var reqLL = JSON.parse(requestLL.responseText)
					getStopArr(reqLL)
			}
		  }
	    
		requestLL.send()
		}

		

		function getStopArr(reqLL){ 
			var latitude = getLat(reqLL)
			var longitude = getLong(reqLL)
			var urlStopCode = `https://api.tfl.gov.uk/Stoppoint?lat=${latitude}&lon=${longitude}&stoptypes=NaptanPublicBusCoachTram`
			
			var requestSC = new XMLHttpRequest()
			requestSC.open('GET', urlStopCode, true)
			requestSC.onreadystatechange = function () {
				if (requestSC.readyState === 4) {
					var reqSC = JSON.parse(requestSC.responseText)
					var stopCode1 = getStopCode(reqSC, 1);
							var stopCode2 = getStopCode(reqSC, 2);
							var urlBus1 = makeUrlBus(stopCode1);
							var urlBus2 = makeUrlBus(stopCode2);
							getBuses(urlBus1, urlBus2);
					// if (reqSC.stopPoints.length >= 2){
					// 		var stopCode1 = getStopCode(reqSC, 1);
					// 		var stopCode2 = getStopCode(reqSC, 2);
					// 		var urlBus1 = makeUrlBus(stopCode1);
					// 		var urlBus2 = makeUrlBus(stopCode2);
					// 		var topFive1 = getBuses(urlBus1);
					// 		// var topFive2 = getBuses(urlBus2);
                    //         // var topBus = []
					// 		// topFive1.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))
					// 		// topFive2.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))


					// } else if (reqSC.stopPoints.length == 1){
					// 		var stopCode1 = getStopCode(reqSC, 1);
					// 		var urlBus1 = makeUrlBus(stopCode1);
					// 		var topFive1 = getBuses(urlBus1);
					// 		var topBus = []
					// 		topFive1.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))
							
					// } //else {topBus = {bus:"No bus stop nearby"}}
					
					// res.render('testView', {
					// topBus : topBus,
					// })
				}
			} 
			requestSC.send()
		}


		function getLat(reqLL){
			return reqLL.result[0].latitude
		}

		function getLong(reqLL){
			return long = reqLL.result[0].longitude
		}

		function getStopCode(reqSC, n){
		return reqSC.stopPoints[n-1].id
		}

		function makeUrlBus(stopPoint){
			return `https://api.tfl.gov.uk/StopPoint/${stopPoint}/Arrivals`
		}

		function getBuses(urlBus1, urlBus2){
			var requestBus1 = new XMLHttpRequest()
			requestBus1.open('GET', urlBus1, true)
			requestBus1.onreadystatechange = function () {
					if (requestBus1.readyState === 4) {
						var reqBus1 = JSON.parse(requestBus1.responseText)
						
						var requestBus2 = new XMLHttpRequest()
							requestBus2.open('GET', urlBus2, true)
							requestBus2.onreadystatechange = function () {
							if (requestBus2.readyState === 4) {
												var reqBus2 = JSON.parse(requestBus2.responseText)
										findBuses(reqBus1, reqBus2)
										
									}

							}
							requestBus2.send()
					}

			}
			requestBus1.send()
		}


		function findBuses(reqArray1, reqArray2){
			let buses1 = reqArray1.map(bus => {
					return{station: bus.stationName, line : bus.lineId, time: bus.timeToStation, towards: bus.towards}
			})
			buses1.sort((a, b) => {
					return a.time - b.time
			})

			let topFive = [];
			for (let a = 0; a<= 4 && a<buses1.length; a++){
			topFive.push(buses1[a])   
			}

            let buses2 = reqArray2.map(bus => {
				return{station: bus.stationName, line : bus.lineId, time: bus.timeToStation, towards: bus.towards}
			})
			buses2.sort((a, b) => {
					return a.time - b.time
			})
            let topFive2 = [];
			for (let a = 0; a<= 4 && a<buses2.length; a++){
			topFive2.push(buses2[a])   
			}
				// return topFive

			// if (reqArray[0].platformName === 'null') {
			// 	console.log(`${reqArray[0].stationName}`)
			// }else{
			// 	console.log(`${reqArray[0].stationName}: Bus stop ${reqArray[0].platformName}`)
			// }
			// topFive.forEach(bus => console.log(`${bus.line} towards ${bus.towards} : ${toMinutes(bus.time)}`))
		    // var topBus = 
			// res.render('testView', {
			// 	topBus : topBus,

			var topBus = []
			topFive.forEach(bus => topBus.push(new Bus(bus.station, bus.line, bus.towards, bus.time)))
//			topBus = topFive.map(bus => {return new Bus(bus.station, bus.line, bus.towards, bus.time)})
			var topBus2 =[]
			topFive2.forEach(bus => topBus2.push(new Bus(bus.station, bus.line, bus.towards, bus.time)))
					res.render('testView', {
					topBus : topBus,
					topBus2 : topBus2,
					passedPostcode : req.params.postcode
					})

		}

		function toMinutes(seconds){
			if (Math.floor(seconds / 60) >= 1){return `${Math.floor(seconds/60)} mins`
			} else{return 'due'}
		}

	    
	
};