"use strict";
this.HFRFOS.DataRetriever = {};

(
function ()
{
	var BASE_URL = "http://forum.hardware.fr";
	var CATS_URL = BASE_URL + "/";
	var CATS_REGEXP = /<tr.*?id=\"cat([0-9]+)\".*?<td.*?class=\"catCase1\".*?<b><a\s*href=\"\/hfr\/([a-zA-Z0-9-]+)\/.*?\"\s*class=\"cCatTopic\">\s*(.+?)<\/a><\/b>.*?<\/tr>/g;

	var SUBCATS_URL = BASE_URL + "/message.php?&config=hfr.inc&cat={catid}";
	var SUBCATS_URL_REGEXP = /\{catid\}/;
	var SUBCATS_REGEXP = /<option\s*value=\"([0-9]+)\"\s*>(.+?)<\/option>/g;

	HFRFOS.DataRetriever.getCategories = function (callback) {

		var reqListener = function (data) {
			var catArray;
			var returnedCats = [];
			while(catArray = CATS_REGEXP.exec(data))
			{
				var category = {
					id : catArray[1],
					shortname : catArray[2],
					name : HFRFOS.Common.Html.decodeEntities(catArray[3])
				};
				returnedCats.push(category);
			}
			callback({"categories": returnedCats});
		}


		var catsRequest = new HFRFOS.Common.Ajax(reqListener,"get",CATS_URL);
		catsRequest.send(null);
	};

	HFRFOS.DataRetriever.getSubCategories = function (catId, callback) {

		var reqListener = function (data) {
			var subcatArray;
			var returnedSubcats = [];
			while(subcatArray = SUBCATS_REGEXP.exec(data))
			{
				var subcategory = {
					id : subcatArray[1],
					name : HFRFOS.Common.Html.decodeEntities(subcatArray[2])
				};
				returnedSubcats.push(subcategory);
			}
			callback({"catname": catId, "subcategories": returnedSubcats});
		}

		var subcatsUrl = SUBCATS_URL.replace(SUBCATS_URL_REGEXP, catId);

		var subcatsRequest = new HFRFOS.Common.Ajax(reqListener,"get",subcatsUrl);
		subcatsRequest.send(null);
	};

}
)();