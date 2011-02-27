function ljaddChangeLocation(target, add, notify) {
	if (typeof target == "string") {
		if (target.search(/http:\/\/.+?\.livejournal.com/i) == -1) {
			return;
		}
		var ljaddNoStyleLight = new RegExp(
			"http://www\\.livejournal\\.com/mobile/" +
			"|(?:" +
				"http://(?!www\\.|my\\.)" +
					"(?:" +
						"(?:syndicated|community|users)\\.livejournal\\.com/\\w+/" +
						"|[\\w-]+\\.livejournal\\.com/" +
					")" +
				"|http://" +
					"www\\.livejournal\\.com/(?:syndicated|community|users)/[\\w-]+/" +
			")" +
						"(?:$|\\?|#|calendar\\b|\\d\\d\\d\\d/(?:\\d\\d/\\d\\d/)?|friends\\b)"
		, "i");
		var ljaddNoStyleMine = new RegExp(
			"http://www\\.livejournal\\.com/mobile/" +
			"|(?:" +
				localStorage.getItem("livejournal_addons.ljaddMainURL") +
				"|www\\.livejournal\\.com/(?!(?:syndicated|community|users)/[\\w-]+/)" +
				"|/profile\\b" +
			")"
			, "i");
		var ljaddToLight = new RegExp(
			"(?:" +
				"(?:syndicated|community|users)\\.livejournal\\.com/\\w+/" +
				"|www\\.livejournal\\.com/(?:syndicated|community|users)/[\\w-]+/" +
				"|[\\w-]+\\.livejournal\\.com/" +
			")" +
				"(?:\\d+\\.html\\b|tag/)"
		, "i");

		var searchDataOld, searchDataNew;
		searchDataOld = searchDataNew = target.replace(/(?:#.*)?$/, "").replace(/^.+?(\?.*)?$/, "$1");
		if (add == 'light&tree' || add.indexOf("view=flat") > -1) {
			searchDataNew =
				searchDataNew
				.replace(/(\?|&)thread=\w*(?:&|$)/gi, "$1")
				.replace(/(\?|&)mode=reply(?:&|$)/gi, "$1")
				.replace(/(\?|&)view=\w*(?:&|$)/gi, "$1")
				.replace(/(\?|&)page=\d*(?:&|$)/gi, "$1")
				.replace(/[\?&]+$/, "");
			if (add == 'light&tree') {
				add = 'light';
			}
		}
		if (add.search(/light|style=mine/i) > -1 || !add) {
			searchDataNew = searchDataNew.replace(/(\?|&)(?:style=mine|format=light|usescheme=\w*)(?:&|$)/gi, "$1").replace(/[\?&]+$/, "");
			if (add.indexOf("light") > -1 ) {
				if (target.search(ljaddNoStyleLight) > -1) {
					if (add.indexOf("lightOrMine") > -1) {
						add = add.replace(/(&)?lightOrMine(?=&|$)/gi, "$1" + "style=mine");
					}
					else {
						add = add.replace(/(&)?light(?:&|$)/gi, "$1").replace(/&+$/, "");
					}
				}
				else if (add.indexOf("lightOrMine") > -1) {
					add = add.replace(/(&)?lightOrMine(?=&|$)/gi, "$1" + "light");
				}
			}
			if (add.indexOf("style=mine") > -1 ) {
				if (target.search(ljaddNoStyleMine) > -1) {
					add = add.replace(/(&)?style=mine(?:&|$)/gi, "$1").replace(/&+$/, "");
				}
			}
		}
		if (add.indexOf("light") > -1 ) {
			if (target.search(ljaddToLight) > -1) {
				add = add.replace(/light/i, "format=light");
			}
			else if (target.search(ljaddToLight) == -1) {
				add = add.replace(/light/i, "usescheme=lynx");
			}
		}
		if (searchDataNew) {
			searchDataNew = (searchDataNew + (add? ("&" + add) : ""));
		}
		else {
			searchDataNew = (add? ("?" + add) : "");
		}
		if (searchDataOld) {
			return target.replace(searchDataOld, searchDataNew);
		}
		else {
			return target.replace(/(#|$)/, searchDataNew + "$1");
		}
	}
}

/*************************************************************************************************/
var ljaddNotificationListenerPosts = function() {
    var ljaddNotificationFpOpen = Number(localStorage["ljaddNotificationFpOpen"]);
    if(ljaddNotificationFpOpen == 0) {
        var fpURL = localStorage["livejournal_addons.ljaddFrPgURL"];
        chrome.windows.getCurrent(function(w){
            chrome.tabs.getSelected(w.id, function(tab){
                if(tab.url == "about:blank" && tab.status != "loading")
                {
                    chrome.tabs.update(tab.id, {url: fpURL});
                }
                else
                {
                    chrome.tabs.create({url: fpURL});
                }
            });
        });
    }
    else if (ljaddNotificationFpOpen == 1) {
        window.setTimeout("ljaddAllNewPosts('read')", 1 * 100);
    }
    else {
        window.setTimeout("ljaddAllNewPosts('reply')", 1 * 100);
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////

/*************************************************************************************************/
function ljaddMarkAllPostsAsRead(limit) {
	var posts;
	if (localStorage["ljaddFriendsPageNewsReverseOpt"] == "true") {
		posts = localStorage["ljaddFriendsPageLinks"].split("\x0c").reverse();
	}
	else {
		posts = localStorage["ljaddFriendsPageLinks"].split("\x0c");
	}
	var newsLimit;
	if (localStorage["ljaddFriendsPageNewsOpt"] == "true" && limit) {
		newsLimit = Number(localStorage["ljaddFriendsPageNews"]);
	}
	else {
		newsLimit = posts.length;
	}
	for (var i=0, arrayLength = posts.length; i < arrayLength && newsLimit; i++) {
		if (posts[i].search(/\x0b$/) > -1) {
			posts[i] = posts[i].replace(/\x0b$/, "");
			newsLimit--;
		}
	}
	if (localStorage["ljaddFriendsPageNewsReverseOpt"] == "true") {
		localStorage["ljaddFriendsPageLinks"] = posts.reverse().join("\x0c");
	}
	else {
		localStorage["ljaddFriendsPageLinks"] = posts.join("\x0c");
	}
	ljaddRestartCheckFriendsPage();
}
/*************************************************************************************************/
function ljaddAllNewPosts(mode) {
	if (!ljaddAreNewPostsPresent()) {
		return;
	}
	var posts;
	if (localStorage["ljaddFriendsPageNewsReverseOpt"] == "true") {
		posts = localStorage["ljaddFriendsPageLinks"].split("\x0c").reverse();
	}
	else {
		posts = localStorage["ljaddFriendsPageLinks"].split("\x0c");
	}
	var newsLimit;
	if (localStorage["ljaddFriendsPageNewsOpt"] == "true") {
		newsLimit = Number(localStorage["ljaddFriendsPageNews"]);
	}
	else {
		newsLimit = posts.length;
	}
	var firstOpened = false;
	if (localStorage["ljaddFormatOpenOpt"] == "true") {
        chrome.windows.getCurrent(function(w){
            chrome.tabs.getSelected(w.id, function(tab){
                for (var i=0, arrayLength = posts.length; i < arrayLength && newsLimit; i++) {
                    var postURL = posts[i].replace(/\x0b$/, "");
                    if (posts[i].search(/\x0b$/) > -1) {
                        var openStyle = ljaddCheckURLtoOpen(postURL);
                        if (openStyle) {
                            if(!firstOpened && tab.url == "about:blank" && tab.status != "loading")
                            {
                                chrome.tabs.update(tab.id, {url: ljaddChangeLocation(postURL, openStyle + (mode == 'reply'? "&mode=reply" : ""), false)});
                                firstOpened = true;
                            }
                            else
                            {
                                chrome.tabs.create({url: ljaddChangeLocation(postURL, openStyle + (mode == 'reply'? "&mode=reply" : ""), false)});
                            }
                        }
                        else {
                            if(!firstOpened && tab.url == "about:blank" && tab.status != "loading")
                            {
                                chrome.tabs.update(tab.id, {url: postURL + (mode == 'reply'? "?mode=reply" : "")});
                                firstOpened = true;
                            }
                            else
                            {
                                chrome.tabs.create({url: postURL + (mode == 'reply'? "?mode=reply" : "")});
                            }
                        }
                        newsLimit--;
                    }
                }
            });
        });
	}
	else {
        chrome.windows.getCurrent(function(w){
            chrome.tabs.getSelected(w.id, function(tab){
                for (var i=0, arrayLength = posts.length; i < arrayLength && newsLimit; i++) {
                    var postURL = posts[i].replace(/\x0b$/, "");
                    if (posts[i].search(/\x0b$/) > -1) {
                        if(!firstOpened && tab.url == "about:blank" && tab.status != "loading")
                        {
                            chrome.tabs.update(tab.id, {url: postURL + (mode == 'reply'? "?mode=reply" : "")});
                            firstOpened = true;
                        }
                        else
                        {
                            chrome.tabs.create({url: postURL + (mode == 'reply'? "?mode=reply" : "")});
                        }
                        newsLimit--;
                    }
                }
            });
        });
	}
	ljaddMarkAllPostsAsRead(true);
}
/*************************************************************************************************/
function ljaddAreNewPostsPresent() {
	var news = false;
	var posts = localStorage["ljaddFriendsPageLinks"].split("\x0c");
	for (var i=0, arrayLength = posts.length; i < arrayLength; i++) {
		if (posts[i].search(/\x0b$/) > -1) {
			news = true;
			break;
		}
	}
	return news;
}
/*************************************************************************************************/
function ljaddOpenEntryByClick(entryURL, event, ctrl) {
	if (entryURL.search(/^friends/i) > -1) {
		entryURL = localStarage["ljaddMainURL"] + entryURL;
	}
	if (event) {
		if (ctrl && (event.ctrlKey || event.metaKey)) {
			if (ctrl == 1) {
				if (entryURL.search(/\?/) > -1) {
					entryURL = entryURL.replace(/\?(.*$)/i, "?mode=reply" + "&$1");
				}
				else {
					entryURL += "?mode=reply";
				}
			}
			else if (ctrl == 2) {
//				ljaddClipboardService.emptyClipboard(ljaddCi.nsIClipboard.kGlobalClipboard);
//				var userNameTagged = '<lj user="' + ljaddGetUser(entryURL) + '"> ';
//				ljaddStringService.data = userNameTagged;
//				ljaddTransferService.setTransferData("text/unicode", ljaddStringService, userNameTagged.length * 2);
//				ljaddClipboardService.setData(ljaddTransferService, null, ljaddCi.nsIClipboard.kGlobalClipboard);
				return;
			}
			else if (ctrl == 3) {
				var itemid = entryURL.replace(/.+?(\d+)\.html\b.*$/i, "$1");
				if (entryURL.search(/\?/) > -1) {
					entryURL = entryURL.replace(/.+?\?(.*$)/, "http://www.livejournal.com/editjournal.bml?journal=" + ljaddGetUser(entryURL) + "&itemid=" + itemid + "&$1");
				}
				else {
					entryURL = "http://www.livejournal.com/editjournal.bml?journal=" + ljaddGetUser(entryURL) + "&itemid=" + itemid;
				}
			}
			else if (ctrl == 4) {
				entryURL = entryURL.replace(/\/(\?|$)/, "/profile$1");
				if (localStorage["ljaddFullProfile"] == "true") {
					if (entryURL.search(/\?/) > -1) {
						entryURL = entryURL.replace(/\?(.*$)/, "?mode=full" + "&$1");
					}
					else {
						entryURL += "?mode=full";
					}
				}
			}
		}
		if (localStorage["ljaddFormatOpenOpt"] == "true") {
			var openStyle = ljaddCheckURLtoOpen(entryURL);
			if (openStyle) {
				entryURL = ljaddChangeLocation(entryURL, openStyle, false);
			}
		}
		chrome.windows.getCurrent(function(w){
			chrome.tabs.getSelected(w.id, function(tab){
				if((tab.url == "about:blank" || tab.url == "" || tab.url == "chrome://newtab/")
					&& tab.status != "loading"
						/*|| event.button != 1
						&& !event.shiftKey*/)
				{
					chrome.tabs.update(tab.id, {url: entryURL});
				}
				else
				{
					chrome.tabs.create({url: entryURL});
				}
				window.close();
			});
		});
	}
	else {
		if (localStorage["ljaddFormatOpenOpt"] == "true") {
			var openStyle = ljaddCheckURLtoOpen(entryURL);
			if (openStyle) {
				entryURL = ljaddChangeLocation(entryURL, openStyle, false);
			}
		}
		chrome.windows.getCurrent(function(w){
			chrome.tabs.getSelected(w.id, function(tab){
				if((tab.url == "about:blank" || tab.url == "" || tab.url == "chrome://newtab/")
					&& tab.status != "loading"
						/*|| event.button != 1
						&& !event.shiftKey*/)
				{
					chrome.tabs.update(tab.id, {url: entryURL});
				}
				else
				{
					chrome.tabs.create({url: entryURL});
				}
				window.close();
			});
		});
	}
}
/*************************************************************************************************/
function ljaddMarkThisPostAsRead(post) {
	var posts = localStorage["ljaddFriendsPageLinks"].split("\x0c");
	for (var i=0, arrayLength = posts.length; i < arrayLength; i++) {
		if (posts[i] == post) {
			posts[i] = posts[i].replace(/\x0b$/, "");
            post = posts[i];
			break;
		}
	}
	localStorage["ljaddFriendsPageLinks"] = (posts.join("\x0c"));
	chrome.extension.getBackgroundPage().ljaddRestartCheckFriendsPage();
    return post;
}
/*************************************************************************************************/
function ljaddMarkThisPostAsUnRead(post) {
	var posts = localStorage["ljaddFriendsPageLinks"].split("\x0c");
	for (var i=0, arrayLength = posts.length; i < arrayLength; i++) {
		if (posts[i] == post) {
			posts[i] = posts[i] + '\x0b';
            post = posts[i];
			break;
		}
	}
	localStorage["ljaddFriendsPageLinks"] = (posts.join("\x0c"));
	chrome.extension.getBackgroundPage().ljaddRestartCheckFriendsPage();
    return post;
}
/*************************************************************************************************/
function ljaddGetUser(URL) {
	var username;
	if (URL.search(/http:\/\/(?:syndicated|community|users)\.livejournal\.com\/[\w-]+\//i) > -1) {
		username = URL.replace(/http:\/\/(?:syndicated|community|users)\.livejournal\.com\/([\w-]+)\/.*$/i, "$1");
	}
	else if (URL.search(/http:\/\/www\.livejournal\.com\/(?:syndicated|community|users)\/[\w-]+\//i) > -1) {
		username = URL.replace(/http:\/\/www\.livejournal\.com\/(?:syndicated|community|users)\/([\w-]+)\/.*$/i, "$1");
	}
	else if (URL.search(/http:\/\/www\.livejournal\.com\/userinfo.bml\?.*\b(?:user|userid)=\w+/i) > -1) {
		username = URL.replace(/http:\/\/www\.livejournal\.com\/userinfo.bml\?.*\b(?:user|userid)=(\w+).*/i, "$1");
	}
	else if (URL.search(/http:\/\/www\.livejournal\.com\/editjournal.bml\?.*journal=\w+/i) > -1) {
		username = URL.replace(/http:\/\/www\.livejournal\.com\/editjournal.bml\?.*journal=(\w+).*/i, "$1");
	}
	else if (URL.search(/http:\/\/www\.livejournal\.com\/update.bml\b/i) > -1) {
		if (URL.search(/usejournal=\w+/i) > -1) {
			username = URL.replace(/http:\/\/www\.livejournal\.com\/update.bml\?.*usejournal=(\w+).*/i, "$1");
		}
		else {
			username = "";
		}
	}
	else {
		username = URL.replace(/http:\/\/([\w-]+)\.livejournal\.com\/.*$/i, "$1");
	}
	return username.toLowerCase().replace(/-/g, "_");
}
/*************************************************************************************************/
function ljaddCheckURLtoOpen(URL) {
	var openStyle = localStorage["ljaddFormatOpenStyle"] ? Number(localStorage["ljaddFormatOpenStyle"]) : 0;
	if (openStyle == 0) {
		openStyle = "style=mine";
	}
	else if (openStyle == 1) {
		openStyle = "light";
	}
	else {
		openStyle = "lightOrMine";
	}
	var openFilter = localStorage["ljaddFormatOpenFilterList"].split(", ");
	var allMatched = false, excluding = false;
	var i = openFilter.indexOf("*");
	if (i > -1) {
		allMatched = true;
		openFilter.splice(i, 1);
	}
	if (openFilter.some(function(ent){return ent.search(/^!/) > -1})) {
		excluding = true;
	}
	if (allMatched && !excluding) {
		return(openStyle);
	}
	else {
		var thisMatched = false, thisExcluded = false;
		for (var i = 0, arrayLength = openFilter.length; i < arrayLength; i++) {
			var curSubstring = openFilter[i];
			if (curSubstring.search(/^!/) > -1) {
				if (URL.indexOf(curSubstring.replace(/^!/, "")) > -1) {
					thisExcluded = true;
					thisMatched = false;
					break;
				}
			}
			else if (URL.indexOf(curSubstring) > -1) {
				thisMatched = true;
			}
		}
		if (thisMatched || allMatched && !thisExcluded) {
			return(openStyle);
		}
		else {
			return false;
		}
	}
}
/*************************************************************************************************/

