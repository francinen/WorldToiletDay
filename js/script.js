var toiletApp = {};

var apiID = 'ae14015e';
var apiKey = 'e0c56e76772fe67b98846adfc6c09565';
var $countriesList = $('select.countries');
var arrCountryNames = [];

var $chart = $('.chart').find('canvas');
var tl = new TimelineLite();
toiletApp.init = function(){
	toiletApp.getCountries();
};

toiletApp.pageLoad = function(){
	$('#pageLoad').show();
	function spinningPoop(n){
		tl.to($('#poop1'), n, {rotation:"+=360"}).to($('#poop2'), n, {rotation:"+=360"}).to($('#poop3'), n, {rotation:"+=360", onComplete:function(){spinningPoop(n)}});
	}
	spinningPoop(0.9);
};

toiletApp.initialLoad = function(){
		tl.staggerFrom($('form fieldset'),0.8,{autoAlpha:0},0.6)
		.to($('.countryData'),0.8,{autoAlpha:1});
		toiletApp.ui();
};

toiletApp.dataLoad = function(){
	$('.content').css('opacity',0.6);
	$('#dataLoad').show();
	function flushingData(n){
		TweenLite.to($('#flush'), n, {rotation:"+=360", ease:Linear.easeNone, onComplete:function(){flushingData(n)}});
		TweenMax.staggerFrom('#flush path',n, {scale:0, autoAlpha:0}, 0.1);
	}
	flushingData(1.6);
};

toiletApp.displayData = function(){
	$('.dial').knob({
		readOnly: true,
		width: '90%',
		thickness: '.25',
		fgColor: '#8a6755',
		bgColor: '#a2af9f'
	});
	
};

toiletApp.hideCountryList = function(){
	$('select').slideUp(600,function(){
		$('#countryList').addClass('fa-chevron-down').removeClass('fa-chevron-up');
	});
};

toiletApp.ui = function(){
	$('select, .selectCountry').on('click', function(){
		$('select').slideToggle(600,function(){
			$('#countryList').toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
		});
	});
	$('input#searchCountry').on('click hover',function(){
		$('.fa-search').css({'opacity':1});
		toiletApp.hideCountryList();
	});
	$('#random').on('click', function(){
		toiletApp.hideCountryList();
		$('input#searchCountry').val('');
	});

};

toiletApp.getCountries = function(){
	$.ajax({
		url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/countries?app_id='+apiID+'&app_key='+apiKey,
		type: 'GET',
		dataType: 'json',
		beforeSend: function(){
			toiletApp.pageLoad();
		},
		error: function(request, status, error){
			$('div.one, div.two, div.three, #pageLoad, div.default').hide();
			$('div.error').show();
			$('#errorMessage').text('Unable to access data.');
			$('#action').text('Please try again later');
		},
		success: function(countries){
			setTimeout(function(){
				for (var i=0;i<countries.length;i++){
					arrCountryNames.push(countries[i].name);
				}
				arrCountryNames = arrCountryNames.sort();
				toiletApp.listCountries(arrCountryNames);
				toiletApp.autoComplete(arrCountryNames);
				toiletApp.getCountryData(arrCountryNames);
				$('#pageLoad').fadeOut(500);
				toiletApp.initialLoad();
			},1300);
		}
	});
};

toiletApp.autoComplete = function(arr){
	$('#searchCountry').autocomplete({
		source: arr,
		minLength: 2
	});
};

toiletApp.ajaxRequest = function(country, apiID, apiKey){
	$.ajax({
		url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/'+country+'/records?app_id='+apiID+'&app_key='+apiKey,
		type: 'GET',
		dataType: 'json',
		beforeSend: function(){
			toiletApp.dataLoad();
		},
		error: function(){
			$('div.one, div.two, div.three').hide();
			$('div.error').show();
			$('#errorMessage').text('Unable to access data.');
			$('#action').text('Please try again later');
		},
		success: function(countryData){
			setTimeout(function(){
				console.log(countryData);
				$('.chart').empty();
				toiletApp.parseCountryData(countryData);
				$('#dataLoad').hide();
				$('.content').css('opacity',1);
			}, 500);

		}
	});
};

toiletApp.listCountries = function(arr){
	var random = Math.floor(Math.random()*(arr.length));
	$.each(arr, function(i, country){
		var countryName = $('<option>').text(arr[i]).attr('value',arr[i]);
		$countriesList.append(countryName);
	});
	$('#countryList').show();
};

toiletApp.randomCountry = function(arr, country, apiID, apiKey){
	var random = Math.floor(Math.random()*(arr.length));
	country = arr[random];
		if (!country.match(/\s/g)){
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}else{
			country = country.replace(/\s/g, '%20');
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}		
};

