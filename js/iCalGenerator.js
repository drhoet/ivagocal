var ICalGenerator = function() {

	this.loadData = function(data) {
		this.data = data;
	};

	this.generate = function(sector) {
		var result = 'BEGIN:VCALENDAR\r\nPRODID:-//drhoet//Ivago Calendar Generator 1.0//EN\r\nVERSION:2.0\r\nX-WR-CALDESC:Ivago Calendar ' + sector + '\r\n';
		var j = 0;
		for(var i=0; i<this.data.length; ++i) {
			if(this.data[i].sector == sector) {
				result += this.createEvent(this.data[i]);
			}

		}
		result += 'END:VCALENDAR';
		return result;
	};

	this.createEvent = function(event) {
		var now = new Date();
		return 'BEGIN:VEVENT\r\n' +
			'DTSTART;VALUE=DATE:' + moment(event.datum, 'YYYY[-]MM[-]DD').format('YYYYMMDD')+ '\r\n' +
			'DTSTAMP:' + moment().format('YYYYMMDD[T]HHmmss[Z]') + '\r\n' +
			'SUMMARY:' + event.Fractie + '\r\n' +
			'TRANSP:TRANSPARENT\r\n' +
			'END:VEVENT\r\n';
	};
};
