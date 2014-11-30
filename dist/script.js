var toiletApp = {};

var apiID = 'ae14015e';
var apiKey = 'e0c56e76772fe67b98846adfc6c09565';
var $countriesList = $('select.countries');
var arrCountryNames = [];
var inputVariants = {
	'Antigua':'Antigua%20and%20Barbuda',
	'Barbuda':'Antigua%20and%20Barbuda',
	'Bolivia':'Bolivia%20(Plurinational%20State%20of)',
	'Bosnia':'Bosnia%20and%20Herzegovina',
	'Herzegovina':'Bosnia%20and%20Herzegovina',
	'North Korea':"Democratic%20People's%20Republic of Korea",
	'Iran':'Iran%20(Islamic%20Republic%20of)',
	'Laos':"Lao%20People's%20Democratic%20Republic",
	'Micronesia':'Micronesia%20(Federated%20States%20of)',
	'Moldova':'Republic%20of%20Moldova',
	'Syria':'Syrian%20Arab%20Republic',
	'Vietnam':'Viet%20Nam',
	'The Philippines':'Philippines',
	'Russia':'Russian%20Federation',
	'USA':'United%20States%20of%20America',
	'Tanzania':'United%20Republic%20of%20Tanzania',
	'Yugoslavia':'The%20former%20Yugoslav%20Republic%20of%20Macedonia',
	'UAE':'United%20Arab%20Emirates',
	'Venezuela':'Venezuela%20(Bolivarian%20Republic%20of)'
};

var $chart = $('.chart').find('canvas');
var $hideAll = $('div.one, div.two, div.three, div#pageLoad, div#dataLoad, div.default, div.dataInfo');
var $dataLoader = $('div#dataLoad');
var $error = $('div.error');
var $countryData = $('section.countryData');
var $input = $('#searchCountry');
var tl = new TimelineLite();

toiletApp.init = function(){
	toiletApp.getCountries();
};

toiletApp.pageLoad = function(){
	TweenMax.staggerFrom('header span',0.6, {top:-20, autoAlpha:0}, 0.1);
	$('#pageLoad').fadeIn(900);
	function spinningPoop(n){
		tl.to($('#poop1'), n, {rotation:"+=360"}).to($('#poop2'), n, {rotation:"+=360"}).to($('#poop3'), n, {rotation:"+=360", onComplete:function(){spinningPoop(n)}});
	};
	spinningPoop(0.9);
};

toiletApp.initialLoad = function(){
		tl.to($('form'),0.4,{top:0, autoAlpha:1})
		.to($countryData,0.8,{top:0,autoAlpha:1})
		.to($('footer'),0.8,{top:0,autoAlpha:1});
};

toiletApp.dataLoad = function(){
	$('.content').css('opacity',0.6);
	$dataLoader.show();
	function flushingData(n){
		TweenLite.to($('#flush'), n, {rotation:"+=360", ease:Linear.easeNone, onComplete:function(){flushingData(n)}});
	};
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

toiletApp.getCountries = function(){
	$.ajax({
		url: 'http://api.undata-api.org/WHO/Proportion%20of%20population%20using%20improved%20sanitation%20facilities/countries?app_id='+apiID+'&app_key='+apiKey,
		type: 'GET',
		dataType: 'json',
		beforeSend: function(){
			toiletApp.pageLoad();
		},
		error: function(request, status, error){
			$hideAll.hide();
			$countryData.css('visibility','visible');
			$('.content').css('opacity',1);
			$error.show();
			$('#errorMessage').text('Unable to access database.');
			$('#action').text('Please try again later.');
		},
		success: function(countries){
			setTimeout(function(){
				for (var i=0;i<countries.length;i++){
					arrCountryNames.push(countries[i].name);
				}
				arrCountryNames = arrCountryNames.sort();
				console.log(arrCountryNames);
				$input.autocomplete({
					source: arrCountryNames,
					minLength: 2
				});
				toiletApp.getCountryData(arrCountryNames);
				$('#pageLoad').fadeOut(500);
				toiletApp.initialLoad();
			},1300);
		}
	});
};

toiletApp.autoComplete = function(arr){
	$input.autocomplete({
		source: arr,
		minLength: 2
	}).attr('autocomplete', 'on');
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
			$hideAll.hide();
			$error.show();
			$('#errorMessage').text('Unable to access database.');
			$('#action').text('Please try again later.');
		},
		success: function(countryData){
			setTimeout(function(){
				$('.chart').empty();
				toiletApp.parseCountryData(countryData);
				$dataLoader.hide();
				$('.content').css('opacity',1);
			}, 500);

		}
	});
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

