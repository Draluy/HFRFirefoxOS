HFRFOS.DataRetriever = {};

(
function ()
{
	var BASE_URL = "http://forum.hardware.fr";
	var CATS_URL = BASE_URL + "/";
	var CATS_REGEXP = /<tr.*?id=\"cat([0-9]+)\".*?<td.*?class=\"catCase1\".*?<b><a\s*href=\"\/hfr\/([a-zA-Z0-9-]+)\/.*?\"\s*class=\"cCatTopic\">\s*(.+?)<\/a><\/b>.*?<\/tr>/g;


	HFRFOS.DataRetriever.getCategories = function (callback) {

		var reqListener = function (data) {
			var catArray;
			var returnedCats = [];
			while(catArray = CATS_REGEXP.exec(data))
			{
				var category = {
					id : catArray[1],
					shortname : catArray[2],
					name : catArray[3]
				};
				returnedCats.push(category);
			}
			callback({"categories": returnedCats});
		}


		var catsRequest = new HFRFOS.Common.Ajax(reqListener,"get",CATS_URL);
		catsRequest.send(null);
	};

}
)();