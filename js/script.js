var toiletApp = {};

var apiID = 'ae14015e';
var apiKey = 'f41c61d0bf1b7e93af47db0cb5b9e97b';
var $countriesList = $('select.countries');
var arrCountryNames = [];

toiletApp.init = function(){
	toiletApp.getCountries();
};

toiletApp.getCountries = function(){
	$.ajax({
		url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/countries?app_id='+apiID+'&app_key='+apiKey,
		type: 'GET',
		dataType: 'json',
		success: function(countries){
			console.log(countries);
			for (var i=0;i<countries.length;i++){
				arrCountryNames.push(countries[i].name);
			}
			arrCountryNames = arrCountryNames.sort();
			toiletApp.listCountries(arrCountryNames);

			toiletApp.getCountryData();
		}
	});
};

toiletApp.listCountries = function(arr){

	$.each(arr, function(i, country){
		var countryName = $('<option>').text(arr[i]).attr('value',arr[i]);
		$countriesList.append(countryName);
	});
};

toiletApp.getCountryData = function(){
	var country;
	$('.countries').change(function(){
		country = $('option:selected').attr('value');
		if (!country.match(/\s/g)){
			$.ajax({
				url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/'+country+'/records?app_id='+apiID+'&app_key='+apiKey,
				type: 'GET',
				dataType: 'json',
				success: function(countryData){
					console.log(countryData);
					$('.countryData').find('h2, h3, h4, h5').text('');
					toiletApp.parseCountryData(countryData);
				}
			});
		}else{
			country = $('option:selected').attr('value').replace(/\s/g, '%20');
			$.ajax({
				url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/'+country+'/records?app_id='+apiID+'&app_key='+apiKey,
				type: 'GET',
				dataType: 'json',
				success: function(countryData){
					console.log(countryData);
					$('.countryData').find('h2, h3, h4, h5').text('');
					toiletApp.parseCountryData(countryData);
				}
			});
		}		
	});
};

toiletApp.parseCountryData = function(countryData){
	for (var i=0;i<3;i++){
		var area = countryData[i]['residence area'];
		if (area=='Total'){
			$('.total').text(countryData[i].value)
		}else if (area=='Rural'){
			$('.rural').text(countryData[i].value)
		}else{
			$('.urban').text(countryData[i].value)
		}
		// console.log(area);
	}
};

$(function(){
	toiletApp.init();
});