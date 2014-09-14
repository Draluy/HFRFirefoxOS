this.HFRFOS.TopicsController = {};

(function ()
{

	HFRFOS.TopicsController.displayTopics = function (idToDisplayTo, catId, subcatId)
	{
		var viewRequest = new HFRFOS.Common.Ajax(function (templateData){
			HFRFOS.DataRetriever.getTopics (function (data){
				console.log(data);
				console.log(templateData);
				var resultText = Mustache.render(templateData, data);
				document.querySelector(idToDisplayTo).innerHTML = resultText;
			},catId, subcatId);

		},"get","views/TopicsView.html");
		viewRequest.send(null);
	};
})();