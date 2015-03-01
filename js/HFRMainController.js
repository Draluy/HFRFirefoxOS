"use strict";
this.HFRFOS.MainController = {};

(
function ()
{

	var processTemplate = function (data)
	{
		var template = document.querySelector("#drawer").innerHTML;
		var rendered = Mustache.render(template, data);
		document.querySelector("#drawer").innerHTML = rendered;	

		//Add event listeners
		for (var i = 0; i < data.categories.length; i++) {
			var cat = data.categories[i];

			var domNode  = document.querySelector('a#category_'+cat.id);
			domNode.addEventListener("click", 
				(function (catId)
				{
					return function (){
						HFRFOS.TopicsController.displayTopics(catId);
					};
				})(cat.id)
				, false);
		};

	};

	HFRFOS.MainController.displayHomeView = function ()
	{
		
		HFRFOS.DataRetriever.getCategories(processTemplate);
	}

	window.onload = function ()
	{
		HFRFOS.MainController.displayHomeView();
	};
}
)();