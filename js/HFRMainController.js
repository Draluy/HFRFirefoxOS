HFRFOS.MainController = {};

(
function ()
{

	var processTemplate = function (categories)
	{
		var resultText = Mustache.render(this, categories);
		document.querySelector("#content").innerHTML = resultText;
	};

	var  getViewTemplate= function (data)
	{
		HFRFOS.DataRetriever.getCategories(processTemplate.bind(data));
	};

	var displayHomeView = function ()
	{
		var viewRequest = new HFRFOS.Common.Ajax(getViewTemplate,"get","views/HomeView.html");
		viewRequest.send(null);
	};

	window.onload = function ()
	{
		displayHomeView();
	};
}
)()