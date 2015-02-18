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
					return function (){ HFRFOS.PostsController.displayPosts("#content", catId, topicId);};
				})(topic.id)
				, false);
			}

			//shift the section in place
			/*document.querySelector("#drawer").classList.remove("current");
			document.querySelector("#drawer").classList.add("left");*/
			document.querySelector("#topics").className = "current";

		},catId, subcatId);
	}
	
})();