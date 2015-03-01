this.HFRFOS.TopicsController = {};

(function ()
{
	HFRFOS.TopicsController.displayTopics = function (catId, subcatId)
	{
		HFRFOS.DataRetriever.getTopics (function (data){

			var section = document.querySelector("#topics");

			var topicsRequest = new HFRFOS.Common.Ajax(function (template){
				var resultText = Mustache.render(template, data);
				section.innerHTML = resultText;

				for (var i = 0; i < data.topics.length; i++) {
					var topic = data.topics[i];
					var domNode  = document.querySelector('a#topic_'+topic.id);

					domNode.addEventListener("click", 
					(function (topicId)
					{
						return function (){ HFRFOS.PostsController.displayPosts(catId, topicId);};
					})(topic.id)
					, false);
				}
				document.querySelector("#topics").classList.remove("right");
				document.querySelector("#topics").classList.add("current");

				//Add listener to the back button	
				var topicsToCategories = function ()
				{
					document.querySelector("#topics").classList.add("right");
					document.querySelector("#topics").classList.remove("current");
				}
				document.querySelector("#topics-button-back").addEventListener("click",topicsToCategories, false);

			},"get","views/TopicsView.html");
			topicsRequest.send(null);

		},catId, subcatId);
	}

})();