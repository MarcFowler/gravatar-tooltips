(function() {
	var $, config;
	
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
	
	var init = function() {
		$(document.body).on('click', config.matches, function() {
			alert('clicked');
			return false;
		});
	}
	
	var assetsReady = function() {
		$ = jQuery.noConflict(true);
		$(document).ready(init);
	}

	load('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', assetsReady);
})();