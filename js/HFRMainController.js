"use strict";
this.HFRFOS.MainController = {};

(
function ()
{

	var processTemplate = function (data)
	{
		var resultText = Mustache.render(this, data);
		document.querySelector("#content").innerHTML = resultText;

		//Add event listeners
		for (var i = 0; i < data.categories.length; i++) {
			var cat = data.categories[i];
			var domNode  = document.querySelector('a#subcategory_'+cat.id);
			/*domNode.addEventListener("click", 
				(function (catId)
				{
					return function (){ HFRFOS.SubCategoriesController.displaySubCats(catId, "#content");};
				})(cat.id)
				, false);*/

			var domNode  = document.querySelector('a#category_'+cat.id);
			domNode.addEventListener("click", 
				(function (catId)
				{
					return function (){ HFRFOS.TopicsController.displayTopics( "#content", catId);};
				})(cat.id)
				, false);
		};
		
	};

	var  getViewTemplate= function (data)
	{
		HFRFOS.DataRetriever.getCategories(processTemplate.bind(data));
	};

	HFRFOS.MainController.displayHomeView = function ()
	{
		var viewRequest = new HFRFOS.Common.Ajax(getViewTemplate,"get","views/HomeView.html");
		viewRequest.send(null);
	};

	window.onload = function ()
	{
		HFRFOS.MainController.displayHomeView();
	};
}
)();