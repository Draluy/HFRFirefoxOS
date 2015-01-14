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

				for (var i = 0; i < data.topics.length; i++) {
					var topic = data.topics[i];
					var domNode  = document.querySelector('a#topic_'+topic.id);

					domNode.addEventListener("click", 
					(function (topicId)
					{
						return function (){ HFRFOS.PostsController.displayPosts("#content", catId, topicId);};
					})(topic.id)
					, false);
				}

			},catId, subcatId);

		},"get","views/TopicsView.html");
		viewRequest.send(null);
	};
})();