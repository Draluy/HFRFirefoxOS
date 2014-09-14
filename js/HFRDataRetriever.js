"use strict";
this.HFRFOS.DataRetriever = {};

(
function ()
{

/* To change from the java regexp to the javascript regexp follow these steps :
1- \\s becomes \s
2- \ becomes \/
3- \\ becomes \
4- .*? becomes [\s\S]*?
*/

	var BASE_URL = "http://forum.hardware.fr";
	var CATS_URL = BASE_URL + "/";
	var CATS_REGEXP = /<tr[\s\S]*?id=\"cat([0-9]+)\"[\s\S]*?<td[\s\S]*?class=\"catCase1\"[\s\S]*?<b><a\s*href=\"\/hfr\/([a-zA-Z0-9-]+)\/[\s\S]*?\"\s*class=\"cCatTopic\">\s*([\s\S]+?)<\/a><\/b>[\s\S]*?<\/tr>/g;

	var SUBCATS_URL = BASE_URL + "/message.php?&config=hfr.inc&cat={catid}";
	var SUBCATS_URL_REGEXP = /\{catid\}/;
	var SUBCATS_REGEXP = /<option\s*value=\"([0-9]+)\"\s*>(.+?)<\/option>/g;

	var TOPICS_URL          = BASE_URL + "/forum1.php?config=hfr.inc&cat={cat}&subcat={subcat}&page={page}&owntopic={type}";
    var ALL_TOPICS_URL      = BASE_URL + "/forum1f.php?config=hfr.inc&owntopic={type}";
    var TOPICS_REGEXP		= /(?:(?:<th\s*class=\"padding\"[\s\S]*?<a\s*href=\"\/forum1\.php\?config=hfr\.inc&amp;cat=([0-9]+)[\s\S]*?\"\s*class=\"cHeader\">([\s\S]*?)<\/a><\/th>)|(<tr\s*class=\"sujet\s*ligne_booleen[\s\S]*?(ligne_sticky)?\"[\s\S]*?<td[\s\S]*?class=\"sujetCase1[\s\S]*?><img\s*src=\"[\s\S]*?([A-Za-z0-9]+)\.gif\"[\s\S]*?<td[\s\S]*?class=\"sujetCase3\"[\s\S]*?>(<span\s*class=\"red\"\s*title=\"[\s\S]*?\">\[non lu\]<\/span>\s*)?[\s\S]*?<a[\s\S]*?class=\"cCatTopic\"\s*title=\"Sujet n°([0-9]+)\">(.+?)<\/a><\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase4\"[\s\S]*?(?:(?:<a[\s\S]*?class=\"cCatTopic\">(.+?)<\/a>)|&nbsp;)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase5\"[\s\S]*?(?:(?:<a\s*href=\"[\s\S]*?#t([0-9]+)\"><img[\s\S]*?src=\"[\s\S]*?([A-Za-z0-9]+)\.gif\"\s*title=\"[\s\S]*?\(p\.([0-9]+)\)\"[\s\S]*?\/><\/a>)|&nbsp;)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase6[\s\S]*?>(?:<a\s*rel=\"nofollow\"\s*href=\"\/profilebdd[\s\S]*?>)?(.+?)(?:<\/a>)?<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase7\"[\s\S]*?>(.+?)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase9[\s\S]*?>[\s\S]*?class=\"Tableau\">([0-9]+)-([0-9]+)-([0-9]+)[\s\S]*?([0-9]+):([0-9]+)<br \/><b>(.+?)<\/b>[\s\S]*?<\/td>[\s\S]*?<\/tr>))/gi;


    var topicTypes = 
    {
    	ALL 	: {value : 0, label:"all"},
        CYAN 	:{value :1,label: "cyan"},
        ROUGE  	:{value :2,label: "rouge"},
        FAVORI 	:{value :3, label:"favori"}
    }

	var topicStatus =
	{
		NEW_CYAN 	:0 ,
		NEW_ROUGE	:1 ,
		NEW_FAVORI	:2 ,
		NO_NEW_POST	:3 ,
		NEW_MP 		:4 ,
		NO_NEW_MP	:5 ,
		LOCKED		:6 ,
		NONE 		:7 
	};


    function Category (id, shortname, name)
    {
    	this.id = id;
    	this.shortname = shortname;
    	this.name = name;
    }

    function Subcategory (id, name)
    {
    	this.id = id;
    	this.name = name;
    }

    function Topic (id, name, status, author, lastReadPage, lastReadPost, nbPosts, nbPages, lastPostDate, lastPostPseudo, sticky, unread, category)
    {
    	this.id = id;
    	this.name = typeof name !== 'undefined' ? name : 0;
		this.status = typeof status !== 'undefined' ?  status: topicStatus.NONE;
		this.author = typeof author !== 'undefined' ? author : 'undefined' ;
		this.lastReadPage = typeof lastReadPage !== 'undefined' ? lastReadPage : -1;
		this.lastReadPost = typeof lastReadPost !== 'undefined' ? lastReadPost : -1;
		this.nbPosts = typeof nbPosts !== 'undefined' ? nbPosts : -1;
		this.nbPages = typeof nbPages !== 'undefined' ? nbPages : -1;
		this.lastPostDate = typeof lastPostDate !== 'undefined' ? lastPostDate : null;
		this.lastPostPseudo = typeof lastPostPseudo !== 'undefined' ? lastPostPseudo : null;
		this.sticky = typeof sticky !== 'undefined' ? sticky : false;
		this.unread = typeof unread !== 'undefined' ? unread : false;
		this.category = typeof category !== 'undefined' ? category : null;
		this.emailNotification = false;
    }

	HFRFOS.DataRetriever.getCategories = function (callback) {

		var reqListener = function (data) {
			var catArray;
			var returnedCats = [];
			while(catArray = CATS_REGEXP.exec(data))
			{
				var category = new Category(catArray[1], catArray[2],HFRFOS.Common.Html.decodeEntities(catArray[3]));
				returnedCats.push(category);
			}
			callback({"categories": returnedCats});
		}


		var catsRequest = new HFRFOS.Common.Ajax(reqListener,"get",CATS_URL);
		catsRequest.send(null);
	};

	HFRFOS.DataRetriever.getSubCategories = function (callback, catId) {

		var reqListener = function (data) {
			var subcatArray;
			var returnedSubcats = [];
			while(subcatArray = SUBCATS_REGEXP.exec(data))
			{
				var subcategory = new Subcategory(subcatArray[1], HFRFOS.Common.Html.decodeEntities(subcatArray[2]));
				returnedSubcats.push(subcategory);
			}
			callback({"catname": catId, "subcategories": returnedSubcats});
		}

		var subcatsUrl = SUBCATS_URL.replace(SUBCATS_URL_REGEXP, catId);

		var subcatsRequest = new HFRFOS.Common.Ajax(reqListener,"get",subcatsUrl);
		subcatsRequest.send(null);
	};

	var getStatusFromImgName = function (imgName)
    {
        if (imgName == null)
        {
            	return topicStatus.NONE;
        }
        else if (imgName == "flag1")
        {
                return topicStatus.NEW_CYAN;
        }
        else if (imgName == "flag0")
        {
                return topicStatus.NEW_ROUGE;
        }
        else if (imgName == "favoris")
        {
                return topicStatus.NEW_FAVORI;
        }
        else if (imgName == "closed")
        {
                return topicStatus.NO_NEW_POST;
        }
        else if (imgName == "closedbp")
        {
                return topicStatus.NEW_MP;
        }
        else if (imgName == "closedp")
        {
                return topicStatus.NO_NEW_MP;
        }              
        else
        {
                return topicStatus.NONE;        
        }
    }


	HFRFOS.DataRetriever.getTopics = function (callback, catId, subcat, page, owntopic)
	{
		subcat = typeof subcat !== 'undefined' ? subcat : 0;
   		page = typeof page !== 'undefined' ? page : 0;
   		owntopic = typeof owntopic !== 'undefined' ? owntopic : 0;

   		var currentCat = new Category(catId);

		var reqListener = function (data) {
			var topicsArray;
			var returnedTopics = [];
			while(topicsArray = TOPICS_REGEXP.exec(data))
			{
				if (topicsArray[1] != null)
				{
					currentCat =  new Category(topicsArray[1],'',topicsArray[2]);
				}
				else
				{
					
					var isLocked = /lock\.gif/.test(topicsArray[3]);

					var status = isLocked ? topicStatus.LOCKED : getStatusFromImgName(topicsArray[11] != null ? topicsArray[11] : topicsArray[5]);
                    var nbPages = topicsArray[9] != null ? topicsArray[9] : 1;
                    var lastReadPage = status == topicStatus.NEW_MP ? nbPages : (topicsArray[12]!= null ? topicsArray[12] : -1);

					var topicToAdd = new Topic(topicsArray[7],
						topicsArray[8],
						status,
						topicsArray[13], 
						lastReadPage,
						topicsArray[10] != null ? topicsArray[10] : -1,
						topicsArray[14],
						nbPages,
						new Date(topicsArray[17], topicsArray[16] - 1, topicsArray[15], topicsArray[18], topicsArray[19], 0, 0),
						topicsArray[20],
                        topicsArray[4] != null,
                        topicsArray[6] != null,
                        currentCat);

					returnedTopics.push(topicToAdd);
				}
			}
			callback({'catid':catId,'topics':returnedTopics});
		}

		var topicsUrl = TOPICS_URL.replace(/\{cat\}/, catId).replace(/\{subcat\}/, subcat).replace(/\{page\}/, page).replace(/\{type\}/, owntopic);

		var topicsRequest = new HFRFOS.Common.Ajax(reqListener,"get",topicsUrl);
		topicsRequest.send(null);
	}

	HFRFOS.DataRetriever.getAllTopics = function (topicType)
	{

		var reqListener = function (data) {
			var subcatArray;
			var returnedSubcats = [];
			while(subcatArray = TOPICS_REGEXP.exec(data))
			{
				console.log(subcatArray);
			}
			
		}

		var topicsUrl = ALL_TOPICS_URL.replace(/\{type\}/, topicType);

		var topicsRequest = new HFRFOS.Common.Ajax(reqListener,"get",topicsUrl);
		topicsRequest.send(null);
	}

}
)();