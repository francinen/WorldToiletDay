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
}

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

toiletApp.evalData = function(area,percent,id){
	if (i==0){
		// if first index matches second
		if (area==countryData[1]['residence area']){
			$('section.three, section.two').hide();
			$('section.one').show();
			var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
			$('#area .chart').prepend(chart);
			toiletApp.displayData();
			$('#area').find('.percent').text(percent);
			$('#area').find('.area').text(area);
			break;

			// if first index matches third
		}else if (area==countryData[2]['residence area']){
			$('section.three, section.one').hide();
			$('section.two').show();
			var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
			$('#area1 .chart').prepend(chart);
			toiletApp.displayData();
			$('#area1').find('.percent').text(percent);
			$('#area1').find('.area').text(area);
		}
		// if first index is unique
		else{
			$('section.one, section.two').hide();
			$('section.three').show();
			var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
			$('#'+id+' .chart').prepend(chart);
			toiletApp.displayData();
			$('#'+id).find('.percent').text(percent);
			$('section.error').hide();
		}
	}else if(i==1){
		if (countryData[0]['residence area']==countryData[2]['residence area']){
			$('section.three, section.one').hide();
			$('section.two').show();
			var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
			$('#area2 .chart').prepend(chart);
			toiletApp.displayData();
			$('#area2').find('.percent').text(percent);
			$('#area2').find('.area').text(area);
		}
		else{
			$('section.one, section.two').hide();
			$('section.three').show();
			var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
			$('#'+id+' .chart').prepend(chart);
			toiletApp.displayData();
			$('#'+id).find('.percent').text(percent);
			$('section.error').hide();
		}
	}
	else if (i==2){
		$('section.two, section.one').hide();
		$('section.three').show();
		var chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
		$('#'+id+' .chart').prepend(chart);
		toiletApp.displayData();
		$('#'+id).find('.percent').text(percent);
		$('section.error').hide();
	}
}

toiletApp.parseCountryData = function(countryData){
	if (countryData.length>=3){
		for (var i=0;i<3;i++){
			$('#countryName').text(countryData[i].area_name);
			var area = countryData[i]['residence area'];
			var percent = countryData[i].value;
			if (area=='Total'){
				if (i==0){
					// if first index matches second
					if (area==countryData[1]['residence area']){
						$('section.three, section.two').hide();
						$('section.one').show();
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area .chart').prepend(total);
						toiletApp.displayData();
						$('#area').find('.percent').text(percent);
						$('#area').find('.area').text(area);
						break;

						// if first index matches third
					}else if (area==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area1 .chart').prepend(total);
						toiletApp.displayData();
						$('#area1').find('.percent').text(percent);
						$('#area1').find('.area').text(area);
					}
					// if first index is unique
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#total .chart').prepend(total);
						toiletApp.displayData();
						$('#total').find('.percent').text(percent);
						$('section.error').hide();
					}
				}else if(i==1){
					if (countryData[0]['residence area']==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area2 .chart').prepend(total);
						toiletApp.displayData();
						$('#area2').find('.percent').text(percent);
						$('#area2').find('.area').text(area);
					}
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#total .chart').prepend(total);
						toiletApp.displayData();
						$('#total').find('.percent').text(percent);
						$('section.error').hide();
					}
				}
				else if (i==2){
					$('section.two, section.one').hide();
					$('section.three').show();
					var total = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#total .chart').prepend(total);
					toiletApp.displayData();
					$('#total').find('.percent').text(percent);
					$('section.error').hide();
				}
			}else if (area=='Rural'){
				if (i==0){
					if (area==countryData[1]['residence area']){
						$('section.three, section.two').hide();
						$('section.one').show();
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area .chart').prepend(rural);
						toiletApp.displayData();
						$('#area').find('.percent').text(percent);
						$('#area').find('.area').text(area);
						break;
					}else if (area==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area1 .chart').prepend(rural);
						toiletApp.displayData();
						$('#area1').find('.percent').text(percent);
						$('#area1').find('.area').text(area);
					}
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#rural .chart').prepend(rural);
						toiletApp.displayData();
						$('#rural').find('.percent').text(percent);
						$('section.error').hide();
					}
				}else if(i==1){
					if (countryData[0]['residence area']==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area2 .chart').prepend(rural);
						toiletApp.displayData();
						$('#area2').find('.percent').text(percent);
						$('#area2').find('.area').text(area);
					}
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#rural .chart').prepend(rural);
						toiletApp.displayData();
						$('#rural').find('.percent').text(percent);
						$('section.error').hide();
					}
				}else if (i==2){
					$('section.two, section.one').hide();
					$('section.three').show();
					var rural = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#rural .chart').prepend(rural);
					toiletApp.displayData();
					$('#rural').find('.percent').text(percent);
					$('section.error').hide();
				}
			}
			else if (area=='Urban'){
				if (i==0){
					if (area==countryData[1]['residence area']){
						$('section.three, section.two').hide();
						$('section.one').show();
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area .chart').prepend(urban);
						toiletApp.displayData();
						$('#area').find('.percent').text(percent);
						$('#area').find('.area').text(area);
						break;
					}else if (area==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area1 .chart').prepend(urban);
						toiletApp.displayData();
						$('#area1').find('.percent').text(percent);
						$('#area1').find('.area').text(area);
					}
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#urban .chart').prepend(urban);
						toiletApp.displayData();
						$('#urban').find('.percent').text(percent);
						$('section.countryData').show();
						$('section.error').hide();
					}
				}else if(i==1){
					if (countryData[0]['residence area']==countryData[2]['residence area']){
						$('section.three, section.one').hide();
						$('section.two').show();
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#area2 .chart').prepend(urban);
						toiletApp.displayData();
						$('#area2').find('.percent').text(percent);
						$('#area2').find('.area').text(area);
					}
					else{
						$('section.one, section.two').hide();
						$('section.three').show();
						var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
						$('#urban .chart').prepend(urban);
						toiletApp.displayData();
						$('#urban').find('.percent').text(percent);
						$('section.error').hide();
					}
				}else if (i==2){
					$('section.two, section.one').hide();
					$('section.three').show();
					var urban = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
					$('#urban .chart').prepend(urban);
					toiletApp.displayData();
					$('#urban').find('.percent').text(percent);
					$('section.error').hide();
				}
			};
		}; //END OF FOR LOOP
	} 
	//END OF IF STATEMENT
	else{
		$('section.one, section.two, section.three').hide();
		$('section.error').show();
		$('#countryNameError').text(countryData[i].area_name);	
	};
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