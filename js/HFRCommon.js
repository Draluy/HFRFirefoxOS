"use strict";
this.HFRFOS = {};
this.HFRFOS.Common = {};
this.HFRFOS.Common.Html = {};
this.HFRFOS.Common.Ajax = {};

(
	function (){

	HFRFOS.Common.Html.decodeEntities = (function() {
	  	// this prevents any overhead from creating the object each time
	  	var element = document.createElement('div');

	  	function decodeHTMLEntities (str)
	  	{
	    	if(str && typeof str === 'string')
	    	{
				// strip script/html tags
				str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
				str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
				element.innerHTML = str;
				str = element.textContent;
				element.textContent = '';
	    	}

	    	return str;
	  	}
		return decodeHTMLEntities;
	})();

	function createBoundedWrapper(object, method) {
	  return function() {
	    return method.apply(object, arguments);
	  };
	}

	function ajaxCallback  ()
	{
	    if ( this.request.readyState === 4)
	    {
	      	if (this.request.status === 200 || this.request.status === 0)
	      	{
    			this.internalCallback(this.request.responseText);
	      	}
	    }
	};

	HFRFOS.Common.Ajax = function (callback, method, url)
	{
		this.method = method;
		this.url = url;
		this.internalCallback = callback;
		this.request = new XMLHttpRequest({ mozSystem: true });
		this.request.onload = ajaxCallback.bind(this);
		
	};

	HFRFOS.Common.Ajax.prototype.send = function (data)
	{
			this.request.open(this.method, this.url, true);
			this.request.responseType = "text";
			this.request.send(data);
	};


})();