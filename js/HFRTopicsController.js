this.HFRFOS.TopicsController = {};

(function ()
{

	HFRFOS.TopicsController.displayTopics = function (catId, idToDisplayTo)
	{
		var viewRequest = new HFRFOS.Common.Ajax(function (templateData){
			HFRFOS.DataRetriever.getTopics (function (data){
				console.log(data);
				console.log(templateData);
				var resultText = Mustache.render(templateData, data);
				document.querySelector(idToDisplayTo).innerHTML = resultText;
			},catId);

		},"get","views/TopicsView.html");
		viewRequest.send(null);
	};
})();