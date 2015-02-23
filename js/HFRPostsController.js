this.HFRFOS.PostsController = {};

(function ()
{

	HFRFOS.PostsController.displayPosts = function (catId, topicId, page)
	{
		HFRFOS.DataRetriever.getPosts (function (data){
			var template = document.querySelector("#posts").innerHTML;
			var resultText = Mustache.render(template, data);
			document.querySelector("#posts").innerHTML = resultText;

			document.querySelector("#posts").className = "current";
		},catId, topicId, page);
	};
})();