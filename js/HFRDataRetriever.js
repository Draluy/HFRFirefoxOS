"use strict";
this.HFRFOS.DataRetriever = {};

(
function ()
{

/* To change from the java regexp to the javascript regexp follow these steps :
1- \\ becomes \
2- \ becomes \/ where needed
3- .*? becomes [\s\S]*?
*/

	var BASE_URL = "http://forum.hardware.fr";
	var CATS_URL = BASE_URL + "/";
	var CATS_REGEXP = /<tr[\s\S]*?id=\"cat([0-9]+)\"[\s\S]*?<td[\s\S]*?class=\"catCase1\"[\s\S]*?<b><a\s*href=\"\/hfr\/([a-zA-Z0-9-]+)\/[\s\S]*?\"\s*class=\"cCatTopic\">\s*([\s\S]+?)<\/a><\/b>[\s\S]*?<\/tr>/gi;

	var SUBCATS_URL = BASE_URL + "/message.php?&config=hfr.inc&cat={catid}";
	var SUBCATS_URL_REGEXP = /\{catid\}/;
	var SUBCATS_REGEXP = /<option\s*value=\"([0-9]+)\"\s*>(.+?)<\/option>/gi;

	var TOPICS_URL          = BASE_URL + "/forum1.php?config=hfr.inc&cat={cat}&subcat={subcat}&page={page}&owntopic={type}";
    var ALL_TOPICS_URL      = BASE_URL + "/forum1f.php?config=hfr.inc&owntopic={type}";
    var TOPICS_REGEXP		= /(?:(?:<th\s*class=\"padding\"[\s\S]*?<a\s*href=\"\/forum1\.php\?config=hfr\.inc&amp;cat=([0-9]+)[\s\S]*?\"\s*class=\"cHeader\">([\s\S]*?)<\/a><\/th>)|(<tr\s*class=\"sujet\s*ligne_booleen[\s\S]*?(ligne_sticky)?\"[\s\S]*?<td[\s\S]*?class=\"sujetCase1[\s\S]*?><img\s*src=\"[\s\S]*?([A-Za-z0-9]+)\.gif\"[\s\S]*?<td[\s\S]*?class=\"sujetCase3\"[\s\S]*?>(<span\s*class=\"red\"\s*title=\"[\s\S]*?\">\[non lu\]<\/span>\s*)?[\s\S]*?<a[\s\S]*?class=\"cCatTopic\"\s*title=\"Sujet n°([0-9]+)\">(.+?)<\/a><\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase4\"[\s\S]*?(?:(?:<a[\s\S]*?class=\"cCatTopic\">(.+?)<\/a>)|&nbsp;)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase5\"[\s\S]*?(?:(?:<a\s*href=\"[\s\S]*?#t([0-9]+)\"><img[\s\S]*?src=\"[\s\S]*?([A-Za-z0-9]+)\.gif\"\s*title=\"[\s\S]*?\(p\.([0-9]+)\)\"[\s\S]*?\/><\/a>)|&nbsp;)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase6[\s\S]*?>(?:<a\s*rel=\"nofollow\"\s*href=\"\/profilebdd[\s\S]*?>)?(.+?)(?:<\/a>)?<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase7\"[\s\S]*?>(.+?)<\/td>[\s\S]*?<td[\s\S]*?class=\"sujetCase9[\s\S]*?>[\s\S]*?class=\"Tableau\">([0-9]+)-([0-9]+)-([0-9]+)[\s\S]*?([0-9]+):([0-9]+)<br \/><b>(.+?)<\/b>[\s\S]*?<\/td>[\s\S]*?<\/tr>))/gi;
    
    var POSTS_URL           = BASE_URL + "/forum2.php?config=hfr.inc&cat={cat}&post={topic}&page={page}";
    var POSTS_REGEXP		= /(<table\s*cellspacing[\s\S]*?class=\"([a-z]+)\">[\s\S]*?<tr[\s\S]*?class=\"message[\s\S]*?<a[\s\S]*?href=\"#t([0-9]+)\"[\s\S]*?<b[\s\S]*?class=\"s2\">(?:<a[\s\S]*?>)?([\s\S]*?)(?:<\/a>)?<\/b>[\s\S]*?(?:(?:<div\s*class=\"avatar_center\"[\s\S]*?><img src=\"([\s\S]*?)\"\s*alt=\"[\s\S]*?\"\s*\/><\/div>)|<\/td>)[\s\S]*?<div[\s\S]*?class=\"left\">Posté le ([0-9]+)-([0-9]+)-([0-9]+)[\s\S]*?([0-9]+):([0-9]+):([0-9]+)[\s\S]*?<div[\s\S]*?id=\"para[0-9]+\">([\s\S]*?)<div style=\"clear: both;\">\s*<\/div><\/p>(?:<div\s*class=\"edited\">)?(?:<a[\s\S]*?>Message cité ([0-9]+) fois<\/a>)?(?:<br\s*\/>Message édité par [\s\S]*? le ([0-9]+)-([0-9]+)-([0-9]+)[\s\S]*?([0-9]+):([0-9]+):([0-9]+)<\/div>)?[\s\S]*?<\/div><\/td><\/tr><\/table>)/gi;

    HFRFOS.DataRetriever.topicTypes = 
    {
    	ALL 	: {value : 0, label:"all"},
        CYAN 	:{value :1,label: "cyan"},
        ROUGE  	:{value :2,label: "rouge"},
        FAVORI 	:{value :3, label:"favori"}
    }

	HFRFOS.DataRetriever.topicStatus =
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

   	function Post(id, content, pseudo, avatarUrl, date, lastEdition, nbCitations, isMine, isModo,  isDeleted,topic)
    {
            this.id = id;
            this.content = content;
            this.pseudo = typeof pseudo !== 'undefined' ? pseudo : null;
            this.avatarUrl = typeof avatarUrl !== 'undefined' ? avatarUrl : null;
            this.date = typeof date !== 'undefined' ? date : null;
            this.lastEdition = typeof lastEdition !== 'undefined' ? lastEdition : null;
            this.nbCitations = typeof nbCitations !== 'undefined' ? nbCitations : 0;
            this.isMine = typeof isMine !== 'undefined' ? isMine : false;
            this.isModo = typeof isModo !== 'undefined' ? isModo : false;
            this.topic = typeof topic !== 'undefined' ? topic : null;
            this.isDeleted = typeof isDeleted !== 'undefined' ? isDeleted : false;
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
        if (imgName == "flag1")
        {
                return HFRFOS.DataRetriever.topicStatus.NEW_CYAN;
        }
        else if (imgName == "flag0")
        {
                return HFRFOS.DataRetriever.topicStatus.NEW_ROUGE;
        }
        else if (imgName == "favoris")
        {
                return HFRFOS.DataRetriever.topicStatus.NEW_FAVORI;
        }
        else if (imgName == "closed")
        {
                return HFRFOS.DataRetriever.topicStatus.NO_NEW_POST;
        }
        else if (imgName == "closedbp")
        {
                return HFRFOS.DataRetriever.topicStatus.NEW_MP;
        }
        else if (imgName == "closedp")
        {
                return HFRFOS.DataRetriever.topicStatus.NO_NEW_MP;
        }              
       
        return HFRFOS.DataRetriever.topicStatus.NONE;        
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

					var status = isLocked ? HFRFOS.DataRetriever.topicStatus.LOCKED : getStatusFromImgName(topicsArray[11] != null ? topicsArray[11] : topicsArray[5]);
                    var nbPages = topicsArray[9] != null ? topicsArray[9] : 1;
                    var lastReadPage = status == HFRFOS.DataRetriever.topicStatus.NEW_MP ? nbPages : (topicsArray[12]!= null ? topicsArray[12] : -1);

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

	HFRFOS.DataRetriever.getPosts = function (callback, catId, topicId, page)
	{
		var reqListener = function (data) {
			var postsArray;
			var returnedPosts = [];
			while(postsArray = POSTS_REGEXP.exec(data))
			{
                var isMine = /edit\-in\.gif/.test(postsArray[1])
                var isModo = /messageModo/.test(postsArray[1])
                var isDeleted = "messagetabledel" == postsArray[2];
                var postContent = postsArray[12];

				var postToAdd = new Post(
					postsArray[3],
					postContent,
					postsArray[4],
					postsArray[5],
					new Date(postsArray[8],postsArray[7]-1,postsArray[6],postsArray[9],postsArray[10],postsArray[11]),
					postsArray[14] != null?new Date(postsArray[16],postsArray[15]-1,postsArray[14],postsArray[17],postsArray[18],postsArray[19]):null,
					postsArray[13] != null ? postsArray[13] : 0,
                    isMine,
                    isModo,
                    isDeleted,
                    topicId
				);
				returnedPosts.push(postToAdd);
			}
			callback({'catid':catId,'posts':returnedPosts});
		}

		page = typeof page !== 'undefined' ? page : 0;
		var postsUrl = POSTS_URL.replace(/\{cat\}/, catId).replace(/\{topic\}/, topicId).replace(/\{page\}/, page);
		var postsRequest = new HFRFOS.Common.Ajax(reqListener,"get",postsUrl);
		postsRequest.send(null);
	}

}
)();