toiletApp.evalCountryName = function(variants){
	selected = document.querySelector('#searchCountry');
	country = selected.value;
	country = country.replace(country.charAt(0), country.charAt(0).toUpperCase());
	if (variants.hasOwnProperty(country)){
		toiletApp.ajaxRequest(variants[country], apiID, apiKey);
	}else{
		toiletApp.userInput(arrCountryNames, country);
	}
};

toiletApp.userInput = function(countryList, country){
			if (countryList.indexOf(country)==-1){
				$hideAll.hide();
				$error.show();
				$('.content').css('opacity',1);
				$('#errorMessage').text('Looks like '+country+' isn\'t included in the database.');
				$('#action').text('Please search for another country.');
			}
			else if (!country.match(/\s/g)){
				toiletApp.ajaxRequest(country, apiID, apiKey);
			}else{
				country = selected.value.replace(/\s/g, '%20');
				toiletApp.ajaxRequest(country, apiID, apiKey);
			}
	$.smoothScroll({
		scrollTarget: '.mainSearch',
		speed: 600
	});		
};

toiletApp.getCountryData = function(arrCountryNames){
	$('#searchButton').on('click', function(e){
		toiletApp.evalCountryName( inputVariants);	
	});
	$('.ui-autocomplete').on('click keydown','li',function(){
		console.log('I work!');
		toiletApp.dataLoad();
		toiletApp.evalCountryName( inputVariants);		
	});
	$input.on('keydown', function(e){
		if (e.keyCode == 13) {
			toiletApp.dataLoad();
			toiletApp.evalCountryName( inputVariants);	
			$('.ui-autocomplete').hide();
		}
	});

};

toiletApp.showOne = function(countryData, area, percent, chart){
	i=0;
	$('div.dataInfo, div.one').show();
	$('div.three, div.two').hide(); 
	$('div.error, div.default').hide();
	$('#area .chart').prepend(chart);
	toiletApp.displayData();
	$('#area').find('.percent').text(percent);
	$('.area').text(countryData[i]['residence area'].toLowerCase());
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
	if (percent==0){
		$('.universal').show();
	}else{
		$('.universal').hide();
	}
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
		$hideAll.hide();
		$error.show();
		$('.content').css('opacity',1);
		$('#errorMessage').text('Sorry, there\'s not enough data about '+countryData[2].area_name+'.');
		$('#action').text('Please search for another country.');	
	}else{
		var countryName = countryData[0].area_name;
		console.log(countryName);
		if(countryName=='Philippines'){
			$('#countryName').text('The '+countryName);
		}else if(countryName=='Viet Nam'){
			$('#countryName').text('Vietnam');
		}else{
			$('#countryName').text(countryName);
		}
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
				$hideAll.hide();
				$error.show();
				$('.content').css('opacity',1);
				$('#errorMessage').text('Sorry, there\'s not enough data about '+countryData[2].area_name+'.');
				$('#action').text('Please search for another country.');	
			}
		} //END OF FOR LOOP
	}

}; //END OF METHOD

$(function(){
	$('body').on('click', 'button', function(e){
		e.preventDefault();
	});	
	toiletApp.init();
});