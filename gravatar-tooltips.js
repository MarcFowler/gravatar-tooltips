(function() {
	var $, config, gravatarData = {};
	
	config = {
		'matches': '[href^="http://gravatar.com/"], [href^="https://gravatar.com/"]'
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
	
	var requestGravatarData = function(username) {
		//
	};
	
	var buildTooltip = function(username) {
		var el = $('<div id="gravatar-tooltips-tip-'+username+'" class="gravatar-tooltips-tip"><div class="gravatar-tooltips-inner"><div class="gravatar-tooltips-image"></div><div class="gravatar-tooltips-meta"></div></div><div class="gravatar-tooltips-point"></div></div>');
		return el;
	}
	
	var init = function() {
		if($('#gravatar-tooltips-stylesheet').length == 0) $('<link id="gravatar-tooltips-stylesheet" rel="stylesheet" type="text/css" href="gravatar-tooltips.css?v=1" />').appendTo(document.head);
		
		$(document.body).on('click', config.matches, function() {
			var username = $(this).attr('href').split('/').pop();
			var tooltip = $('#gravatar-tooltips-tip-'+username);
			if(tooltip.length == 0) {
				tooltip = buildTooltip(username);
				tooltip.appendTo(document.body);
			}
			
			var measure = $(this).offset(), left = measure.left, top = measure.top - 105;
			
			tooltip.css({
				'left': left,
				'top': top,
				'opacity': 0
			});
			
			tooltip.removeClass('gravatar-tooltips-animated-fadeOutDown').addClass('gravatar-tooltips-animated gravatar-tooltips-animated-fadeInUp');
			
			if(!gravatarData[username]) tooltip.addClass('gravatar-tooltips-ui-loading');
			
			return false;
		});
	}
	
	var assetsReady = function() {
		$ = jQuery.noConflict(true);
		$(document).ready(init);
	}

	load('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', assetsReady);
})();