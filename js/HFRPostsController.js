this.HFRFOS.PostsController = {};

(function ()
{

	HFRFOS.PostsController.displayPosts = function (catId, topicId, page)
	{
		HFRFOS.DataRetriever.getPosts (function (data){
			var postsRequest = new HFRFOS.Common.Ajax(function (template){

				var resultText = Mustache.render(template, data);
				var postsSection = document.querySelector("#posts");
				postsSection.innerHTML = resultText;

				postsSection.classList.remove("right");
				postsSection.classList.add("current");

					//Add listener to the back button	
				var postsToTopics = function ()
				{
					postsSection.classList.add("right");
					postsSection.classList.remove("current");
				}
				document.querySelector("#posts-button-back").addEventListener("click",postsToTopics, false);
			},"get","views/PostsView.html");
			postsRequest.send(null);

		},catId, topicId, page);
	};
})();