this.HFRFOS.SubCategoriesController = {};

(function ()
{

	HFRFOS.SubCategoriesController.displaySubCats = function (catId, idToDisplayTo)
	{
		var viewRequest = new HFRFOS.Common.Ajax(function (templateData){
			HFRFOS.DataRetriever.getSubCategories (function (data){
				console.log(data);
				console.log(templateData);
				var resultText = Mustache.render(templateData, data);
				document.querySelector(idToDisplayTo).innerHTML = resultText;

				//add listeners
				var domNode  = document.querySelector('a#home');
				domNode.addEventListener("click", function ()
				{
					HFRFOS.MainController.displayHomeView();
				});

				for (var i = 0; i < data.subcategories.length; i++) {
					var subcat = data.subcategories[i];

					domNode  = document.querySelector('a#subcategory_'+subcat.id);
					domNode.addEventListener("click", (function (subcatId)
					{
						return function (){ HFRFOS.TopicsController.displayTopics("#content", catId, subcatId);};
					})(subcat.id)
					,false);
				}

			},catId);

		},"get","views/SubCategoriesView.html");
		viewRequest.send(null);
	};
})();