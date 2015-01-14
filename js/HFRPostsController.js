this.HFRFOS.PostsController = {};

(function ()
{

	HFRFOS.PostsController.displayPosts = function (idToDisplayTo, catId, topicId, page)
	{
		var viewRequest = new HFRFOS.Common.Ajax(function (templateData){
			HFRFOS.DataRetriever.getPosts (function (data){
				var resultText = Mustache.render(templateData, data);
				document.querySelector(idToDisplayTo).innerHTML = resultText;
			},catId, topicId, page);

		},"get","views/PostsView.html");
		viewRequest.send(null);
	};
})();