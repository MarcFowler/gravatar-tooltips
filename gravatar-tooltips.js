(function() {
	var $, config, gravatarData = {};
	
	config = {
		'matches': '[href^="http://gravatar.com/"], [href^="https://gravatar.com/"], [href^="http://en.gravatar.com/"]',
		'jsonURL': 'http://en.gravatar.com/'
	}
	
	var load = function(url, callback){
		var script = document.createElement('script');
		script.id = 'gravatar-tooltips-assets';
		script.type = 'text/javascript';
		if(script.readyState){
			script.onreadystatechange = function() {
				if(script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			script.onload = function() { callback(); };
		}
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	};
	
	var requestData = function(username) {
		$.getJSON(config.jsonURL+username+'.json?callback=?', function(data) {
				gravatarData[username] = data.entry[0];
				injectData(username);
			});
	};
	
	var injectData = function(username) {
		var data = gravatarData[username], tooltip = $('#gravatar-tooltips-tip-'+username);
		if(!tooltip) return false;
		
		console.log(data);
		
		// Set the name
		$('#gravatar-tooltips-'+username+'-meta-field-name').text(data.name.formatted);
		
		// Set the location
		$('#gravatar-tooltips-'+username+'-meta-field-location').text(data.currentLocation);
		
		// Set the image
		$('#gravatar-tooltips-'+username+'-meta-field-image').attr('src', data.photos[0].value); // I guess we can trust to always return the thumbnail?
		
		// Remove the loading from the tooltip_image
		tooltip.removeClass('gravatar-tooltips-ui-loading');
		tooltip.find('.gravatar-tooltips-inner').animate({'opacity': 1}, 500);
	};
	
	var buildTooltip = function(username) {
		var str = '<div id="gravatar-tooltips-tip-'+username+'" class="gravatar-tooltips-tip">';
		str += '<div class="gravatar-tooltips-inner">';
			str += '<div class="gravatar-tooltips-image"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="gravatar-tooltips-meta-field gravatar-tooltips-meta-field-image" id="gravatar-tooltips-'+username+'-meta-field-image" /></div>';
			str += '<div class="gravatar-tooltips-meta">';
			
				str += '<span class="gravatar-tooltips-meta-line">';
					str += '<span class="gravatar-tooltips-meta-label">Name</span>';
					str += '<span class="gravatar-tooltips-meta-field gravatar-tooltips-meta-field-name" id="gravatar-tooltips-'+username+'-meta-field-name"></span>';
				str += '</span>';
				
				str += '<span class="gravatar-tooltips-meta-line">';
					str += '<span class="gravatar-tooltips-meta-label">Location</span>';
					str += '<span class="gravatar-tooltips-meta-field gravatar-tooltips-meta-field-location" id="gravatar-tooltips-'+username+'-meta-field-location"></span>';
				str += '</span>';
				
			str += '</div>';
		str += '</div>';
		str += '<div class="gravatar-tooltips-point"></div></div>';
		return $(str);
	};
	
	var init = function() {
		if($('#gravatar-tooltips-stylesheet').length == 0) $('<link id="gravatar-tooltips-stylesheet" rel="stylesheet" type="text/css" href="gravatar-tooltips.css?v=1" />').appendTo(document.head);
		
		$(document.body).on('click', config.matches, function() {
			var username = $(this).attr('href').split('/').pop();
			var tooltip = $('#gravatar-tooltips-tip-'+username);
			if(tooltip.length == 0) {
				tooltip = buildTooltip(username);
				tooltip.css('display', 'block').appendTo(document.body);
			} else {
				if(tooltip.hasClass('gravatar-tooltips-animated gravatar-tooltips-animated-fadeInUp')) {
					tooltip.removeClass('gravatar-tooltips-animated-fadeInUp').addClass('gravatar-tooltips-animated gravatar-tooltips-animated-fadeOutDown');
					setTimeout(function() {
						tooltip.css('display', 'none');
					}, 1000);
					return false;
				}
			}
			
			var tooltip_inner = tooltip.find('.gravatar-tooltips-inner'),
				tooltip_image = tooltip.find('.gravatar-tooltips-image');
			
			var measure = $(this).offset(), left = measure.left, top = measure.top - 105;
			
			tooltip.css({
				'left': left,
				'top': top,
				'opacity': 0
			});
			
			tooltip.removeClass('gravatar-tooltips-animated-fadeOutDown').addClass('gravatar-tooltips-animated gravatar-tooltips-animated-fadeInUp');
			
			if(!gravatarData[username]) {
				tooltip.addClass('gravatar-tooltips-ui-loading');
				tooltip_inner.css({'opacity': 0});
				requestData(username);
			} else {
				injectData(username);
			}
			
			return false;
		});
	};
	
	var assetsReady = function() {
		$ = jQuery.noConflict(true);
		$(document).ready(init);
	};

	load('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', assetsReady);
})();