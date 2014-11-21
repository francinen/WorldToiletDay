var toiletApp = {};

var apiID = 'ae14015e';
var apiKey = 'e0c56e76772fe67b98846adfc6c09565';
var $countriesList = $('select.countries');
var arrCountryNames = [];

toiletApp.init = function(){
	toiletApp.getCountries();
};

toiletApp.pageLoad = function(){
	$('#pageload').hide();
	$('form, section.countryData').css('visibility','visible');
};

toiletApp.displayData = function(){
	$('.dial').knob({
		readOnly: true,
		width: '90%',
		thickness: '.25',
		bgColor: '#7f4f27',
		fgColor: '#c3b48c'
	});
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
	var random = Math.floor(Math.random()*(arr.length));
	$.each(arr, function(i, country){
		var countryName = $('<option>').text(arr[i]).attr('value',arr[i]);
		if (i==random){
			country = arr[i];
			if (!country.match(/\s/g)){
				$.ajax({
					url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/'+country+'/records?app_id='+apiID+'&app_key='+apiKey,
					type: 'GET',
					dataType: 'json',
					success: function(countryData){
						console.log(countryData);
						$('.chart').empty();
						toiletApp.parseCountryData(countryData);
						toiletApp.pageLoad();
					}
				});
			}else{
				country = country.replace(/\s/g, '%20');
				$.ajax({
					url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/'+country+'/records?app_id='+apiID+'&app_key='+apiKey,
					type: 'GET',
					dataType: 'json',
					success: function(countryData){
						console.log(countryData);
						$('.chart').empty();
						toiletApp.parseCountryData(countryData);
						toiletApp.pageLoad();
					}
				});
			}		
		}
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
					$('.chart').empty();
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
					$('.chart').empty();
					toiletApp.parseCountryData(countryData);
				}
			});
		}		
	});
};

toiletApp.parseCountryData = function(countryData){
	if (countryData.length>=3){
		for (var i=0;i<3;i++){
			$('#countryName').text(countryData[i].area_name);
			var area = countryData[i]['residence area'];
			var percent = countryData[i].value;
			if (area=='Total'){
				if (i>0){
					if (area==countryData[0]['residence area']){
						$('section.countryData').hide();
						$('section.error').show();
						$('#countryNameError').text(countryData[i].area_name);
					}else{
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#total .chart').prepend(total);
						toiletApp.displayData();
						$('#total').find('.percent').text(percent);
						$('section.countryData').show();
						$('section.error').hide();
					}
				}else{
					var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#total .chart').prepend(total);
					toiletApp.displayData();
					$('#total').find('.percent').text(percent);
					$('section.countryData').show();
					$('section.error').hide();
				}
			}else if (area=='Rural'){
				if (i>0){
					if (area==countryData[0]['residence area']){
						$('section.countryData').hide();
						$('section.error').show();
						$('#countryNameError').text(countryData[i].area_name);
					}else{
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#rural .chart').prepend(rural);
						toiletApp.displayData();
						$('#rural').find('.percent').text(percent);
						$('section.countryData').show();
						$('section.error').hide();
					}
				}else{
					var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#rural .chart').prepend(rural);
					toiletApp.displayData();
					$('#rural').find('.percent').text(percent);
					$('section.countryData').show();
					$('section.error').hide();
				}
			}else if (area=='Urban'){
				if (i>0){
					if (area==countryData[0]['residence area']){
						$('section.countryData').hide();
						$('section.error').show();
						$('#countryNameError').text(countryData[i].area_name);
					}else{
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#urban .chart').prepend(urban);
						toiletApp.displayData();
						$('#urban').find('.percent').text(percent);
						$('section.countryData').show();
						$('section.error').hide();
					}
				}else{
					var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#urban .chart').prepend(urban);
					toiletApp.displayData();
					$('#urban').find('.percent').text(percent);
					$('section.countryData').show();
					$('section.error').hide();
				}
			}
		}
	}else{
		$('section.countryData').hide();
		$('section.error').show();
		$('#countryNameError').text(countryData[i].area_name);	
	}
	
};

$(function(){
	toiletApp.init();
	$('.dial').knob({
		readOnly: true,
		width: '90%',
		thickness: '.25',
		bgColor: '#7f4f27',
		fgColor: '#c3b48c'
	});
});