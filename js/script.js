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
	$('form').css('visibility','visible');
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
			toiletApp.pageLoad();
		}
	});
};

toiletApp.ajaxRequest = function(country, apiID, apiKey){
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
};

toiletApp.listCountries = function(arr){
	var random = Math.floor(Math.random()*(arr.length));
	$.each(arr, function(i, country){
		var countryName = $('<option>').text(arr[i]).attr('value',arr[i]);
		if (i==random){
			country = arr[i];
			if (!country.match(/\s/g)){
				toiletApp.ajaxRequest(country, apiID, apiKey);
			}else{
				country = country.replace(/\s/g, '%20');
				toiletApp.ajaxRequest(country, apiID, apiKey);
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
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}else{
			country = $('option:selected').attr('value').replace(/\s/g, '%20');
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}		
	});
};

toiletApp.evalData = function(i, area, percent, countryData, id){
	$chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
	console.log(i, area, percent, id);
	if (i===0){
		// if first index matches second
		if (area===countryData[1]['residence area']&&area===countryData[2]['residence area']){
				toiletApp.showOne(area, percent, $chart);
				console.log('Match!');
				console.log(countryData[1]['residence area']);
				console.log(countryData[2]['residence area']);
			// if first index matches third
		}else if (area===countryData[2]['residence area']){
			toiletApp.showTwo();
			$('#area1 .chart').prepend($chart);
			toiletApp.displayData();
			$('#area1').find('.percent').text(percent);
			$('#area1').find('.area').text(area);
		
		}
		// if first index is unique
		else if(area !== countryData[2]['residence area'] && area !== countryData[1]['residence area']){
			toiletApp.showThree(area, percent, $chart, id);
			console.log('No match!');
		}
	}else if(i===1){
		if (countryData[0]['residence area']==countryData[2]['residence area'] && area != countryData[0]['residence area']){
			toiletApp.showTwo();
			$('#area2 .chart').prepend($chart);
			toiletApp.displayData();
			$('#area2').find('.percent').text(percent);
			$('#area2').find('.area').text(area);
		}
		else{
			toiletApp.showThree(area, percent, $chart, id);
		}
	}
	else if (i===2){
		if(area !== countryData[0]['residence area'] && area !== countryData[1]['residence area']){
			toiletApp.showThree(area, percent, $chart, id);
			console.log('No matches!');
		}
	}
};

toiletApp.showOne = function(area, percent, chart){
	$('section.one').show();
	$('section.three, section.two').hide(); 
	$('section.error').hide();
	$('#area .chart').prepend(chart);
	toiletApp.displayData();
	$('#area').find('.percent').text(percent);
	$('#area').find('.area').text(area);
};

toiletApp.showTwo = function(){
	$('section.two').show();
	$('section.three, section.one').hide();
	$('section.error').hide();
};

toiletApp.showThree = function(area, percent, chart, id){
	$('section.three').show();
	$('section.one, section.two').hide(); 
	$('section.error').hide();
	$('#'+id+' .chart').prepend(chart);
	toiletApp.displayData();
	$('#'+id).find('.percent').text(percent);
};

toiletApp.parseCountryData = function(countryData){
	for (i=2;i>=0;i--){
		if (countryData.length>=3){
				$('#countryName').text(countryData[i].area_name);
				var area = countryData[i]['residence area'];
				var percent = countryData[i].value;
				if (area==='Total'){
					toiletApp.evalData(i, area, percent, countryData, 'total');
				}else if (area==='Rural'){
					toiletApp.evalData(i, area, percent, countryData, 'rural');
				}
				else if (area==='Urban'){
					toiletApp.evalData(i, area, percent, countryData, 'urban');
				}
			
		} //END OF IF STATEMENT
		else{
			$('section.one, section.two, section.three').hide();
			$('section.error').show();
			$('#countryNameError').text(countryData[i].area_name);	
		}
	} //END OF FOR LOOP
}; //END OF METHOD
	
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