"use strict";
this.HFRFOS = {};
this.HFRFOS.Common = {};

(
	function (){

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