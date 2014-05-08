define('iCalGenerator', ['moment'], function(moment) {

	var iCalGeneratorType = function() {
		var self = this,
			pub = {};
		
		this.createEvent = function(event) {
			return 'BEGIN:VEVENT\r\n' +
				'DTSTART;VALUE=DATE:' + moment(event.datum, 'YYYY[-]MM[-]DD').format('YYYYMMDD')+ '\r\n' +
				'DTSTAMP:' + moment().format('YYYYMMDD[T]HHmmss[Z]') + '\r\n' +
				'SUMMARY:' + event.Fractie + '\r\n' +
				'TRANSP:TRANSPARENT\r\n' +
				'END:VEVENT\r\n';
		};
		
		pub.loadData = function(data) {
			self.data = data;
		};
		
		pub.generate = function(sector) {
			var result = 'BEGIN:VCALENDAR\r\nPRODID:-//drhoet//Ivago Calendar Generator 1.0//EN\r\nVERSION:2.0\r\nX-WR-CALDESC:Ivago Calendar ' + sector + '\r\n';
			var j = 0;
			for(var i=0; i<self.data.length; ++i) {
				if(self.data[i].sector == sector) {
					result += self.createEvent(self.data[i]);
				}

			}
			result += 'END:VCALENDAR';
			return result;
		};

		return pub;
	};
	
	return {
		createGenerator: function() {
			return new iCalGeneratorType();
		}
	};
});
