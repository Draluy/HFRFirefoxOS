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
				domNode.addEventListener("click", window.onload);
			},catId);

		},"get","views/SubCategoriesView.html");
		viewRequest.send(null);
	};
})();