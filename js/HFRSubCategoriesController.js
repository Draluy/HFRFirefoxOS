this.HFRFOS.SubCategoriesController = {};

(function ()
{

	HFRFOS.SubCategoriesController.displaySubCats = function (catId, idToDisplayTo)
	{
		var viewRequest = new HFRFOS.Common.Ajax(function (templateData){
			HFRFOS.DataRetriever.getSubCategories (catId, function (data){
				console.log(data);
				console.log(templateData);
				var resultText = Mustache.render(templateData, data);
				document.querySelector(idToDisplayTo).innerHTML = resultText;
			});

		},"get","views/SubCategoriesView.html");
		viewRequest.send(null);
	};
})();