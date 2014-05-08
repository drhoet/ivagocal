(function() {
    requirejs.config(
        {
            paths: {
				'moment': 'vendor/moment.min',
				'ko': 'vendor/knockout-3.1.0',
				'jquery': 'vendor/jquery-1.11.0.min',
				'bootstrap': 'vendor/bootstrap.min'
            },
			shim: {
				'bootstrap': {deps: ['jquery']}
			}
        }
    );
 
    require(
        ['selectZoneViewModel', 'iCalGenerator', 'ko', 'jquery', 'bootstrap'],
        function(modelModule, generatorModule, ko, $, _bootstrap) {
			//var baseUrl = '/data/';
			var baseUrl = 'http://datatank.gent.be/MilieuEnNatuur/';
			
			function getURLParameter(sParam) {
				var sPageURL = window.location.search.substring(1);
				var sURLVariables = sPageURL.split('&');
				for (var i = 0; i < sURLVariables.length; i++) 	{
					var sParameterName = sURLVariables[i].split('=');
					if (sParameterName[0] == sParam) 		{
						return sParameterName[1];
					}
				}
			}

			$('#createICalButton').click(function() {
				var generator = generatorModule.createGenerator();
				var sector = model.selectedSector();
				$('#downloadICalModal').modal();
				$.getJSON(baseUrl + 'IvagoOphaalkalender2014.json', function(data) {
					generator.loadData(data.IvagoOphaalkalender2014);
					$('#downloadLink').attr('href', 'data:application/octet-stream;charset=utf-8;base64,' + window.btoa(generator.generate(sector)));
					$('#downloadLink').attr('download', 'iCal-' + sector + '.ics');
					$('#downloadWaiting').addClass('hidden');
					$('#downloadLink').removeClass('hidden');
				});
			});
		
			var model = modelModule.createModel();
			ko.applyBindings(model);
			$.getJSON(baseUrl + "IVAGO-Stratenlijst.json", function(data){
				model.loadData(data["IVAGO-Stratenlijst"]);
			});
        }
    );
})();