toiletApp.userInput = function(countryList, country, apiID, apiKey){
		selected = document.querySelector('#searchCountry');
	country = selected.value;
	if (countryList.indexOf(country)==-1){
		$('div.one, div.two, div.three, div.default').hide();
		$('div.error').show();
		$('#errorMessage').text('Looks like '+country+' isn\'t included in the database.');
		$('#action').text('Please try another');
	}else if (!country.match(/\s/g)){
		toiletApp.ajaxRequest(country, apiID, apiKey);
	}else{
		country = selected.value.replace(/\s/g, '%20');
		toiletApp.ajaxRequest(country, apiID, apiKey);
	}		
};

toiletApp.getCountryData = function(arrCountryNames){
	var country;
	var selected;
	$('.countries').change(function(){
		selected = $('option:selected');
		country = selected.attr('value');
		if (!country.match(/\s/g)){
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}else{
			country = selected.attr('value').replace(/\s/g, '%20');
			toiletApp.ajaxRequest(country, apiID, apiKey);
		}	
	});
	$('#searchButton').on('click', function(e){
		toiletApp.userInput(arrCountryNames, country, apiID, apiKey);	
	});
	$('.ui-autocomplete').on('click','li',function(){
		console.log('I work!');
		toiletApp.userInput(arrCountryNames, country, apiID, apiKey);	
	});
	$('#searchCountry').on('keydown', function(e){
		if (e.keyCode == 13) {
			toiletApp.userInput(arrCountryNames, country, apiID, apiKey);
		}
	});
	$('#random').on('click', function(){
		toiletApp.randomCountry(arrCountryNames, country, apiID, apiKey);
	});

};


toiletApp.showOne = function(countryData, area, percent, chart){
	i=0;
	$('div.dataInfo, div.one').show();
	$('div.three, div.two').hide(); 
	$('div.error, div.default').hide();
	$('#area .chart').prepend(chart);
	toiletApp.displayData();
	$('#area').find('.percent').text(countryData[i].value);
	$('#area').find('.area').text(countryData[i]['residence area']);
};

toiletApp.showTwo = function(){
	$('div.dataInfo, div.two').show();
	$('div.three, div.one').hide();
	$('div.error, div.default').hide();

};

toiletApp.showThree = function(countryData, area, percent, chart, id){
	$('div.dataInfo, div.three').show();
	$('div.one, div.two').hide(); 
	$('div.error, div.default').hide();
	$('#'+id+' .chart').prepend(chart);
	toiletApp.displayData();
	$('#'+id).find('.percent').text(percent);
};


toiletApp.evalData = function(i, area, percent, countryData, id){
	$chart = $('<input>').addClass('dial').attr({'type':'text', 'value':percent});
	console.log(i, area, percent, id);
	if (i===0){
		// if first index matches second
		if (area===countryData[1]['residence area']&&area===countryData[2]['residence area']){
				toiletApp.showOne(countryData, area, percent, $chart);
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
			toiletApp.showThree(countryData, area, percent, $chart, id);
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
			toiletApp.showThree(countryData, area, percent, $chart, id);
		}
	}
	else if (i===2){
		if(countryData[2].year != 2006){
			toiletApp.showOne(countryData, area, percent, $chart);
			console.log('The year is '+countryData[2].year);
		}else{
			toiletApp.showThree(countryData, area, percent, $chart, id);
			console.log('No matches!');
		}

	}
};

toiletApp.parseCountryData = function(countryData){
	if (countryData[2].year != 2006 && countryData[1].year != 2006 && countryData[0].year != 2006){
		$('div.one, div.two, div.three').hide();
		$('div.error').show();
		$('#errorMessage').text('Sorry, there\'s not enough data about '+countryData[2].area_name+'.');
		$('#action').text('Please select another');	
	}else{
		$('#countryName').text(countryData[0].area_name);
		for (i=2;i>=0;i--){
			area = countryData[i]['residence area'];
			percent = 100-(countryData[i].value);
			if (countryData.length>=3){	
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
				$('div.error').show();
				$('#errorMessage').text('Sorry, there\'s not enough data about '+countryData[2].area_name+'.');
				$('#action').text('Please select another');	
			}
		} //END OF FOR LOOP
	}

}; //END OF METHOD

$(function(){
	function toggleList(){
		$('select').slideToggle(600,function(){
			$('#countryList').toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
		});
	}
	// toiletApp.init();
	$('body').on('click', 'button', function(e){
		e.preventDefault();
	});		


	// For testing purposes only
	// $('.dial').knob({
	// 	readOnly: true,
	// 	width: '90%',
	// 	thickness: '.25',
	// 	fgColor: '#8a6755',
	// 	bgColor: '#d7d8be'
	// });
});