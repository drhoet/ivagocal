define('selectZoneViewModel', ['ko'], function(ko) {
	var selectZoneViewModelType = function() {
		var self = this,
			pub = {};
		
		pub.allCommunities = ko.observableArray([]);
		pub.dataLoaded = ko.observable(false);
		pub.selectedCommunity = ko.observable();

		pub.streetsLoaded = ko.observable(true);
		pub.selectedStreet = ko.observable();
		pub.selectedStreetDivision = ko.observable();

		pub.loadData = function(data) {
			var communityLookupMap = {};
			for(var i = 0; i < data.length; ++i) {
				if(!(data[i].gemeente in communityLookupMap)) {
					var newCommunity = { name: data[i].gemeente, streets: [] };
					pub.allCommunities.push(newCommunity);
					// I need an array of items to be shown in the dropdown
					// + I need a map to be able to quickly find whether a street is already added
					communityLookupMap[data[i].gemeente] = { community: newCommunity, streetLookupMap: {} };
				}
				var communityWrapper = communityLookupMap[data[i].gemeente];
				if(!(data[i].straatnaam in communityWrapper.streetLookupMap)) {
					var newStreet = { name: data[i].straatnaam, divisions: [] };
					communityWrapper.community.streets.push(newStreet);
					communityWrapper.streetLookupMap[data[i].straatnaam] = newStreet;
				}
				communityWrapper.streetLookupMap[data[i].straatnaam].divisions.push(data[i]);
			}
			pub.allCommunities.sort(function(a, b) { return a.name.localeCompare(b.name); } );
			pub.dataLoaded(true);
		};

		pub.communityStreets = ko.computed(function() {
			if(this.selectedCommunity()) {
				return this.selectedCommunity().streets;
			} else {
				return [];
			}
		}, pub);

		pub.isStreetDivided = ko.computed(function() {
			return this.selectedCommunity() && this.selectedStreet() && this.selectedStreet().divisions.length > 1;
		}, pub);

		pub.streetDivisions = ko.computed(function() {
			if(this.isStreetDivided()) {
				var partsObjects = this.selectedStreet().divisions;
				var partsTexts = [];
				for(var i=0; i<partsObjects.length; ++i) {
					self.pushText(partsTexts, partsObjects[i], "even van ", "even tot", " (even)");
					self.pushText(partsTexts, partsObjects[i], "oneven van ", "oneven tot", " (odd)");
				}
				return partsTexts;
			} else {
				return [];
			}
		}, pub);

		pub.selectedSector = ko.computed(function() {
			if(this.selectedCommunity() && this.selectedStreet()) {
				if(this.isStreetDivided()) {
					if(this.selectedStreetDivision()) {
						return this.selectedStreetDivision().value;
					} else {
						return null;
					}
				} else {
					return this.selectedStreet().divisions[0].sector;
				}
			} else {
				return null;
			}
		}, pub);

		this.pushText = function(target, obj, startField, stopField, postfix) {
			if(obj[startField] !== "" && obj[startField] !== "-" && obj[startField] !== "-1") {
				target.push({ label: obj[startField] + "-" + obj[stopField] + postfix, value: obj.sector});
			}
		};
		
		return pub;
	};
	
	return {
		createModel: function() {
			return new selectZoneViewModelType();
		}
	};
});

