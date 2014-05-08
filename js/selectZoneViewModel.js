define('selectZoneViewModel', ['ko'], function(ko) {
	var selectZoneViewModelType = function() {
		var self = this;
		this.allCommunities = ko.observableArray([]);
		this.dataLoaded = ko.observable(false);
		this.selectedCommunity = ko.observable();

		this.streetsLoaded = ko.observable(true);
		this.selectedStreet = ko.observable();
		this.selectedStreetDivision = ko.observable();

		this.loadData = function(data) {
			var communityLookupMap = {};
			for(var i = 0; i < data.length; ++i) {
				if(!(data[i].gemeente in communityLookupMap)) {
					var newCommunity = { name: data[i].gemeente, streets: [] };
					this.allCommunities.push(newCommunity);
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
			this.allCommunities.sort(function(a, b) { return a.name.localeCompare(b.name); } );
			this.dataLoaded(true);
		};

		this.communityStreets = ko.computed(function() {
			if(this.selectedCommunity()) {
				return this.selectedCommunity().streets;
			} else {
				return [];
			}
		}, this);

		this.isStreetDivided = ko.computed(function() {
			return this.selectedCommunity() && this.selectedStreet() && this.selectedStreet().divisions.length > 1;
		}, this);

		this.streetDivisions = ko.computed(function() {
			if(this.isStreetDivided()) {
				var partsObjects = this.selectedStreet().divisions;
				var partsTexts = [];
				for(var i=0; i<partsObjects.length; ++i) {
					this.pushText(partsTexts, partsObjects[i], "even van ", "even tot", " (even)");
					this.pushText(partsTexts, partsObjects[i], "oneven van ", "oneven tot", " (odd)");
				}
				return partsTexts;
			} else {
				return [];
			}
		}, this);

		this.selectedSector = ko.computed(function() {
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
		}, this);

		this.pushText = function(target, obj, startField, stopField, postfix) {
			if(obj[startField] !== "" && obj[startField] !== "-" && obj[startField] !== "-1") {
				target.push({ label: obj[startField] + "-" + obj[stopField] + postfix, value: obj.sector});
			}
		};
		
		return {
			allCommunities: self.allCommunities,
			dataLoaded: self.dataLoaded,
			selectedCommunity: self.selectedCommunity,
			streetsLoaded: self.streetsLoaded,
			selectedStreet: self.selectedStreet,
			selectedStreetDivision: self.selectedStreetDivision,
			
			loadData: self.loadData,
			communityStreets: self.communityStreets,
			isStreetDivided: self.isStreetDivided,
			streetDivisions: self.streetDivisions,
			selectedSector: self.selectedSector
		};
	};
	
	return {
		createModel: function() {
			return new selectZoneViewModelType();
		}
	};
});

