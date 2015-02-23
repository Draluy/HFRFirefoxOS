this.HFRFOS.TopicsController = {};

(function ()
{

	HFRFOS.TopicsController.displayTopics = function (catId, subcatId)
	{
		HFRFOS.DataRetriever.getTopics (function (data){
			var template = document.querySelector("#topics").innerHTML;
			var resultText = Mustache.render(template, data);
			document.querySelector("#topics").innerHTML = resultText;

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

		},catId, subcatId);
	}
	
})();