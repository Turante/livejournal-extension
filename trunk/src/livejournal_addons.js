var ljStorage;

var IMG_PLUS = "<img src='" + chrome.extension.getURL("images/bullet_toggle_plus.png") + "' style='vertical-align: bottom;' alt='+' class='ljaddUnfolderImg'/>";
var IMG_MINUS = "<img src='" + chrome.extension.getURL("images/bullet_toggle_minus.png") + "' style='vertical-align: bottom;' alt='-' class='ljaddUnfolderImg'/>";

var insets = "bold%0B%3Cspan%20style=%22font-weight:%20bold%22%3E%5E%5E%3C/span%3E%0Ccenter%0B%3Cdiv%20style=%22text-align:%20center%22%3E%5E%5E%3C/div%3E%0Ccitation%0B%3Cdiv%20style=%22margin:%2010px%2012.5%25;%20padding:%205px;%20border:%201px%20solid%20gray;%20background-color:%20lightgray;%20text-align:%20justify;%20font-style:%20italic;%22%3E%3Cdiv%20style=%22padding-left:%205px;%20border:%201px%20solid%20gray;%20background-color:%20darkgray;%20color:%20white;%20font-weight:%20bold%22%3E%C2%AB&nbsp;&nbsp;&nbsp;%C2%BB%3C/div%3E%3Cdiv%20style=%22padding:%2010px%2012.5%25%205px;%22%3E%5E%3C/div%3E%3Cdiv%20style=%22padding:%205px%2012.5%25%2010px;%20text-align:%20right;%22%3EAuctor.%3C/div%3E%3C/div%3E%0B%0B%0Ccode%0B%3Ccode%20style=%22font-size:%20medium%22%3E%5E%5E%3C/code%3E%0B%0B%0Cfloat%20left%0B%3Cdiv%20style=%22float:%20left;%20margin:%2010px;%22%3E%5E%5E%3C/div%3E%0Cfloat%20right%0B%3Cdiv%20style=%22float:%20right;%20margin:%2010px;%22%3E%5E%5E%3C/div%3E%0Cimage%0B%3Cimg%20src=%22%5E%22%3E%0Citalic%0B%3Cspan%20style=%22font-style:%20italic%22%3E%5E%5E%3C/span%3E%0Clink%0B%3Ca%20href=%22%5E%22%3E%5E%5E%3C/a%3E%0Clj%20cut%0B%3Clj-cut%20text=%22...%22%3E%5E%5E%3C/lj-cut%3E%0Clj%20media%0B%3Clj-embed%3E%5E%3C/lj-embed%3E%0Clj%20user%0B%3Clj%20user=%22%5E%22%3E%0Bhttp://l-stat.livejournal.com/img/userinfo.gif%0B%0Clj%20user%20extended%0B%3Cspan%20style='white-space:nowrap;'%3E%3Ca%20href='%5Eprofile'%3E%3Cimg%20src='http://l-stat.livejournal.com/img/userinfo.gif'%20alt='%5Binfo%5D'%20width='17'%20height='17'%20style='vertical-align:%20bottom;%20border:%200pt%20none;'%20/%3E%3C/a%3E%3Ca%20href='%5E'%3E%3Cb%3E%5E%5E%3C/b%3E%3C/a%3E%3C/span%3E%0Bhttp://l-stat.livejournal.com/img/userinfo.gif%0B%0Cright%0B%3Cdiv%20style=%22text-align:%20right%22%3E%5E%5E%3C/div%3E%0Cspoiler%0B%3Cdiv%20style=%22margin:%2010px%2012.5%25;%20padding:%205px;%20border:%201px%20solid%20gray;%20background-color:%20lightgray;%20text-align:%20justify;%20font-style:%20italic;%22%3E%3Cdiv%20style=%22padding-left:%205px;%20border:%201px%20solid%20gray;%20background-color:%20darkgray;%20color:%20white;%20font-weight:%20bold;%22%3ESpoiler!%20Select%20by%20mouse%20to%20read:%3C/div%3E%3Cdiv%20style=%22padding:%2010px%2012.5%25%205px;%20color:%20lightgray;%22%3E%5E%5E%3C/div%3E%3C/div%3E%0B%0B%0Cstrike%0B%3Cspan%20style=%22text-decoration:%20line-through%22%3E%5E%5E%3C/span%3E";
var addInsetBlock = false;
var addInsetBlockPlace = 0;
var ljaddRandomQuotes = [];
var ljaddRandomizeUserpics = "false";
var comUnfolders = true;
var intervalShow = 1000;
var intervalHide = 500;
var setFullProfile = false;
var ljaddMainURL = "http://exampleusername.livejournal.com/";
var ljaddHideCommentFolders = false;
var ljaddNoStyleMine = "";
var ljaddMinImageWidthForBrowseOpt = true;
var ljaddMinImageWidthForBrowse = 100;
var ljaddUserTips = "";
var ljaddUserTipsOpt = false;
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
var ljaddToLight = new RegExp(
	"(?:" +
		"(?:syndicated|community|users)\\.livejournal\\.com/\\w+/" +
		"|www\\.livejournal\\.com/(?:syndicated|community|users)/[\\w-]+/" +
		"|[\\w-]+\\.livejournal\\.com/" +
	")" +
		"(?:\\d+\\.html\\b|tag/)"
, "i");

chrome.extension.onRequest.addListener(
		  function(request, sender, sendResponse)
		  {
				var textField = document.getElementById("draft-container") ? document.getElementById("draft-container").firstChild : null;
				if(!textField)
					textField = document.getElementById("commenttext");
				if(!textField)
					textField = document.getElementById("body");
				ljaddInset(request.index, textField);
		  });

function start()
{
	initStrings();

	chrome.extension.sendRequest({type: "storage"}, function(response)
	{
		ljStorage = response.storage;

		comUnfolders = (ljStorage["livejournal_addons.ljaddCommentUnfolders"] != "false");
		ljaddHideCommentFolders = (ljStorage["livejournal_addons.ljaddHideCommentFolders"] == "true");

        if(ljStorage["livejournal_addons.ljaddBigUnfolders"] == "true")
        {
            IMG_PLUS = "<img src='" + chrome.extension.getURL("images/bullet_toggle_plus_big.png") + "' style='vertical-align: bottom;' alt='+' class='ljaddUnfolderImg'/>";
            IMG_MINUS = "<img src='" + chrome.extension.getURL("images/bullet_toggle_minus_big.png") + "' style='vertical-align: bottom;' alt='-' class='ljaddUnfolderImg'/>";
        }
		if(comUnfolders)
			ljaddAddCommentUnfolders(document.body);

		var cutUnfolders = (ljStorage["livejournal_addons.ljaddAddCutUnfolders"] != "false");
		if(cutUnfolders)
			ljaddAddCutUnfolders(document.body);

		intervalShow = ljStorage["livejournal_addons.ljaddAddTriggersIntervalShow"] ?
				Number(ljStorage["livejournal_addons.ljaddAddTriggersIntervalShow"]) : intervalShow;
		intervalHide = ljStorage["livejournal_addons.ljaddAddTriggersIntervalHide"] ?
				Number(ljStorage["livejournal_addons.ljaddAddTriggersIntervalHide"]) : intervalHide;
		setFullProfile = (ljStorage["livejournal_addons.ljaddFullProfile"] == "true");
		ljaddMainURL = ljStorage["livejournal_addons.ljaddMainURL"] ? ljStorage["livejournal_addons.ljaddMainURL"] : ljaddMainURL;

		ljaddNoStyleMine = new RegExp(
			"http://www\\.livejournal\\.com/mobile/" +
			"|(?:" +
				ljaddMainURL +
				"|www\\.livejournal\\.com/(?!(?:syndicated|community|users)/[\\w-]+/)" +
				"|/profile\\b" +
			")"
		, "i");

		ljaddMinImageWidthForBrowseOpt = (ljStorage["livejournal_addons.ljaddMinImageWidthForBrowseOpt"] != "false");
		ljaddMinImageWidthForBrowse = (ljStorage["livejournal_addons.ljaddMinImageWidthForBrowse"]) ?
			Number(ljStorage["livejournal_addons.ljaddMinImageWidthForBrowse"]) : ljaddMinImageWidthForBrowse;

		ljaddUserTips = ljStorage["livejournal_addons.ljaddUserTips"] ? ljStorage["livejournal_addons.ljaddUserTips"] : ljaddUserTips;
		ljaddUserTipsOpt = (ljStorage["livejournal_addons.ljaddUserTipsOpt"] == "true");
		ljaddProcessLinks(document.body);

		insets = (ljStorage["livejournal_addons.ljaddInsets"]) ? ljStorage["livejournal_addons.ljaddInsets"] : insets;
		ljaddRandomQuotes = (ljStorage["livejournal_addons.ljaddRandomQuotes"]) ?
			decodeURI(ljStorage["livejournal_addons.ljaddRandomQuotes"]).split("\n.\n") : ljaddRandomQuotes;
		addInsetBlock = (ljStorage["livejournal_addons.ljaddAddInsetBlock"] == "true");
		addInsetBlockPlace = ljStorage["livejournal_addons.ljaddAddInsetBlockPlace"] ?
				Number(ljStorage["livejournal_addons.ljaddAddInsetBlockPlace"]) : addInsetBlockPlace;
		ljaddAddInsetBlock(document.body);
		ljaddProcessTextFields(document);

		ljaddRandomizeUserpics = (ljStorage["livejournal_addons.ljaddRandomizeUserpics"]) ? ljStorage["livejournal_addons.ljaddRandomizeUserpics"] : ljaddRandomizeUserpics;
		ljaddProcessImages(document.body);

		var autoUnfold = (ljStorage["livejournal_addons.ljaddAutoUnfold"] == "true");
		var allPages = (ljStorage["livejournal_addons.ljaddAutoUnfoldAllPages"] == "true");
		if(autoUnfold)
			ljaddUnfoldComments(false, document.body, allPages);

		var comButtons = (ljStorage["livejournal_addons.ljaddAddCommentButtons"] != "false");
		if(comButtons)
			addCommentsButtons(document.body);

		var ljInstabtComment = (ljStorage["livejournal_addons.ljInstantComment"] == "true");
		if(ljInstabtComment)
			LJInstantCommentInit();

		var fpURL = ljStorage["livejournal_addons.ljaddFrPgURL"];
		if (document.location.href.indexOf(fpURL) > -1) {
			if (
				ljStorage["ljaddFriendsPageUpdate"] != "false" &&
				fpURL.replace(/(?:\?|#).*$/, "").replace(/\bfriends\/$/i, "friends") ==
					document.location.href.replace(/(?:\?|#).*$/, "").replace(/\bfriends\/$/i, "friends") &&
					document.location.search.search(/\bskip=\d/i) == -1 &&
					document.location.search.search(/\bdate=\d/i) == -1 &&
					document.location.search.search(/\bshow=\w/i) == -1
			) {
				chrome.extension.sendRequest({type: "call", action: "ljaddMarkAllPostsAsRead"});
			}
		}

	});

	document.documentElement.addEventListener("DOMNodeInserted", ljaddCatchDOMNodeInserted, true);
	//chrome.experimental.contextMenu({"title": "Test", "contexts":["ALL"], "onclick": function(){alert(1);}});
}

/*************************************************************************************************/
function ljaddIsCommentOfDeletedJournal(comment) {
	return  comment.className != 'talk-comment' ? comment.ownerDocument.evaluate(
		".//span[contains(@class, 'ljuser') and contains(@style, 'line-through') and descendant::a[@href]]",
		comment,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue : null;
}
/*************************************************************************************************/
function ljaddAddCommentUnfolders(block) {
	var doc = block.ownerDocument;
	var comments = doc.evaluate(
		".//table[tbody[tr[1][td[1][img[@width and @src='http://l-stat.livejournal.com/img/dot.gif']]]]]",
		block,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	for (var i=0, comment; comment = comments.snapshotItem(i); i++) {
		var unfolderContainer = comment.getElementsByTagName("tr")[0].firstChild;
		var unfolder = doc.evaluate(
			".//*[@class='ljaddCommentUnfolderBlock' or @class='ljaddCommentUnfolderPage']",
			unfolderContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!unfolder) {
			unfolderContainer.style.whiteSpace = "nowrap";
			unfolderContainer.style.verticalAlign = "top";
			unfolder = doc.createElement("span");
			var info = doc.createElement("span");
			unfolder.className = info.className = (block.tagName == "BODY"? "ljaddCommentUnfolderPage" : "ljaddCommentUnfolderBlock");
			unfolder.setAttribute("style", "cursor:pointer;font-family:monospace;color:black;font-weight:bold;vertical-align:text-bottom;padding: 0px");
			unfolder.setAttribute("title", Strings.commentUnfolderTip);
			info.setAttribute("style", "color:silver;font-weight:bold;margin-left:3px;");
			if (comment.className == "talk-comment" || comment.getElementsByTagName("a").length && !ljaddIsCommentOfDeletedJournal(comment)) {
				unfolder.innerHTML = (comment.className == "talk-comment"? IMG_MINUS : IMG_PLUS);
                unfolder.value = (comment.className == "talk-comment"? "-" : "+");
				info.setAttribute("title", "");
				var user = doc.evaluate(
					".//span[contains(@class, 'ljuser')]",
					unfolderContainer.nextSibling,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
				).singleNodeValue;
				if(user) {
					info.textContent = user.textContent;
				}
				else {
					info.textContent = "?";
				}
			}
			else {
				unfolder.innerHTML = IMG_MINUS;
                unfolder.value = "-";
				info.setAttribute("title", comment.textContent);
				info.textContent = comment.textContent;
			}
			info.style.display = "none";
			unfolderContainer.appendChild(unfolder);
			unfolderContainer.appendChild(info);
			if (ljaddHideCommentFolders && unfolder.value == "-") {
				unfolder.style.visibility = "hidden";
				unfolderContainer.addEventListener("mouseover", ljaddUnfolderPointer, false);
				unfolderContainer.addEventListener("mouseout", ljaddUnfolderNoPointer, false);
			}
			unfolder.addEventListener("mousedown", ljaddUnfolderSelectAction, true);
		}
	}

    refreshDocument();
}
/*************************************************************************************************/
function ljaddUnfolderPointer() {
	var unfolder = this.getElementsByTagName("span")[0];
	if (ljaddHideCommentFolders && unfolder.value == "-") {
		unfolder.style.visibility = "visible";
	}
}
/*************************************************************************************************/
function ljaddUnfolderNoPointer() {
	var unfolder = this.getElementsByTagName("span")[0];
	if (ljaddHideCommentFolders && unfolder.value == "-") {
		unfolder.style.visibility = "hidden";
	}
}
/*************************************************************************************************/
function ljaddGetParentComment(comment) {
	comment = comment.parentNode;
	var parentComment = comment;
	var width = Number(comment.getElementsByTagName("img")[0].getAttribute("width"));
	while (comment = comment.previousSibling) {
		if (comment.tagName != "DIV" || !comment.id || comment.id.indexOf("ljcmt") == -1) {
			continue;
		}
		if (Number(comment.getElementsByTagName("img")[0].getAttribute("width")) < width) {
			parentComment = comment;
			break;
		}
	}
	parentComment = parentComment.getElementsByTagName("table")[0];
	return parentComment;
}
/*************************************************************************************************/
function ljaddGetThread(comment) {
	var width = Number(comment.getElementsByTagName("img")[0].getAttribute("width"));
	var needNetUnfolding = (comment.className != "talk-comment" && comment.getElementsByTagName("a").length && !ljaddIsCommentOfDeletedJournal(comment));
	var thread = [comment];
	comment = comment.parentNode;
	while (comment = comment.nextSibling) {
		if (comment.tagName != "DIV" || !comment.id || comment.id.indexOf("ljcmt") == -1) {
			continue;
		}
		if (Number(comment.getElementsByTagName("img")[0].getAttribute("width")) <= width) {
			break
		}
		var commentTab = comment.getElementsByTagName("table")[0];
		if (
			!needNetUnfolding &&
			commentTab.className != "talk-comment" &&
			commentTab.getElementsByTagName("a").length &&
			!ljaddIsCommentOfDeletedJournal(commentTab)
		) {
			needNetUnfolding = true;
		}
		thread.push(commentTab);
	}
	thread.push(needNetUnfolding);
	return thread;
}
/*************************************************************************************************/
function ljaddUnfolderSelectAction(event) {
	event.preventDefault();
	var unfolder = this;
	var unfolderContainer = unfolder.parentNode;
	var comment = unfolderContainer.parentNode.parentNode.parentNode;
	var doc = comment.ownerDocument;
	var show = (unfolder.value == "+");
	if (event.ctrlKey || event.metaKey) {
		var parentComment = ljaddGetParentComment(comment);
		parentComment.style.outline = "1px solid rgb(255, 0, 0)";
		window.setTimeout(function() {
			parentComment.style.outline = "0px none rgb(0, 0, 0)";
		}, 3000);
		parentComment.scrollIntoView(true);
		return;
	}
	else if (event.button == 0) {
		var thread = ljaddGetThread(comment);
		var needNetUnfolding = thread.pop();
		ljaddUnfoldComment(thread, show);
		if (show && needNetUnfolding) {
			ljaddUnfoldLinkInit(unfolder, false);
		}
	}
	else if (event.button == 1) {
		if (comment.className == "talk-comment" || !comment.getElementsByTagName("a").length || ljaddIsCommentOfDeletedJournal(comment)) {
			ljaddUnfoldComment([comment], show);
		}
		else {
			ljaddUnfoldLinkInit(unfolder, true);
		}
	}
}
/*************************************************************************************************/
function ljaddUnfoldComment(thread, show) {
	if (show) {
		for (var i = 0, comment; comment = thread[i]; i++) {
			if (comment.className != "talk-comment" && comment.getElementsByTagName("a").length && !ljaddIsCommentOfDeletedJournal(comment)) {
				continue;
			}
			var unfolderContainer = comment.getElementsByTagName("td")[0];
			var unfolder = unfolderContainer.getElementsByTagName("span")[0];
			var info = unfolder.nextSibling;
			unfolderContainer.nextSibling.style.display = "table-cell";
			info.style.display = "none";
			unfolder.setAttribute("title", Strings.commentUnfolderTip);
			unfolder.innerHTML = IMG_MINUS;
            unfolder.value = "-";
			if (ljaddHideCommentFolders) {
				unfolder.style.visibility = "hidden";
			}
		}
	}
	else {
		for (var i = 0, comment; comment = thread[i]; i++) {
			if (comment.className != "talk-comment" && comment.getElementsByTagName("a").length && !ljaddIsCommentOfDeletedJournal(comment)) {
				continue;
			}
			var unfolderContainer = comment.getElementsByTagName("td")[0];
			var unfolder = unfolderContainer.getElementsByTagName("span")[0];
			var info = unfolder.nextSibling;
			var title = info.getAttribute("title");
			if (!title) {
				var commentSubject =
					"/" +
					(unfolderContainer.nextSibling.getElementsByTagName("font")[0].textContent || Strings.noSubject) +
					"/ - "
				;
				var commentBodyElements = unfolderContainer.nextSibling.firstChild.nextSibling.childNodes;
				var stopNodeNumber = commentBodyElements.length - 2;
				var commentBodyText = "";
				for (var j = 0; j < stopNodeNumber; j++) {
					var node = commentBodyElements[j];
					if (node.nodeName == "BR") {
						commentBodyText += "    ";
					}
					else {
						commentBodyText += node.textContent;
					}
				}
				title = commentSubject + commentBodyText.replace(/\n/g, "    ");
				info.setAttribute("title", title);
			}
			unfolderContainer.nextSibling.style.display = "none";
			info.style.display = "inline";
			unfolder.setAttribute("title", title);
			unfolder.innerHTML = IMG_PLUS;
            unfolder.value = "+";
			unfolder.style.visibility = "visible";
		}
	}
}
/*************************************************************************************************/
function ljaddUnfoldLinkInit(unfolder, thisOnly) {
	unfolder.removeEventListener("mousedown", ljaddUnfolderSelectAction, true);
	var unfolderContainer = unfolder.parentNode;
	unfolderContainer.removeEventListener("mouseover", ljaddUnfolderPointer, false);
	unfolderContainer.removeEventListener("mouseout", ljaddUnfolderNoPointer, false);
	unfolder.removeAttribute("title");
	unfolder.style.cursor = "auto";
	unfolder.setAttribute("style", "");
	var path = chrome.extension.getURL("images/throbber.gif");
	unfolder.innerHTML = "<img style='border:0px none;vertical-align:text-bottom;margin-right:5px' src='" + path + "'>";
	var doc = unfolderContainer.ownerDocument;
	var body = doc.body;
	var commentsContainer = doc.evaluate(
		"ancestor::div[@id='Comments']",
		unfolderContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue || body;
	var comment = unfolderContainer.parentNode.parentNode.parentNode;
	comment.style.backgroundColor = "silver";
	var commentLink = doc.evaluate(
		".//a[contains(@href, 'thread=')]",
		comment,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue;
	if (!commentLink) {
		var thread = ljaddGetThread(comment);
		var firstCommentInThreadLink;
		for (var i = 0, commentInThread; commentInThread = thread[i]; i++) {
			firstCommentInThreadLink = doc.evaluate(
				".//a[contains(@href, 'thread=')]",
				commentInThread,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
			).singleNodeValue;
			if (firstCommentInThreadLink) {
				break;
			}
		}
		var strangeCommentAnchor = doc.evaluate(
				"preceding-sibling::a[@name]",
			comment,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (strangeCommentAnchor && firstCommentInThreadLink) {
			commentLink = doc.createElement('a');
			commentLink.href =
				firstCommentInThreadLink.href
				.replace(/\?.*$|$/,
					"?thread=" +
					strangeCommentAnchor.name.replace(/t/, "")
				)
			;
		}
		else {
			comment.style.backgroundColor = "transparent";
			var unfolderElements = doc.evaluate(
				".//*[@class='ljaddCommentUnfolderBlock' or @class='ljaddCommentUnfolderPage']",
				unfolderContainer,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
			);
			for (var i=0, unfolderElement; unfolderElement = unfolderElements.snapshotItem(i); i++) {
				unfolderElement.parentNode.removeChild(unfolderElement);
			}
			if(comUnfolders)
				ljaddAddCommentUnfolders(comment.parentNode);
			return;
		}
	}
	var container = doc.createElement('div');
	container.style.display = 'none';
	body.appendChild(container);
	var subContainer = doc.createElement('div');
	subContainer.style.display = 'none';
	body.appendChild(subContainer);
	if (
		unfolder.className == "ljaddCommentUnfolderBlock" ||
		doc.location.href.search(/(?:&|\?)(?:format=light|usescheme=lynx)(?:&|#|$)/i) > -1/* ||
		ljaddPrefMainBranch.getBoolPref("ljaddUnfoldThreadInLight")*/
	) {
		ljaddChangeLocation(commentLink, "light", false);
	}
	else if (doc.location.href.search(/(?:&|\?)style=mine(?:&|#|$)/i) > -1) {
		ljaddChangeLocation(commentLink, "style=mine", false);
	}
	chrome.extension.sendRequest({url: commentLink.href}, function(response)
	{
		container.innerHTML = response.html;
		ljaddUnfoldLinkProcessTree(doc, container, subContainer, thisOnly, commentsContainer, unfolder);
	});
}
/*************************************************************************************************/
function ljaddUnfoldLinkProcessTree(doc, container, subContainer, thisOnly, commentsContainer, unfolder) {
	var body = doc.body;
	var initComment = unfolder.parentNode.parentNode.parentNode.parentNode;
	var firstFoldedContainerComment = doc.evaluate(
			".//div[@id='Comments']//table[not(@class='talk-comment') and descendant::a[contains(@href, 'thread=')] and not(descendant::span[contains(@class, 'ljuser') and contains(@style, 'line-through') and descendant::a[@href]])]",
		container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue;
	if (!thisOnly && firstFoldedContainerComment) {
		var firstFoldedContainerCommentLink = firstFoldedContainerComment.getElementsByTagName("a")[0];
		if (
			unfolder.className == "ljaddCommentUnfolderBlock" ||
			doc.location.href.search(/(?:&|\?)(?:format=light|usescheme=lynx)(?:&|#|$)/i) > -1/* ||
			ljaddPrefMainBranch.getBoolPref("ljaddUnfoldThreadInLight")*/
		) {
			ljaddChangeLocation(firstFoldedContainerCommentLink, "light", false);
		}
		else if (doc.location.href.search(/(?:&|\?)style=mine(?:&|#|$)/i) > -1) {
			ljaddChangeLocation(firstFoldedContainerCommentLink, "style=mine", false);
		}
		chrome.extension.sendRequest({url: firstFoldedContainerCommentLink.href}, function(response)
		{
			subContainer.innerHTML = response.html;
			ljaddUnfoldReplaceComments(subContainer, firstFoldedContainerComment, thisOnly);
			ljaddUnfoldLinkProcessTree(doc, container, subContainer, thisOnly, commentsContainer, unfolder);
		});
		return;
	}
	ljaddUnfoldReplaceComments(container, initComment, thisOnly);
	body.removeChild(container);
	body.removeChild(subContainer);
	initComment.style.backgroundColor = "transparent";
	var unfolderElements = doc.evaluate(
		".//*[@class='ljaddCommentUnfolderBlock' or @class='ljaddCommentUnfolderPage']",
		unfolder.parentNode,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	for (var i=0, unfolderElement; unfolderElement = unfolderElements.snapshotItem(i); i++) {
		unfolderElement.parentNode.removeChild(unfolderElement);
	}
	ljaddProcessChangedBlock(commentsContainer);
}
/*************************************************************************************************/
function ljaddChangeLocation(target, add, notify) {
	if (typeof target == "string") {
		if (target.search(/https?:\/\/.+?\.livejournal.com/i) == -1) {
			return;
		}
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
	var xpathCollection;
	if (!target.snapshotLength) {
		if (!target.length) {
			if (target.href.search(/https?:\/\/.+?\.livejournal.com/i) == -1) {
				if (notify) {
					alert(Strings.wrongURL);
				}
				return;
			}
			target = [target];
		}
		xpathCollection = false;
	}
	else {
		xpathCollection = true;
	}
	for (var i = 0, loc; loc = xpathCollection? target.snapshotItem(i) : target[i]; i++) {
		if (loc.href.search(/https?:\/\/.+?\.livejournal.com/i) == -1) {
			continue;
		}
		var searchDataOld, searchDataNew, curAdd = add;
		searchDataOld = searchDataNew = loc.search;
		if (curAdd == 'light&tree' || curAdd.indexOf("view=flat") > -1) {
			if (loc.href.search(/\/\d+\.html\b/i) == -1) {
				alert(Strings.notSuitablePage);
				return;
			}
			searchDataNew =
				searchDataNew
				.replace(/(\?|&)thread=\w*(?:&|$)/gi, "$1")
				.replace(/(\?|&)mode=reply(?:&|$)/gi, "$1")
				.replace(/(\?|&)view=\w*(?:&|$)/gi, "$1")
				.replace(/(\?|&)page=\d*(?:&|$)/gi, "$1")
				.replace(/[\?&]+$/, "");
			loc.hash = "#Comments";
			if (curAdd == 'light&tree') {
				curAdd = 'light';
			}
		}
		if (curAdd.search(/light|style=mine/i) > -1 || !curAdd) {
			searchDataNew = searchDataNew.replace(/(\?|&)(?:style=mine|format=light|usescheme=\w*)(?:&|$)/gi, "$1").replace(/[\?&]+$/, "");
			if (curAdd.indexOf("light") > -1) {
				if (loc.href.search(ljaddNoStyleLight) > -1) {
					if (notify) {
						alert(Strings.noStyle);
						return;
					}
					if (curAdd.indexOf("lightOrMine") > -1) {
						curAdd = curAdd.replace(/(&)?lightOrMine(?=&|$)/gi, "$1" + "style=mine");
					}
					else {
						curAdd = curAdd.replace(/(&)?light(?:&|$)/gi, "$1").replace(/&+$/, "");
					}
				}
				else if (curAdd.indexOf("lightOrMine") > -1) {
					curAdd = curAdd.replace(/(&)?lightOrMine(?=&|$)/gi, "$1" + "light");
				}
			}
			if (curAdd.indexOf("style=mine") > -1 ) {
				if (loc.href.search(ljaddNoStyleMine) > -1) {
					if (notify) {
						alert(Strings.noStyle);
						return;
					}
					curAdd = curAdd.replace(/(&)?style=mine(?:&|$)/gi, "$1").replace(/&+$/, "");
				}
			}
		}
		if (curAdd.indexOf("light") > -1 ) {
			if (loc.href.search(ljaddToLight) > -1) {
				curAdd = curAdd.replace(/light/i, "format=light");
			}
			else if (loc.href.search(ljaddToLight) == -1) {
				curAdd = curAdd.replace(/light/i, "usescheme=lynx");
			}
		}
		if (searchDataNew) {
			searchDataNew = (searchDataNew + (curAdd? ("&" + curAdd) : ""));
		}
		else {
			searchDataNew = (curAdd? ("?" + curAdd) : "");
		}
		if(searchDataNew != '' || loc.search != '')
            loc.search = searchDataNew;
	}
}
/*************************************************************************************************/
function ljaddUnfoldReplaceComments(source, targetInitComment, thisOnly) {
	var doc = targetInitComment.ownerDocument;
	var notFoldedComments = doc.evaluate(
		".//table[tbody[tr[1][td[1][img[@width and @src='http://l-stat.livejournal.com/img/dot.gif']]]]]",
		source,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	var foldedComments = ljaddGetThread(targetInitComment);
	foldedComments.pop();
	var foldedRange = doc.createRange();
	foldedRange.setStartBefore(foldedComments[0].parentNode);
	var end = thisOnly? 0 : foldedComments.length - 1;
	foldedRange.setEndAfter(foldedComments[end].parentNode);
	var notFoldedRange = doc.createRange();
	notFoldedRange.setStartBefore(notFoldedComments.snapshotItem(0).parentNode);
	end = thisOnly? 0 : notFoldedComments.snapshotLength - 1;
	notFoldedRange.setEndAfter(notFoldedComments.snapshotItem(end).parentNode);
	var strangeFoldedCommentId = 0, strangeNotFoldedCommentId = 0;
	for (var i = 0, foldedComment; foldedComment = foldedComments[i]; i++) {
		var foldedCommentParentId = foldedComment.parentNode.id;
		for (var j=0, notFoldedComment; notFoldedComment = notFoldedComments.snapshotItem(j); j++) {
			if(foldedCommentParentId == notFoldedComment.parentNode.id) {
				notFoldedComment.getElementsByTagName("img")[0].setAttribute(
					"width",
					foldedComment.getElementsByTagName("img")[0].getAttribute("width")
				);
				break;
			}
		}
		if (thisOnly) {
			break;
		}
	}
	foldedRange.deleteContents();
	foldedRange.insertNode(notFoldedRange.extractContents());
	foldedRange.detach();
	notFoldedRange.detach();
}
/*************************************************************************************************/
function ljaddProcessChangedBlock(block) {
    refreshDocument();

	if(comUnfolders)
		ljaddAddCommentUnfolders(block);
	ljaddProcessLinks(block);
	ljaddProcessImages(block);

	var doc = block.ownerDocument;
	var body = doc.body;
	if (body.className == "ljaddExport") {
		return;
	}
	ljaddProcessTextFields(doc);
	ljaddProcessLinks(block, false);
	ljaddProcessImages(block);
	if (comUnfolders /*ljaddPrefMainBranch.getBoolPref("ljaddAddCommentUnfolders")*/) {
		ljaddAddCommentUnfolders(block);
	}
/*	var placeholders = doc.evaluate(
		".//img[@class='LJ_Placeholder']",
		block,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	if (placeholders) {
		for (var i=0, arrayLength = placeholders.snapshotLength; i < arrayLength; i++) {
			placeholders.snapshotItem(i).addEventListener("click", ljaddReplacePlaceholder, false);
		}
	}
	if (
		ljaddPrefMainBranch.getBoolPref("ljaddAutoFilter")
		||
		doc.evaluate(
			".//*[@class='ljaddFilterCounters']",
			block,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue
	) {
		ljaddDoCommentFilterProcess(block, false);
	}
	if (ljaddMarks.length) {
		ljaddMark(block);
	}
*/
	if (addInsetBlock /*ljaddPrefMainBranch.getBoolPref("ljaddAddInsetBlock")*/) {
		ljaddAddInsetBlock(body);
	}
}

/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddAddCutUnfolders(block) {
	var doc = block.ownerDocument;
	var cutLinks = doc.evaluate(
		".//b/a[contains(@href, '#cutid')]",
		block,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	for (var i=0, cutLink; cutLink = cutLinks.snapshotItem(i); i++) {
		var unfolder = doc.createElement("span");
		unfolder.setAttribute("style", "color:black; font-weight:bold; cursor:pointer;");
		unfolder.className = "ljaddCutUnfolder";
		unfolder.innerHTML = IMG_PLUS;
        unfolder.value = "+";
		unfolder.addEventListener("click", ljaddUnfoldCut, false);
		cutLink.parentNode.insertBefore(unfolder, cutLink);
	}
}
/*************************************************************************************************/
function ljaddUnfoldCut() {
	var unfolder = this;
	var cutLink = unfolder.nextSibling;
	var doc = unfolder.ownerDocument;
	var body = doc.body;
	var cutId = cutLink.hash.replace(/^#/, "");
	var cutURL = cutLink.getAttribute("href");
	cutURL = ljaddChangeLocation(cutURL, "light&mode=reply", false);
	cutLink.parentNode.appendChild(doc.createTextNode(":"));
	unfolder.setAttribute("style", "");
	var path = chrome.extension.getURL("images/throbber.gif");
	unfolder.innerHTML = "<img style='border:0px none;vertical-align:text-bottom;margin-right:5px' src='" + path + "'>";
	var container = doc.createElement('div');
	container.style.display = 'none';
	body.appendChild(container);

	chrome.extension.sendRequest({url: cutURL}, function(response)
	{
		container.innerHTML = response.html;
		var cutStartAnchor = doc.evaluate(
			".//a[contains(@name, '" + cutId +"')]",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		var cutEndAnchor = doc.evaluate(
			".//a[contains(@name, '" + cutId +"-end')]",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!cutEndAnchor) {
			var cutEndAnchor = doc.evaluate(
				".//div[descendant::a[contains(@name, '" + cutId +"')]]",
				container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
			).singleNodeValue.nextSibling;
		}
		if (!cutStartAnchor || !cutEndAnchor) {
			cutLink.parentNode.removeChild(cutLink.parentNode.lastChild);
			body.removeChild(container);
			unfolder.parentNode.removeChild(unfolder);
			var newUnfolder = doc.createElement("span");
			newUnfolder.setAttribute("style", "color:black; font-weight:bold; cursor:pointer;");
			newUnfolder.className = "ljaddCutUnfolder";
			newUnfolder.innerHTML = IMG_PLUS;
            newUnfolder.value = "+";
			newUnfolder.addEventListener("click", ljaddUnfoldCut, false);
			cutLink.parentNode.insertBefore(newUnfolder, cutLink);
			return;
		}
		cutRange = doc.createRange();
		cutRange.setStartAfter(cutStartAnchor);
		cutRange.setEndBefore(cutEndAnchor);
		var newCutContainer = doc.createElement('div');
		newCutContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;");
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		var path = chrome.extension.getURL("images/del.gif");
		closeButton1.setAttribute("src", path);
		closeButton1.className = "ljaddCutCloseButton1";
		newCutContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			cutLink.parentNode.removeChild(cutLink.parentNode.lastChild);
			newCutContainer.parentNode.removeChild(newCutContainer);
			var unfolder = doc.createElement("span");
			unfolder.setAttribute("style", "color:black; font-weight:bold; cursor:pointer;");
			unfolder.className = "ljaddCutUnfolder";
			unfolder.innerHTML = IMG_PLUS;
            unfolder.value = "+";
			unfolder.addEventListener("click", ljaddUnfoldCut, false);
			cutLink.parentNode.insertBefore(unfolder, cutLink);
			cutLink.focus();
		}, false);
		newCutContainer.appendChild(cutRange.extractContents());
		if (newCutContainer.lastChild && newCutContainer.lastChild.setAttribute) {
			newCutContainer.lastChild.setAttribute("style", "position:static;display:block;visibility:visible;");
		}
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", path);
		newCutContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			cutLink.parentNode.removeChild(cutLink.parentNode.lastChild);
			newCutContainer.parentNode.removeChild(newCutContainer);
			var unfolder = doc.createElement("span");
			unfolder.setAttribute("style", "color:black; font-weight:bold; cursor:pointer;");
			unfolder.className = "ljaddCutUnfolder";
			unfolder.innerHTML = IMG_PLUS;
            unfolder.value = "+";
			unfolder.addEventListener("click", ljaddUnfoldCut, false);
			cutLink.parentNode.insertBefore(unfolder, cutLink);
			cutLink.focus();
		}, false);
		unfolder.parentNode.removeChild(unfolder);
		cutLink.parentNode.parentNode.insertBefore(newCutContainer, cutLink.parentNode.nextSibling);
		body.removeChild(container);
		ljaddProcessChangedBlock(newCutContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddProcessLinks(block) {
	var doc = block.ownerDocument;
	var links = doc.evaluate(
		".//a[contains(@href, '.livejournal.com')]",
		block,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);

	var ljaddUserTipsArr = {};
	var temp = ljaddUserTips.split('\n');
	for(var i = 0; i < temp.length; i++)
		if(temp[i].indexOf('=') > -1)
			ljaddUserTipsArr[temp[i].substring(0, temp[i].indexOf('='))] = temp[i].substring(temp[i].indexOf('=') + 1, temp[i].length);

	for (var i = 0, curLink; curLink = links.snapshotItem(i); i++)
	{
		var curLinkHref = curLink.href;
		if (
			curLinkHref.search(/\blivejournal\.com\b.*\/(?:profile|userinfo\.bml)\b(?!\/)/i) > -1 ||
			curLinkHref.search(/http:\/\/(?:syndicated|community|users)\.livejournal\.com\/[\w-]+\/($|#|\?)/i) > -1 ||
			curLinkHref.search(/http:\/\/www\.livejournal\.com\/(?:syndicated|community|users)\/[\w-]+\/($|#|\?)/i) > -1 ||
			curLinkHref.search(/http:\/\/(?!www\\.|my\\.)[\w-]+\.livejournal\.com\/($|#|\?)/i) > -1
		) {
			var tip = ljaddUserTipsArr[ljaddGetUser(curLinkHref)];
			if (tip) {
				if (ljaddUserTipsOpt && (!curLink.nextSibling || curLink.nextSibling.className != "ljaddUserTip")) {
					var userImg = doc.evaluate(
						"./parent::span[contains(@class, 'ljuser') and a[2]]//img[contains(@src, 'livejournal.com')]",
						curLink,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
					).singleNodeValue;
					if (!userImg) {
						var tipSpan = doc.createElement("span");
						tipSpan.className = "ljaddUserTip";
						tipSpan.textContent = " " + tip;
						tipSpan.setAttribute("style", "margin-left: 2px; font-size: 75%; vertical-align: super;");
						curLink.parentNode.insertBefore(tipSpan, curLink.nextSibling);
					}
				}
				else {
					curLink.setAttribute("title", tip);
				}
			}
		}
		if (curLinkHref.search(/\blivejournal\.com\b.*\/(?:profile|userinfo\.bml)\b(?!\/)/i) > -1) {
			if (setFullProfile) {
				if (curLink.search) {
					if (curLink.search.search(/\bmode=full\b/i) == -1) {
						curLink.search += "&mode=full";
					}
				}
				else {
					curLink.search = "?mode=full";
				}
			}
		}


		if (curLink.href.search(/http:\/\/.+?\.livejournal.com/i) == -1)
			continue;

		if(curLink.parentNode.tagName.toLowerCase() == "b"
			&& curLink.parentNode.parentNode.className == "comments")
		{
			var next = curLink.parentNode.nextSibling;
			var parent = curLink.parentNode.parentNode;
			parent.removeChild(curLink.parentNode);
			curLink.style.fontWeight = "bold";
			parent.insertBefore(curLink, next);
		}

		if (curLink.parentNode.className != "comments"
			|| curLink.parentNode.firstChild != curLink)
			continue;

		var unfolder = doc.createElement("span");
		unfolder.setAttribute("style", "color:black; font-weight:bold; cursor:pointer;");
		unfolder.className = "ljaddCutUnfolder";
		unfolder.innerHTML = IMG_PLUS;
        unfolder.value = "+";
		unfolder.addEventListener("click", ljaddLoadCommentsHere, false);
		curLink.parentNode.insertBefore(unfolder, curLink);
	}


	if (ljStorage["livejournal_addons.ljaddFormatAppendOpt"] == "true") {
		var appendStyle = Number(ljStorage["livejournal_addons.ljaddFormatAppendStyle"]);
		if (appendStyle == 0) {
			appendStyle = "style=mine";
		}
		else if (appendStyle == 1) {
			appendStyle = "light";
		}
		else {
			appendStyle = "lightOrMine";
		}
		var appendFilter = ljStorage["livejournal_addons.ljaddFormatAppendFilterList"].split(", ");
		var allMatched = false, excluding = false;
		var i = appendFilter.indexOf("*");
		if (i > -1) {
			allMatched = true;
			appendFilter.splice(i, 1);
		}
		if (appendFilter.some(function(ent){return ent.search(/^!/) > -1})) {
			excluding = true;
		}
		if (allMatched && !excluding) {
			ljaddChangeLocation(links, appendStyle, false);
		}
		else {
			var filteredLinks = new Array();
			for (var i = 0, curLink; curLink = links.snapshotItem(i); i++) {
				var curLinkHref = curLink.href;
				var thisMatched = false, thisExcluded = false;
				for (var j = 0, arrayLength = appendFilter.length; j < arrayLength; j++) {
					var curSubstring = appendFilter[j];
					if (curSubstring.search(/^!/) > -1) {
						if (curLinkHref.indexOf(curSubstring.replace(/^!/, "")) > -1) {
							thisExcluded = true;
							thisMatched = false;
							break;
						}
					}
					else if (curLinkHref.indexOf(curSubstring) > -1) {
						thisMatched = true;
					}
				}
				if (thisMatched || allMatched && !thisExcluded) {
					filteredLinks.push(curLink);
				}
			}
			ljaddChangeLocation(filteredLinks, appendStyle, false);
		}
	}
	var triggers = (ljStorage["livejournal_addons.ljaddAddTriggersOpt"] == "false") ? false : true;
	if(triggers)
		ljaddAddTriggers(doc, links, false);

}

/*************************************************************************************************/
function ljaddLoadCommentsHere(event) {
	var commentLink;
	if (event.target.parentNode.id == "ljaddTriggers") {
		commentLink = event.target.ownerDocument.triggersLink;
	}
	else
		commentLink = this.parentNode.childNodes[1];
	var commentURL = commentLink.href;
	var doc = commentLink.ownerDocument;
	var body = doc.body;
	commentURL = ljaddChangeLocation(commentURL, "light", false);
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	var path = chrome.extension.getURL("images/throbber.gif");
	throbber.setAttribute("src", path);
	commentLink.parentNode.insertBefore(throbber, commentLink.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = "livejournal_addons_CommentContainer_" + commentURL.replace(/[^\w]/g, "");
	body.appendChild(container);
	chrome.extension.sendRequest({url: commentURL}, function(response)
	{
		container.innerHTML = response.html;
		var commentDiv = doc.evaluate(
			".//div[@id='Comments']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!commentDiv) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			return;
		}
		var pageLinks = doc.evaluate(
			".//a[contains(@href, 'page=')]",
			commentDiv,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
		);
		if (pageLinks.snapshotLength) {
			var hostAndPath = commentURL.replace(/\?.+$/, "?");
			for (var i=0, pageLink; pageLink = pageLinks.snapshotItem(i); i++) {
				pageLink.href = pageLink.href.replace(/^.+\?/, hostAndPath);
			}
		}
		commentDiv.setAttribute("style", "position:static;display:block;visibility:visible;");
		var newCommentContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right");
		var path = chrome.extension.getURL("images/del.gif");
		closeButton1.setAttribute("src", path);
		newCommentContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newCommentContainer.parentNode.removeChild(newCommentContainer);
			commentLink.focus();
		}, false);
		newCommentContainer.appendChild(commentDiv);
		var replyScript0 = doc.createElement('script');
		replyScript0.setAttribute("type", "text/javascript");
		replyScript0.setAttribute("language", "JavaScript");
		replyScript0.setAttribute("src", "http://l-stat.livejournal.com/js/x_core.js");
		newCommentContainer.appendChild(replyScript0);
		var replyScript1 = doc.createElement('script');
		replyScript1.setAttribute("type", "text/javascript");
		replyScript1.setAttribute("language", "JavaScript");
		replyScript1.setAttribute("src", "http://l-stat.livejournal.com/js/quickreply.js");
		newCommentContainer.appendChild(replyScript1);
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		var path = chrome.extension.getURL("images/del.gif");
		closeButton2.setAttribute("src", path);
		newCommentContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newCommentContainer.parentNode.removeChild(newCommentContainer);
			commentLink.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newCommentContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newCommentContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newCommentContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newCommentContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newCommentContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newCommentContainer);
		}
		else {
			newCommentContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			if(commentLink.parentNode.tagName.toLowerCase() == "td")
			{
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				td.colSpan = 2;
				tr.appendChild(td);
                if(commentLink.parentNode.parentNode.bgColor)
                    tr.bgColor = commentLink.parentNode.parentNode.bgColor;
				commentLink.parentNode.parentNode.parentNode.appendChild(tr);
				throbber.parentNode.removeChild(throbber);
				td.appendChild(newCommentContainer);
			}
			else
				commentLink.parentNode.replaceChild(newCommentContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newCommentContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddAddInsetBlock(body) {
	var optList = decodeURI(insets).split("\x0c");
	if (!optList[0]) {
		return;
	}
	var doc = body.ownerDocument.defaultView.top.document;
	body = doc.body;
	var insetBlock = doc.getElementById("ljaddInsetBlock") || doc.insetBlock;
	if (!insetBlock) {
		var textFields = doc.evaluate(
			".//*[translate(name(),'TEXAR','texar')='textarea' or translate(name(),'INPUT','input')='input' and (@type='text' or @type='textbox' or not(@type))]",
			body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
		);
		if (!textFields.snapshotLength) {
			return;
		}
		var place = addInsetBlockPlace;//ljaddPrefMainBranch.getIntPref("ljaddAddInsetBlockPlace");
		insetBlock = doc.createElement("div");
		insetBlock.id = "ljaddInsetBlock";
		for (var i = 0, arrayLength = optList.length; i < arrayLength; i++) {
			var items = optList[i].split("\x0b");
			var inset = doc.createElement("button");
			inset.id = "ljaddInsetBlock_" + i;
			inset.type = "button";
			inset.setAttribute("style", "padding:1px 2px;background-color:white;border:1px solid black;-webkit-border-radius:5px;cursor:pointer;");
			if (items[2]) {
				var img = doc.createElement("img");
				img.setAttribute("src", items[2]);
				img.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-right:1px");
				inset.appendChild(img);
			}
			if (items[2] && items[3]) {
				inset.setAttribute("title", items[0] + ": " + items[1]);
			}
			else {
				inset.appendChild(doc.createTextNode(items[0]));
				inset.setAttribute("title", items[1]);
			}
			insetBlock.appendChild(inset);
			if (place < 2) {
				inset.style.margin = "5px 1px";
			}
			else if (place < 4) {
				inset.style.margin = "1px 5px";
				insetBlock.appendChild(doc.createElement("br"));
			}
			else {
				inset.style.margin = "1px";
			}
			inset.addEventListener("click", ljaddInset, false);
		}
		if (place < 4) {
			insetBlock.setAttribute("style", "position:fixed;margin:0px;padding:0px;overflow:hidden;background-color:rgb(74,123,181);border:0px none;text-align:center;z-index:1000;");
			if (place == 0) {
				insetBlock.style.top = "0px";
				insetBlock.style.left = "0px";
				insetBlock.style.width = "100%";
				insetBlock.style.height = "5px";
			}
			else if (place == 1) {
				insetBlock.style.bottom = "0px";
				insetBlock.style.left = "0px";
				insetBlock.style.width = "100%";
				insetBlock.style.height = "5px";
			}
			else if (place == 2) {
				insetBlock.style.top = "0px";
				insetBlock.style.left = "0px";
				insetBlock.style.width = "5px";
				insetBlock.style.height = "100%";
			}
			else if (place == 3) {
				insetBlock.style.top = "0px";
				insetBlock.style.right = "0px";
				insetBlock.style.width = "5px";
				insetBlock.style.height = "100%";
			}
		}
		else {
			insetBlock.setAttribute("style", "margin:1px;padding:0px;background-color:rgb(74,123,181);border:0px none;text-align:center;z-index:1000;");
		}
		insetBlock.style.display = "none";
		body.appendChild(insetBlock);
		doc.insetBlock = insetBlock;
		insetBlock.addEventListener("mouseover", ljaddInsetBlockFocus, false);
		insetBlock.addEventListener("mouseout", ljaddInsetBlockBlur, false);
	}
}
/*************************************************************************************************/
function ljaddInsetBlockFocus() {
	this.setAttribute("ljaddInsetBlockFocused", "true");
	var place = addInsetBlockPlace;//ljaddPrefMainBranch.getIntPref("ljaddAddInsetBlockPlace");
	if (place < 4) {
		var insetBlock = this;
		var doc = this.ownerDocument.defaultView.top.document;
		if (
			doc.textField &&
			doc.textField.getAttribute("ljaddThisTextFieldFocused") == "true"
		) {
			insetBlock.setAttribute("ljaddInsetBlockStatus", "mouseover");
			window.setTimeout(function() {
				if (insetBlock.getAttribute("ljaddInsetBlockStatus") == "mouseover") {
					if (place < 2) {
						insetBlock.style.height = "auto";
					}
					else if (place < 4) {
						insetBlock.style.width = "auto";
					}
				}
			}, 100);
		}
	}
}
/*************************************************************************************************/
function ljaddInsetBlockBlur(event) {
	this.setAttribute("ljaddInsetBlockFocused", "false");
	var place = addInsetBlockPlace; //ljaddPrefMainBranch.getIntPref("ljaddAddInsetBlockPlace");
	if (place < 4) {
		var insetBlock = this;
		if (!event.relatedTarget || event.relatedTarget.parentNode.id != "ljaddInsetBlock" && event.relatedTarget.id != "ljaddInsetBlock") {
			insetBlock.setAttribute("ljaddInsetBlockStatus", "mouseout");
			window.setTimeout(function() {
				if (insetBlock.getAttribute("ljaddInsetBlockStatus") == "mouseout") {
					if (place < 2) {
						insetBlock.style.height = "5px";
					}
					else if (place < 4) {
						insetBlock.style.width = "5px";
					}
				}
			}, 100);
		}
	}
}
/*************************************************************************************************/
function ljaddBindTextField() {
	var doc = this.ownerDocument.defaultView.top.document;
	var insetBlock = doc.getElementById("ljaddInsetBlock") || doc.insetBlock;
	insetBlock.setAttribute("ljaddSomeTextFieldFocused", "true");
	var place = addInsetBlockPlace; //ljaddPrefMainBranch.getIntPref("ljaddAddInsetBlockPlace");
	if (place == 4) {
		this.parentNode.insertBefore(insetBlock, this);
	}
	else {
		this.setAttribute("ljaddThisTextFieldFocused", "true");
	}
	insetBlock.style.display = "block";
	doc.textField = this;
}
/*************************************************************************************************/
function ljaddUnbindTextField() {
	var doc = this.ownerDocument.defaultView.top.document;
	var insetBlock = doc.getElementById("ljaddInsetBlock") || doc.insetBlock;
	insetBlock.setAttribute("ljaddSomeTextFieldFocused", "false");
	var place = addInsetBlockPlace; //ljaddPrefMainBranch.getIntPref("ljaddAddInsetBlockPlace");
	if (place < 4) {
		this.setAttribute("ljaddThisTextFieldFocused", "false");
	}
	if (insetBlock.getAttribute("ljaddInsetBlockFocused") != "true") {
		if (place < 4) {
			insetBlock.style.display = "none";
		}
		else {
			window.setTimeout(function() {
				if (insetBlock.getAttribute("ljaddSomeTextFieldFocused") != "true") {
					insetBlock.style.display = "none";
				}
			}, 300);
		}

	}
}
/*************************************************************************************************/
function ljaddInset(insetIndex, textField) {
	var textField;
	if (typeof insetIndex != "number" && typeof insetIndex != "string") {
		var doc = document;//this.ownerDocument.defaultView.top.document;
		textField = doc.textField;
		if (!textField) {
			return;
		}
		insetIndex = Number(this.id.replace(/ljaddInsetBlock_/, ""));
	}
	/*else {
		textField = gContextMenu.target;
	}*/
	var texareaValue = textField.value;
	var selStart = textField.selectionStart;
	var selEnd = textField.selectionEnd;
	var scrollY = textField.scrollTop;
	var scrollX = textField.scrollLeft;
	var inset = "";
	if (typeof insetIndex == 'number') {
		var optList = decodeURI(insets).split("\x0c");
		inset = optList[insetIndex].split("\x0b")[1];
		if (inset.search(/\^/) > -1) {
			var clipboardString = "";
			var selText = "";
			var randomQuote = "";
			var FoxyTunesTitle = "";
			//try {FoxyTunesTitle = foxytunesGetCurrentTrackTitle().replace(/^FoxyTunes|Idle$/, "");} catch(err) {}
			//ljaddClipboardService.getData(ljaddTransferService, Components.interfaces.nsIClipboard.kGlobalClipboard);
			var str = new Object(), strLength = new Object();
/*			try {
				ljaddTransferService.getTransferData("text/unicode", str, strLength);
				if (str) {
					str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
				}
				if (str) {
					clipboardString = str.data.substring(0, strLength.value / 2).replace(/\^/g, "\x0c");
				}
			} catch (ex) {
				;
			}*/

			if (inset.search(/\^\^/) > -1) {
				selText = texareaValue.substring(selStart, selEnd).replace(/\^/g, "\x0c");
				if (inset.search(/\^\^\^/) > -1) {
					randomQuote = ljaddRandomQuotes[Math.floor(Math.random() * ljaddRandomQuotes.length)].replace(/\^/g, "\x0c");
				}
			}
			inset = inset
				.replace(/\\\^/g, "\x0c")
				.replace(/\^\^\^\^/g, FoxyTunesTitle)
				.replace(/\^\^\^/g, randomQuote)
				.replace(/\^\^/g, selText)
				.replace(/\^/g, clipboardString)
				.replace(/\x0c/g, "^");
		}
	}
	else {
		inset = "<lj user='" + insetIndex + "'>";
	}
	textField.value = texareaValue.substring(0, selStart) + inset + texareaValue.substring(selEnd, texareaValue.length);
	textField.selectionStart = textField.selectionEnd = selStart + inset.length;
	textField.scrollTop = scrollY;
	textField.scrollLeft = scrollX;
	/*if (ljaddPrefMainBranch.getIntPref("auto.ljaddTextAuto") == 2) {
		ljaddChangeField(textField);
	}*/
	textField.focus();
    if(event)
    {
        event.preventDefault();
        return false;
    }
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddProcessImages(block) {
	var doc = block.ownerDocument;
	var images = doc.evaluate(
		".//img",
		block,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	if (images.snapshotLength) {
		var triggers = (ljStorage["livejournal_addons.ljaddAddTriggersImagesOpt"] == "false") ? false : true;
		if(triggers)
			ljaddAddTriggers(doc, false, images);

		var ljaddFrPgURL = decodeURI(ljStorage["livejournal_addons.ljaddMainURL"]);
		if(ljaddFrPgURL.lastIndexOf("/") == ljaddFrPgURL.length - 1)
			ljaddFrPgURL += "friends";
		else
			ljaddFrPgURL += "/friends";
		if (ljStorage["livejournal_addons.ljaddFriendsPageMaxWidthOpt"] == "true"
			&&
			doc.location.href.indexOf(ljaddFrPgURL) > -1
		) {
			for(var i=0, img; img = images.snapshotItem(i); i++) {
				if (img.hasAttribute("height") && img.getAttribute("height") <= 1 || img.hasAttribute("width") && img.getAttribute("width") <= 1) {
					continue;
				}
				img.style.maxWidth = (ljStorage["livejournal_addons.ljaddFriendsPageMaxWidth"] + "px");
				if (img.hasAttribute("height")) {
					img.style.maxHeight = (img.getAttribute("height") + "px");
					img.removeAttribute("height");
				}
				if (img.style.height) {
					img.style.maxHeight = img.style.height;
					img.style.height = null;
				}
			}
		}
	}
	if (ljaddRandomizeUserpics == "true") {
		var userpicSelector = doc.evaluate(
			".//select[@id='prop_picture_keyword' or @name='prop_picture_keyword']",
			block,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (userpicSelector) {
			var userpicSelectorOptionsNum = userpicSelector.options.length;
			if (userpicSelectorOptionsNum) {
				var num =  Math.floor(Math.random() * userpicSelectorOptionsNum);
				userpicSelector.selectedIndex = num;
				var evt = doc.createEvent("HTMLEvents");
				evt.initEvent("change", true, false);
				userpicSelector.dispatchEvent(evt);

				window.addEventListener("load",
					function(){
						var userpicSelector = document.getElementsByName("prop_picture_keyword")[0];
						if(userpicSelector.selectedIndex != num)
						{
							userpicSelector.selectedIndex = num;
							var evt = doc.createEvent("HTMLEvents");
							evt.initEvent("change", true, false);
							userpicSelector.dispatchEvent(evt);
						}
					}, false);
			}
		}
	}
}
/*************************************************************************************************/
function ljaddUnfoldComments(event, block, allPages) {
/*	var unfoldStyle;
	if (ljaddPrefMainBranch.getIntPref("ljaddUnfoldPageStyle") == 0) {
		unfoldStyle = "style=mine";
	}
	else {
		unfoldStyle = "light";
	}
	var targetLocation;
	if (event) {
		var target = event.target;
		if (target.id == "ljaddUnfoldAllPagesTrigger") {
			targetLocation = target.ownerDocument.triggersLink.href;
			allPages = true;
		}
		else if (target.id == "ljaddUnfoldPageTrigger") {
			targetLocation = target.ownerDocument.triggersLink.href;
			allPages = false;
		}
		else if (target.id == "ljaddUnfoldPageButton") {
			ljaddUnfoldPageCommentsInit(false, target.ownerDocument);
			return;
		}
		else if (target.id == "ljaddUnfoldAllPagesButton") {
			ljaddUnfoldAllPagesInit(false, target.ownerDocument);
			return;
		}
		else {
			targetLocation = gContextMenu.linkURL;
		}
		targetLocation = ljaddChangeLocation(targetLocation, unfoldStyle, false);
		var postBrowser;
		if (event.ctrlKey || event.metaKey) {
			postBrowser = gBrowser.selectedBrowser;
		}
		else {
			postBrowser = gBrowser.getBrowserForTab(gBrowser.addTab());
		}
		if (allPages) {
			postBrowser.addEventListener("load", ljaddUnfoldAllPagesInit, true);
		}
		else {
			postBrowser.addEventListener("load", ljaddUnfoldPageCommentsInit, true);
		}
		postBrowser.loadURI(targetLocation);
	}
	else
	*/

	var doc;
	if(event)
	{
		var target = event.target;
		doc = target.ownerDocument;
		if (target.id == "ljaddUnfoldAllPagesTrigger") {
			targetLocation = target.ownerDocument.triggersLink.href;
			allPages = true;
		}
		else if (target.id == "ljaddUnfoldPageTrigger") {
			targetLocation = target.ownerDocument.triggersLink.href;
			allPages = false;
		}
		else if (target.id == "ljaddUnfoldPageButton") {
			ljaddUnfoldPageCommentsInit(false, target.ownerDocument);
			return;
		}
		else if (target.id == "ljaddUnfoldAllPagesButton") {
			ljaddUnfoldAllPagesInit(false, target.ownerDocument);
			return;
		}
	}
	else
		doc = block.ownerDocument;

	{
		var body = doc.body;
		targetLocation = window.location;
		if (targetLocation.href.search(/http:\/\/.+?\.livejournal.com/i) == -1) {
			alert(Strings.wrongURL);
			return;
		}
		var correctComment = doc.evaluate(
			".//div[@id='Comments']//table[@class='talk-comment']",
			body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (correctComment) {
			if (targetLocation.href.search(/\/\d+\.html\b/i) > -1) {
				if (allPages) {
					ljaddUnfoldAllPagesInit(false, doc);
				}
				else {
					ljaddUnfoldPageCommentsInit(false, doc);
				}
			}
			else {
				if (allPages) {
					ljaddUnfoldAllPagesInit(true, doc);
				}
				else {
					ljaddUnfoldPageCommentsInit(true, doc);
				}
			}
		}
		/*else if (targetLocation.href.search(/\/\d+\.html\b/i) > -1) {
			if (allPages) {
				gBrowser.selectedBrowser.addEventListener("load", ljaddUnfoldAllPagesInit, true);
			}
			else {
				gBrowser.selectedBrowser.addEventListener("load", ljaddUnfoldPageCommentsInit, true);
			}
			ljaddChangeLocation(targetLocation, unfoldStyle, false);
		}*/
	}
}
/*************************************************************************************************/
function ljaddUnfoldAllPagesInit(forceLight, doc) {
	if (arguments.length < 2) {
		this.removeEventListener("load", ljaddUnfoldAllPagesInit, true);
		forceLight = false;
		doc = this.contentDocument;
	}
	var body = doc.body;
	 var counterDiv = doc.getElementById("livejournal_addons_counterDiv");
	if (counterDiv) {
		alert(Strings.noMultipleUnfolding);
		return;
	}
	var pageLinksContainers = doc.evaluate(
		".//div[@id='Comments']//table[not(@class='talk-comment')]//td[a[contains(@href, 'page=')]and span]",
		body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	if (!pageLinksContainers.snapshotLength) {
		ljaddUnfoldPageCommentsInit(forceLight, doc);
	}
	else {
		counterDiv = doc.createElement("div");
		counterDiv.id = "livejournal_addons_counterDiv";
		counterDiv.setAttribute("style", "padding:5px;position:fixed;right:5px;top:5px;background-color:white;color:black;border:1px solid black;z-index:1000");
		counterDiv.innerHTML =
			"<img id='livejournal_addons_Stop' style='border:0px none;vertical-align:text-top;margin-right:5px' src='" + chrome.extension.getURL("images/stop.png") + "'>" +
			"<img style='border:0px none;vertical-align:text-top;margin-right:5px' src='" + chrome.extension.getURL("images/throbber.gif") + "'>" +
			Strings.loading +
			"... #<span id='livejournal_addons_counterSpan'></span>";
		body.appendChild(counterDiv);
		var container = doc.createElement('div');
		container.style.display = 'none';
		container.id = "livejournal_addons_UnfoldAllContainer";
		body.appendChild(container);
		doc.getElementById("livejournal_addons_Stop").addEventListener("click", function() {
			this.setAttribute("src", chrome.extension.getURL("images/stopped.png"));
			this.setAttribute("ljaddStopUnfolding", "true");
		}, false);
		ljaddUnfoldAllPagesProcessContainers(forceLight, doc, pageLinksContainers, 0);
	}
}
/*************************************************************************************************/
function ljaddUnfoldAllPagesProcessContainers(forceLight, doc, pageLinksContainers, containersNumber) {
	var body = doc.body;
	var counterDiv = doc.getElementById("livejournal_addons_counterDiv");
	var container = doc.getElementById("livejournal_addons_UnfoldAllContainer");
	if (!counterDiv || !container) {
		return;
	}
	if (containersNumber < pageLinksContainers.snapshotLength) {
		var pageLinksContainer = pageLinksContainers.snapshotItem(containersNumber);
		ljaddUnfoldAllPagesProcessLinks(forceLight, doc, pageLinksContainer, 0, pageLinksContainers, containersNumber);
	}
	else {
		body.removeChild(counterDiv);
		body.removeChild(container);
		ljaddUnfoldPageCommentsInit(forceLight, doc);
	}
}
/*************************************************************************************************/
function ljaddUnfoldAllPagesProcessLinks(forceLight, doc, pageLinksContainer, page, pageLinksContainers, containersNumber) {
	var body = doc.body;
	var counterDiv = doc.getElementById("livejournal_addons_counterDiv");
	var container = doc.getElementById("livejournal_addons_UnfoldAllContainer");
	if (!counterDiv || !container) {
		return;
	}
	var stopper = doc.getElementById("livejournal_addons_Stop");
	var PageLinks = pageLinksContainer.getElementsByTagName("A");
	var PageLinksNum = pageLinksContainer.getElementsByTagName("A").length;
	if (stopper.hasAttribute("ljaddStopUnfolding")) {
		var commentsContainer = doc.evaluate(
			"ancestor::div[@id='Comments']",
			pageLinksContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue || body;
		ljaddProcessChangedBlock(commentsContainer);
		ljaddUnfoldAllPagesProcessContainers(forceLight, doc, pageLinksContainers, pageLinksContainers.snapshotLength);
		return;
	}
	else if (PageLinksNum == page) {
		var commentsContainer = doc.evaluate(
			"ancestor::div[@id='Comments']",
			pageLinksContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue || body;
		ljaddProcessChangedBlock(commentsContainer);
		ljaddUnfoldAllPagesProcessContainers(forceLight, doc, pageLinksContainers, containersNumber+2);
		return;
	}
	var commentPageURL = PageLinks[page].href;
	var counterSpan = doc.getElementById("livejournal_addons_counterSpan");
	counterSpan.textContent = (pageLinksContainers.snapshotLength/2 - containersNumber/2) + "." + (PageLinksNum - page);
	var mainContainer = doc.evaluate(
		"ancestor::div[@id='Comments']",
		pageLinksContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue;
	chrome.extension.sendRequest({url: commentPageURL}, function(response)
	{
		container.innerHTML = response.html;
		var pageComments = doc.evaluate(
			".//div[@id='Comments']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		while (pageComments.firstChild) {
			mainContainer.appendChild(pageComments.firstChild);
		}
		container.innerHTML = "";
		ljaddUnfoldAllPagesProcessLinks(forceLight, doc, pageLinksContainer, page+1, pageLinksContainers, containersNumber);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddUnfoldPageCommentsInit(forceLight, doc) {
	var markNewComments = false;
	if (arguments.length < 2) {
		this.removeEventListener("load", ljaddUnfoldPageCommentsInit, true);
		forceLight = false;
		doc = this.contentDocument;
		if (this.ljaddMarkNewComments) {
			markNewComments = this.ljaddMarkNewComments;
			this.removeAttribute("ljaddMarkNewComments");
		}
	}
	var body = doc.body;
	var counterDiv = doc.getElementById("livejournal_addons_counterDiv");
	if (counterDiv) {
		alert(Strings.noMultipleUnfolding);
		return;
	}
	var firstFoldedComment = doc.evaluate(
			".//div[@id='Comments']//table[not(@class='talk-comment') and descendant::a[contains(@href, 'thread=')] and not(descendant::span[contains(@class, 'ljuser') and contains(@style, 'line-through') and descendant::a[@href]])]",
		body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue;
	if(!firstFoldedComment) {
		if (markNewComments) {
			for (var i=0, arrayLength = markNewComments.length; i < arrayLength; i++) {
				if (doc.getElementById("ljcmt" + markNewComments[i])) {
					doc.getElementById("ljcmt" + markNewComments[i]).getElementsByTagName("table")[0].style.backgroundColor = "#aaaaaa";//ljaddPrefMainBranch.getComplexValue("ljaddNewComentsBgColor", ljaddSupportsString).data;
				}
			}
			doc.location.hash = "#t" + markNewComments[0];
		}
		if (body.className == "ljaddExport") {
			ljaddExportSaveEntryEnd();
		}
		return;
	}
	counterDiv = doc.createElement("div");
	counterDiv.id = "livejournal_addons_counterDiv";
	counterDiv.setAttribute("style", "padding:5px;position:fixed;right:5px;top:5px;background-color:white;color:black;border:1px solid black;z-index:1000");
	counterDiv.innerHTML =
		"<img id='livejournal_addons_Stop' style='border:0px none;vertical-align:text-top;margin-right:5px' src='" + chrome.extension.getURL("images/stop.png") + "'>" +
		"<img style='border:0px none;vertical-align:text-top;margin-right:5px' src='" + chrome.extension.getURL("images/throbber.gif") + "'>" +
		Strings.loading +
		"... <span id='livejournal_addons_counterSpan'></span>";
	body.appendChild(counterDiv);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = "livejournal_addons_UnfoldAllContainer";
	body.appendChild(container);
	doc.getElementById("livejournal_addons_Stop").addEventListener("click", function() {
		this.setAttribute("src", chrome.extension.getURL("images/stopped.png"));
		this.setAttribute("ljaddStopUnfolding", "true");
	}, false);
	ljaddUnfoldPageCommentsProcessTree(doc, markNewComments, forceLight);
}
/*************************************************************************************************/
function ljaddUnfoldPageCommentsProcessTree(doc, markNewComments, forceLight) {
	var body = doc.body;
	var counterDiv = doc.getElementById("livejournal_addons_counterDiv");
	var container = doc.getElementById("livejournal_addons_UnfoldAllContainer");
	if (!counterDiv || !container) {
		return;
	}
	var stopper = doc.getElementById("livejournal_addons_Stop");
	var firstFoldedComment = doc.evaluate(
			".//div[@id='Comments']//table[not(@class='talk-comment') and descendant::a[contains(@href, 'thread=')] and not(descendant::span[contains(@class, 'ljuser') and contains(@style, 'line-through') and descendant::a[@href]])]",
		body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
	).singleNodeValue;
	if(stopper.hasAttribute("ljaddStopUnfolding") || !firstFoldedComment) {
		body.removeChild(counterDiv);
		body.removeChild(container);
		if (markNewComments) {
			for (var i=0, arrayLength = markNewComments.length; i < arrayLength; i++) {
				if (doc.getElementById("ljcmt" + markNewComments[i])) {
					doc.getElementById("ljcmt" + markNewComments[i]).getElementsByTagName("table")[0].style.backgroundColor = "#aaaaaa";//ljaddPrefMainBranch.getComplexValue("ljaddNewComentsBgColor", ljaddSupportsString).data;
				}
			}
			doc.location.hash = "#t" + markNewComments[0];
		}
		ljaddProcessChangedBlock(body);
		if (body.className == "ljaddExport") {
			ljaddExportSaveEntryEnd();
		}
		return;
	}
	var counterSpan = doc.getElementById("livejournal_addons_counterSpan");
	counterSpan.textContent = doc.evaluate(
			".//div[@id='Comments']//table[not(@class='talk-comment') and descendant::a[contains(@href, 'thread=')] and not(descendant::span[contains(@class, 'ljuser') and contains(@style, 'line-through') and descendant::a[@href]])]",
		body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	).snapshotLength;
	var throbber = doc.createElement("span");
	throbber.innerHTML = "<img style='border:0px none;vertical-align:text-bottom;margin-right:5px' src='" + chrome.extension.getURL("images/throbber.gif") + "'>";
	firstFoldedComment.getElementsByTagName("tr")[0].getElementsByTagName("td")[0].insertBefore(
		throbber,
		firstFoldedComment.getElementsByTagName("img")[0].nextSibling
	);
	firstFoldedComment.style.backgroundColor = "silver";
	var firstFoldedCommentLink = firstFoldedComment.getElementsByTagName("a")[0];
	/*if (forceLight || doc.location.href.search(/(?:&|\?)(?:format=light|usescheme=lynx)(?:&|#|$)/i) > -1) {
		ljaddChangeLocation(firstFoldedCommentLink, "light", false);
	}
	else if (doc.location.href.search(/(?:&|\?)style=mine(?:&|#|$)/i) > -1) {
		ljaddChangeLocation(firstFoldedCommentLink, "style=mine", false);
	}*/
	chrome.extension.sendRequest({url: firstFoldedCommentLink.href}, function(response)
	{
		container.innerHTML = response.html.replace(/<iframe[\s\S]+?(?:<\/iframe>|\/>)/ig, "");
		ljaddUnfoldReplaceComments(container, firstFoldedComment, false);
		ljaddUnfoldPageCommentsProcessTree(doc, markNewComments, forceLight);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddAddTriggers(doc, links, images) {
	var doc = doc.defaultView.top.document;
	var triggers = doc.getElementById("ljaddTriggers");
	if (!triggers) {
		triggers = doc.createElement("div");
		triggers.id = "ljaddTriggers";
		triggers.setAttribute("style", "position:fixed;top:0px;left:0px;background-color:white;border:1px solid black;-webkit-border-radius:5px;padding:10px;margin:10px;text-align:center;z-index:20000;");
		triggers.setAttribute("ljaddTriggersStatus", "mouseout");
		triggers.style.display = "none";
		doc.body.appendChild(triggers);
		triggers.addEventListener("mouseover", function() {
			this.setAttribute("ljaddTriggersStatus", "mouseover");
		}, false);
		triggers.addEventListener("click", function() {
			this.style.display = "none";
			this.setAttribute("ljaddTriggersStatus", "mouseout");
		}, false);
		triggers.addEventListener("mouseout", function(event) {
			if (!event.relatedTarget || event.relatedTarget.parentNode.id != "ljaddTriggers" && event.relatedTarget.id != "ljaddTriggers") {
				this.style.display = "none";
				this.setAttribute("ljaddTriggersStatus", "mouseout");
			}
		}, false);
		var loadEntryHereTrigger = doc.createElement('img');
		loadEntryHereTrigger.id = "ljaddLoadEntryHereTrigger";
		loadEntryHereTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		loadEntryHereTrigger.setAttribute("src", chrome.extension.getURL("images/read.png"));
		loadEntryHereTrigger.setAttribute("title", Strings.loadEntryHere + " " + Strings.floatTip);
		triggers.appendChild(loadEntryHereTrigger);
		loadEntryHereTrigger.addEventListener("click", ljaddLoadEntryHere, false);
		var editMyEntryTrigger = doc.createElement('img');
		editMyEntryTrigger.id = "ljaddEditMyEntryTrigger";
		editMyEntryTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		editMyEntryTrigger.setAttribute("src", chrome.extension.getURL("images/ljnew.gif"));
		editMyEntryTrigger.setAttribute("title", Strings.editMyEntry + " " + Strings.currentTabTip);
		triggers.appendChild(editMyEntryTrigger);
		editMyEntryTrigger.addEventListener("click", ljaddEditMyEntry, false);
		var editPostTagsTrigger = doc.createElement('img');
		editPostTagsTrigger.id = "ljaddEditPostTagsTrigger";
		editPostTagsTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		editPostTagsTrigger.setAttribute("src", chrome.extension.getURL("images/editposttags.gif"));
		editPostTagsTrigger.setAttribute("title", Strings.editPostTags + " " + Strings.floatTip);
		triggers.appendChild(editPostTagsTrigger);
		editPostTagsTrigger.addEventListener("click", ljaddEditPostTags, false);
		var replyTrigger = doc.createElement('img');
		replyTrigger.id = "ljaddReplyTrigger";
		replyTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		replyTrigger.setAttribute("src", chrome.extension.getURL("images/reply.gif"));
		replyTrigger.setAttribute("title", Strings.replyHere + " " + Strings.floatTip);
		triggers.appendChild(replyTrigger);
		replyTrigger.addEventListener("click", ljaddReplyHere, false);
		var commentsTrigger = doc.createElement('img');
		commentsTrigger.id = "ljaddCommentsTrigger";
		commentsTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		commentsTrigger.setAttribute("src", chrome.extension.getURL("images/mnew.gif"));
		commentsTrigger.setAttribute("title", Strings.loadComments + " " + Strings.floatTip);
		triggers.appendChild(commentsTrigger);
		commentsTrigger.addEventListener("click", ljaddLoadCommentsHere, false);
		var memTrigger = doc.createElement('img');
		memTrigger.id = "ljaddMemTrigger";
		memTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		memTrigger.setAttribute("src", chrome.extension.getURL("images/memadd.png"));
		memTrigger.setAttribute("title", Strings.memaddHere + " " + Strings.floatTip);
		triggers.appendChild(memTrigger);
		memTrigger.addEventListener("click", ljaddMemaddHere, false);
		var subscribeTrigger = doc.createElement('img');
		subscribeTrigger.id = "ljaddSubscribeTrigger";
		subscribeTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		subscribeTrigger.setAttribute("src", chrome.extension.getURL("images/subscr.gif"));
		subscribeTrigger.setAttribute("title", Strings.subscribeHere + " " + Strings.floatTip);
		triggers.appendChild(subscribeTrigger);
		subscribeTrigger.addEventListener("click", ljaddSubscribeHere, false);
		var threadTrigger = doc.createElement('img');
		threadTrigger.id = "ljaddThreadTrigger";
		threadTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		threadTrigger.setAttribute("src", chrome.extension.getURL("images/wcalm.gif"));
		threadTrigger.setAttribute("title", Strings.watchThread);
		triggers.appendChild(threadTrigger);
		//threadTrigger.addEventListener("click", ljaddWatchThread, false);
		var toFlat1Trigger = doc.createElement('img');
		toFlat1Trigger.id = "ljaddToFlat1Trigger";
		toFlat1Trigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		toFlat1Trigger.setAttribute("src", chrome.extension.getURL("images/flat1.gif"));
		toFlat1Trigger.setAttribute("title", Strings.toFlat1 + " " + Strings.currentTabTip);
		triggers.appendChild(toFlat1Trigger);
		toFlat1Trigger.addEventListener("click", ljaddChangeCommentFormat, false);
		var toFlatNTrigger = doc.createElement('img');
		toFlatNTrigger.id = "ljaddToFlatNTrigger";
		toFlatNTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		toFlatNTrigger.setAttribute("src", chrome.extension.getURL("images/flatn.gif"));
		toFlatNTrigger.setAttribute("title",  Strings.toFlatN + " " + Strings.currentTabTip);
		triggers.appendChild(toFlatNTrigger);
		toFlatNTrigger.addEventListener("click", ljaddChangeCommentFormat, false);
		var toTreeTrigger = doc.createElement('img');
		toTreeTrigger.id = "ljaddToTreeTrigger";
		toTreeTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		toTreeTrigger.setAttribute("src", chrome.extension.getURL("images/tree.png"));
		toTreeTrigger.setAttribute("title",  Strings.toTree + " " + Strings.currentTabTip);
		triggers.appendChild(toTreeTrigger);
		toTreeTrigger.addEventListener("click", ljaddChangeCommentFormat, false);
		var unfoldPageTrigger = doc.createElement('img');
		unfoldPageTrigger.id = "ljaddUnfoldPageTrigger";
		unfoldPageTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		unfoldPageTrigger.setAttribute("src", chrome.extension.getURL("images/unfold.png"));
		unfoldPageTrigger.setAttribute("title", Strings.unfoldPageComments + " " + Strings.currentTabTip);
		triggers.appendChild(unfoldPageTrigger);
		unfoldPageTrigger.addEventListener("click", ljaddUnfoldComments, false);
		var unfoldAllPagesTrigger = doc.createElement('img');
		unfoldAllPagesTrigger.id = "ljaddUnfoldAllPagesTrigger";
		unfoldAllPagesTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		unfoldAllPagesTrigger.setAttribute("src", chrome.extension.getURL("images/unfoldpp.png"));
		unfoldAllPagesTrigger.setAttribute("title", Strings.unfoldAllPages + " " + Strings.currentTabTip);
		triggers.appendChild(unfoldAllPagesTrigger);
		unfoldAllPagesTrigger.addEventListener("click", ljaddUnfoldComments, false);
		var linkSearchTrigger = doc.createElement('img');
		linkSearchTrigger.id = "ljaddLinkSearchTrigger";
		linkSearchTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		linkSearchTrigger.setAttribute("src", chrome.extension.getURL("images/linksearch.png"));
		linkSearchTrigger.setAttribute("title", Strings.linkSearchTitle);
		triggers.appendChild(linkSearchTrigger);
		linkSearchTrigger.addEventListener("click", ljaddLinkSearch, false);
		var profileTrigger = doc.createElement('img');
		profileTrigger.id = "ljaddProfileTrigger";
		profileTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		profileTrigger.setAttribute("src", chrome.extension.getURL("images/fnew.gif"));
		profileTrigger.setAttribute("title", Strings.profileHere);
		triggers.appendChild(profileTrigger);
		profileTrigger.addEventListener("click", ljaddProfileHere, false);
		var addFriendTrigger = doc.createElement('img');
		addFriendTrigger.id = "ljaddAddFriendTrigger";
		addFriendTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		addFriendTrigger.setAttribute("src", chrome.extension.getURL("images/fadd.gif"));
		addFriendTrigger.setAttribute("title", Strings.addFriendHere);
		triggers.appendChild(addFriendTrigger);
		addFriendTrigger.addEventListener("click", ljaddAddFriendHere, false);
		var reportBotTrigger = doc.createElement('img');
		reportBotTrigger.id = "ljaddReportBotTrigger";
		reportBotTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		reportBotTrigger.setAttribute("src", chrome.extension.getURL("images/bot.png"));
		reportBotTrigger.setAttribute("title", Strings.reportBotHere);
		triggers.appendChild(reportBotTrigger);
		reportBotTrigger.addEventListener("click", ljaddReportBotHere, false);
		var openFeedTrigger = doc.createElement('img');
		openFeedTrigger.id = "ljaddOpenFeedTrigger";
		openFeedTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		openFeedTrigger.setAttribute("src", chrome.extension.getURL("images/feed.png"));
		openFeedTrigger.setAttribute("title", Strings.openFeed);
		triggers.appendChild(openFeedTrigger);
		//openFeedTrigger.addEventListener("click", ljaddOpenFeed, false);
		var addEditUserTipTrigger = doc.createElement('img');
		addEditUserTipTrigger.id = "ljaddAddEditUserTipTrigger";
		addEditUserTipTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		addEditUserTipTrigger.setAttribute("src", chrome.extension.getURL("images/utip.png"));
		addEditUserTipTrigger.setAttribute("title", Strings.addEditUserTip);
		triggers.appendChild(addEditUserTipTrigger);
		addEditUserTipTrigger.addEventListener("click", ljaddAddEditUserTip, false);
		var browseImagesTrigger = doc.createElement('img');
		browseImagesTrigger.id = "ljaddBrowseImagesTrigger";
		browseImagesTrigger.setAttribute("style", "border:1px solid black;-webkit-border-radius:10%;margin:1px;padding:2px;cursor:pointer;");
		browseImagesTrigger.setAttribute("src", chrome.extension.getURL("images/images.gif"));
		browseImagesTrigger.setAttribute("title", Strings.browseImagesTrigger);
		triggers.appendChild(browseImagesTrigger);
		browseImagesTrigger.addEventListener("click", ljaddBrowseImages, false);
	}
	if (links) {
		for (var i = 0, curLink; curLink = links.snapshotItem(i); i++) {
			if (curLink.href.search(/http:\/\/.+?\.livejournal.com/i) == -1) {
				continue;
			}
			curLink.setAttribute("ljaddTriggersObjectStatus", "mouseout");
			curLink.addEventListener("mouseover", ljaddShowTriggers, false);
			curLink.addEventListener("mousedown", ljaddHideTriggersOnClick, false);
			curLink.addEventListener("mouseout", ljaddHideTriggers, false);
		}
	}
	else {
		var minWidth;
		if (ljaddMinImageWidthForBrowseOpt) {
			minWidth = ljaddMinImageWidthForBrowse;
		}
		else {
			minWidth = 2;
		}
		for (var i = 0, curImage; curImage = images.snapshotItem(i); i++) {
			if (
				curImage.height == 1 ||
				curImage.width == 1 ||
				(curImage.width > 1 && curImage.width < minWidth) ||
				curImage.parentNode.id == "ljaddTriggers" ||
				curImage.parentNode.parentNode.id == "ljaddInsetBlock" ||
				curImage.parentNode.id == "ljaddBrowseImagesDiv" ||
                curImage.className == "ljaddUnfolderImg"
			) {
				continue;
			}
			curImage.setAttribute("ljaddTriggersObjectStatus", "mouseout");
			curImage.addEventListener("mouseover", ljaddShowTriggers, false);
			curImage.addEventListener("mousedown", ljaddHideTriggersOnClick, false);
			curImage.addEventListener("mouseout", ljaddHideTriggers, false);
		}
	}
}
/*************************************************************************************************/
function ljaddShowTriggers(event) {
	var object = this;
	object.setAttribute("ljaddTriggersObjectStatus", "mouseover");
	var doc = object.ownerDocument.defaultView.top.document;
	var triggers = doc.getElementById("ljaddTriggers");
	var triggersChildren = triggers.childNodes;
	var eX = event.clientX;
	var eY = event.clientY;
	window.setTimeout(function() {
		var win = doc.defaultView;
		var withButton = false;
		if (object.tagName == "A") {
			var href = object.href;
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 ||
				href.indexOf("livejournal.com/tools/memadd.bml") > -1
			) {
				doc.getElementById("ljaddMemTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddMemTrigger").style.display = "none";
			}
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1
			) {
				doc.getElementById("ljaddReplyTrigger").style.display =
					doc.getElementById("ljaddLoadEntryHereTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddReplyTrigger").style.display =
					doc.getElementById("ljaddLoadEntryHereTrigger").style.display = "none";
			}
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 &&
				href.search(/\breplyto=/i) == -1
			) {
				doc.getElementById("ljaddToFlat1Trigger").style.display =
					doc.getElementById("ljaddToFlatNTrigger").style.display = "inline";
					//doc.getElementById("ljaddThreadTrigger").style.display = "inline";
				if (href.search(/[\?&]view=flat\b/i) > -1) {
					doc.getElementById("ljaddToTreeTrigger").style.display = "inline"
				}
				else {
					doc.getElementById("ljaddToTreeTrigger").style.display = "none"
				}
			}
			else {
				doc.getElementById("ljaddToFlat1Trigger").style.display =
					doc.getElementById("ljaddToFlatNTrigger").style.display =
					doc.getElementById("ljaddToTreeTrigger").style.display =
					doc.getElementById("ljaddThreadTrigger").style.display = "none";
			}
			doc.getElementById("ljaddThreadTrigger").style.display = "none";
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 &&
				href.search(/[\?&]thread=/i) == -1
			) {
				doc.getElementById("ljaddEditPostTagsTrigger").style.display ="inline";
			}
			else {
				doc.getElementById("ljaddEditPostTagsTrigger").style.display ="none";
			}
			if (
				href.search(/[\?&](?:thread=|replyto=)/i) == -1 &&
				(href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 ||
					href.indexOf("livejournal.com/manage/subscriptions/entry.bml") > -1)
			) {
				doc.getElementById("ljaddSubscribeTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddSubscribeTrigger").style.display = "none";
			}
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 &&
				href.search(/\bmode=reply\b|\breplyto=/i) == -1 &&
				win && win.location.href.search(/\blivejournal\.com\b.+\.html\b/i) == -1
			) {
				doc.getElementById("ljaddCommentsTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddCommentsTrigger").style.display = "none";
			}
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 &&
				href.search(/\bmode=reply\b|\breplyto=/i) == -1
			) {
				doc.getElementById("ljaddUnfoldPageTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddUnfoldPageTrigger").style.display = "none";
			}
			if (
				href.search(/\blivejournal\.com\b.+\.html\b/i) > -1 &&
				href.search(/\bmode=reply\b|\breplyto=/i) == -1 &&
				href.search(/[\?&]thread=/i) == -1
			) {
				doc.getElementById("ljaddUnfoldAllPagesTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddUnfoldAllPagesTrigger").style.display = "none";
			}
			doc.getElementById("ljaddLinkSearchTrigger").style.display = "inline";
			if (
				href.search(/\blivejournal\.com\b.*\/(?:profile|userinfo\.bml)\b(?!\/)/i) > -1
			) {
				doc.getElementById("ljaddProfileTrigger").style.display =
					doc.getElementById("ljaddAddFriendTrigger").style.display =
					doc.getElementById("ljaddReportBotTrigger").style.display = "inline";
					//doc.getElementById("ljaddOpenFeedTrigger").style.display =
					doc.getElementById("ljaddAddEditUserTipTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddProfileTrigger").style.display =
					doc.getElementById("ljaddAddFriendTrigger").style.display =
					doc.getElementById("ljaddReportBotTrigger").style.display =
					doc.getElementById("ljaddOpenFeedTrigger").style.display =
					doc.getElementById("ljaddAddEditUserTipTrigger").style.display ="none";
			}
			doc.getElementById("ljaddOpenFeedTrigger").style.display = "none";

			if (
				href.search(new RegExp(
					ljaddMainURL +
					"\\d+\\.html\\b", "i"
				)) > -1 &&
				href.search(/[\?&]thread=/i) == -1
			) {
				doc.getElementById("ljaddEditMyEntryTrigger").style.display = "inline";
			}
			else {
				doc.getElementById("ljaddEditMyEntryTrigger").style.display = "none";
			}
			var childImages = object.getElementsByTagName("img");
			if (childImages.length && childImages[0].getAttribute("ljaddTriggersObjectStatus") == "mouseover") {
				doc.getElementById("ljaddBrowseImagesTrigger").style.display = "inline";
				doc.ljaddBrowseImagesFromThis = childImages[0];
			}
			else {
				doc.getElementById("ljaddBrowseImagesTrigger").style.display = "none";
			}
			doc.triggersLink = object;
		}
		else {
			for (var i = 0, childrenNum = triggersChildren.length; i < childrenNum; i++) {
				triggersChildren[i].style.display = "none";
			}
			doc.getElementById("ljaddBrowseImagesTrigger").style.display = "inline";
			doc.ljaddBrowseImagesFromThis = object;
		}
		/*var ljaddHiddenFunctions = JSON.parse(ljaddPrefMainBranch.getComplexValue("ljaddHiddenFunctions", ljaddSupportsString).data);
		for (var prop in ljaddHiddenFunctions) {
			if (ljaddHiddenFunctions[prop] && prop.indexOf("Trigger") > -1) {
				doc.getElementById(prop).style.display = "none";
			}
		}*/
		for (var i = 0, childrenNum = triggersChildren.length; i < childrenNum; i++) {
			if (triggersChildren[i].style.display == "inline") {
				withButton = true;
				break;
			}
		}
		if (withButton && object.getAttribute("ljaddTriggersObjectStatus") == "mouseover") {
			if (eX <= win.innerWidth/2) {
				triggers.style.left = eX + "px";
				triggers.style.right = "auto";
			}
			else {
				triggers.style.right = (win.innerWidth - eX - (win.scrollMaxY? 16:0)) + "px";
				triggers.style.left = "auto";
			}
			if (eY <= win.innerHeight/2) {
				triggers.style.top = eY + "px";
				triggers.style.bottom = "auto";
			}
			else {
				triggers.style.bottom = (win.innerHeight - eY - (win.scrollMaxX? 16:0)) + "px";
				triggers.style.top = "auto";
			}
			triggers.style.display = "block";
            refreshDocument();
		}
	}, intervalShow);
}
/*************************************************************************************************/
function ljaddHideTriggersOnClick() {
	this.setAttribute("ljaddTriggersObjectStatus", "mousedown");
	var doc = this.ownerDocument.defaultView.top.document;
	var triggers = doc.getElementById("ljaddTriggers");
	if (triggers.style.display != "none") {
		triggers.style.display = "none";
		triggers.setAttribute("ljaddTriggersStatus", "mouseout");
        refreshDocument();
	}
}
/*************************************************************************************************/
function ljaddHideTriggers() {
	if (this.getAttribute("ljaddTriggersObjectStatus") != "mousedown") {
		var doc = this.ownerDocument.defaultView.top.document;
		var triggers = doc.getElementById("ljaddTriggers");
		window.setTimeout(function() {
			if (triggers.getAttribute("ljaddTriggersStatus") == "mouseout") {
				triggers.style.display = "none";
                refreshDocument();
			}
		}, intervalHide);
	}
	this.setAttribute("ljaddTriggersObjectStatus", "mouseout");
}
/*************************************************************************************************/
function ljaddMemaddHere(event) {
	var memaddLink;
	if (event.target.parentNode.id == "ljaddTriggers") {
		memaddLink = event.target.ownerDocument.triggersLink;
	}
	else {
		memaddLink = gContextMenu.target;
		while (memaddLink.parentNode && memaddLink.tagName != "A") {
			memaddLink = memaddLink.parentNode;
		}
	}
	var memaddURL = memaddLink.href;
	var journal, postId;
	if (memaddURL.indexOf("livejournal.com/tools/memadd.bml") > -1) {
		journal = memaddURL.replace(/^.+?[?&]journal=(\w+).*$/i, "$1");
		postId = memaddURL.replace(/^.+?[?&]itemid=(\d+).*$/i, "$1");
	}
	else {
		journal = ljaddGetUser(memaddURL);
		postId = memaddURL.replace(/^.+?\/(\d+)\.html\b.*$/i, "$1");
	}
	memaddURL =
		"http://www.livejournal.com/tools/memadd.bml?usescheme=lynx&journal="
		+ journal
		+ "&itemid="
		+ postId
	;
	var doc = memaddLink.ownerDocument;
	var containerId = "livejournal_addons_MemaddContainer_" + memaddURL.replace(/[^\w-]/g, "");
	var body = doc.body;
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	memaddLink.parentNode.insertBefore(throbber, memaddLink.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = containerId;
	body.appendChild(container);
	chrome.extension.sendRequest({url: memaddURL}, function(response)
	{
		container.innerHTML = response.html;
		var memaddForm = doc.evaluate(
			".//form[contains(@action, 'memadd.bml') and contains(@action, 'itemid=" + postId + "') and contains(@action, 'journal=" + journal + "')]",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!memaddForm) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			return;
		}
		memaddForm.setAttribute("accept-charset", "UTF-8");
		memaddForm.action = "http://www.livejournal.com/tools/memadd.bml?usescheme=lynx&itemid=" + postId + "&journal=" + journal;
		memaddForm.setAttribute("style", "position:static;display:block;visibility:visible;");
		var newMemaddContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newMemaddContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newMemaddContainer.parentNode.removeChild(newMemaddContainer);
			memaddLink.focus();
		}, false);
		newMemaddContainer.appendChild(memaddForm);
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			memaddForm.target = "_blank";
		}
		else*/ {
			memaddForm.addEventListener("submit", function() {
				if (!doc.getElementById(containerId + "_targetIframe")) {
					var targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = memaddForm.clientWidth;
					targetIframe.height = "200px";
					memaddForm.parentNode.insertBefore(targetIframe, memaddForm.nextSibling);
					memaddForm.target = targetIframe.name;
				}
			}, false);
		}
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newMemaddContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newMemaddContainer.parentNode.removeChild(newMemaddContainer);
			memaddLink.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newMemaddContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newMemaddContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newMemaddContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newMemaddContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newMemaddContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newMemaddContainer);
		}
		else {
			newMemaddContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			memaddLink.parentNode.replaceChild(newMemaddContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newMemaddContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddReplyHere(event) {
	var replyLink;
	if (event.target.parentNode.id == "ljaddTriggers") {
		replyLink = event.target.ownerDocument.triggersLink;
	}
	else {
		replyLink = gContextMenu.target;
		while (replyLink.parentNode && replyLink.tagName != "A") {
			replyLink = replyLink.parentNode;
		}
	}
	var replyURL = replyLink.href;
	replyURL = ljaddChangeLocation(replyURL,
		(replyURL.search(/[\?&]mode=reply\b/i) > -1)? "light" : "light&mode=reply",
	false);
	var doc = replyLink.ownerDocument;
	var body = doc.body;
	var containerId = "livejournal_addons_ReplyContainer_" + replyURL.replace(/[^\w-]/g, "");
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	replyLink.parentNode.insertBefore(throbber, replyLink.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = containerId;
	body.appendChild(container);
	chrome.extension.sendRequest({url: replyURL}, function(response)
	{
		container.innerHTML = response.html;
		var replyForm = doc.evaluate(
			".//form[@id = 'postform']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!replyForm) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			return;
		}
		replyForm.setAttribute("accept-charset", "UTF-8");
		replyForm.setAttribute("style", "position:static;display:block;visibility:visible;");
		var newReplyContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newReplyContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newReplyContainer.parentNode.removeChild(newReplyContainer);
			replyLink.focus();
		}, false);
		newReplyContainer.appendChild(replyForm);
		var replyScript0 = doc.createElement('script');
		replyScript0.setAttribute("type", "text/javascript");
		replyScript0.setAttribute("language", "JavaScript");
		replyScript0.setAttribute("src", "http://l-stat.livejournal.com/js/x_core.js");
		newReplyContainer.appendChild(replyScript0);
		var replyScript1 = doc.createElement('script');
		replyScript1.setAttribute("type", "text/javascript");
		replyScript1.setAttribute("language", "JavaScript");
		replyScript1.setAttribute("src", "http://l-stat.livejournal.com/js/quickreply.js");
		newReplyContainer.appendChild(replyScript1);
		var replyScript2 = doc.createElement('script');
		replyScript2.setAttribute("type", "text/javascript");
		replyScript2.setAttribute("language", "JavaScript");
		replyScript2.setAttribute("src", "http://l-stat.livejournal.com/js/talkpost.js");
		newReplyContainer.appendChild(replyScript2);
		var replyScript3 = doc.createElement('script');
		replyScript3.setAttribute("type", "text/javascript");
		replyScript3.setAttribute("language", "JavaScript");
		replyScript3.setAttribute("src", "http://l-stat.livejournal.com/js/md5.js");
		newReplyContainer.appendChild(replyScript3);
		var replyInlineScripts = doc.evaluate(
			".//script[descendant::text()]",
			container,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
		);
		for (var i=0, arrayLength = replyInlineScripts.snapshotLength; i < arrayLength; i++) {
			var textContent = replyInlineScripts.snapshotItem(i).textContent;
			if (textContent.indexOf("function sendForm") > -1) {
				var inlineScript = doc.createElement('script');
				inlineScript.setAttribute("type", "text/javascript");
				inlineScript.setAttribute("language", "JavaScript");
				inlineScript.textContent = textContent;
				newReplyContainer.appendChild(inlineScript);
				break;
			}
		}
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			replyForm.target = "_blank";
		}
		else*/ {
			replyForm.addEventListener("submit", function() {
				if (!doc.getElementById(containerId + "_targetIframe")) {
					var targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = replyForm.clientWidth;
					targetIframe.height = "200px";
					replyForm.parentNode.insertBefore(targetIframe, replyForm.nextSibling);
					replyForm.target = targetIframe.name;
				}
			}, false);
		}
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newReplyContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newReplyContainer.parentNode.removeChild(newReplyContainer);
			replyLink.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newReplyContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newReplyContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newReplyContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newReplyContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newReplyContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newReplyContainer);
		}
		else {
			newReplyContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			replyLink.parentNode.replaceChild(newReplyContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newReplyContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddSubscribeHere(event) {
	var subscribeLink;
	if (event.target.parentNode.id == "ljaddTriggers") {
		subscribeLink = event.target.ownerDocument.triggersLink;
	}
	else {
		subscribeLink = gContextMenu.target;
		while (subscribeLink.parentNode && subscribeLink.tagName != "A") {
			subscribeLink = subscribeLink.parentNode;
		}
	}
	var subscribeURL = subscribeLink.href;
	var journal, postId;
	if (subscribeURL.indexOf("livejournal.com/manage/subscriptions/entry.bml") > -1) {
		journal = subscribeURL.replace(/^.+?[?&]journal=(\w+).*$/i, "$1");
		postId = subscribeURL.replace(/^.+?[?&]itemid=(\d+).*$/i, "$1");
	}
	else {
		journal = ljaddGetUser(subscribeURL);
		postId = subscribeURL.replace(/^.+?\/(\d+)\.html\b.*$/i, "$1");
	}
	subscribeURL =
		"http://www.livejournal.com/manage/subscriptions/entry.bml?usescheme=lynx&journal="
		+ journal
		+ "&itemid="
		+ postId
	;
	var doc = subscribeLink.ownerDocument;
	var body = doc.body;
	var containerId = "livejournal_addons_SubscribeContainer_" + subscribeURL.replace(/[^\w-]/g, "");
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	subscribeLink.parentNode.insertBefore(throbber, subscribeLink.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = containerId;
	body.appendChild(container);
	chrome.extension.sendRequest({url: subscribeURL}, function(response)
	{
		container.innerHTML = response.html;
		var subscribeForm = doc.evaluate(
			".//form",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!subscribeForm) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			return;
		}
		subscribeForm.setAttribute("accept-charset", "UTF-8");
		subscribeForm.action = subscribeURL;
		subscribeForm.setAttribute("style", "position:static;display:block;visibility:visible;");
		var newSubscribeContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newSubscribeContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newSubscribeContainer.parentNode.removeChild(newSubscribeContainer);
			subscribeLink.focus();
		}, false);
		newSubscribeContainer.appendChild(subscribeForm);
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			subscribeForm.target = "_blank";
		}
		else*/ {
			subscribeForm.addEventListener("submit", function() {
				if (!doc.getElementById(containerId + "_targetIframe")) {
					var targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = subscribeForm.clientWidth;
					targetIframe.height = "200px";
					subscribeForm.parentNode.insertBefore(targetIframe, subscribeForm.nextSibling);
					subscribeForm.target = targetIframe.name;
				}
			}, false);
		}
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newSubscribeContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newSubscribeContainer.parentNode.removeChild(newSubscribeContainer);
			subscribeLink.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newSubscribeContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newSubscribeContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newSubscribeContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newSubscribeContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newSubscribeContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newSubscribeContainer);
		}
		else {
			newSubscribeContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			subscribeLink.parentNode.replaceChild(newSubscribeContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newSubscribeContainer);
	});
}
/*************************************************************************************************/
function ljaddLoadEntryHere(event) {
	var entryLink;
	if (event.target.parentNode.id == "ljaddTriggers") {
		entryLink = event.target.ownerDocument.triggersLink;
	}
	else {
		entryLink = gContextMenu.target;
		while (entryLink.parentNode && entryLink.tagName != "A") {
			entryLink = entryLink.parentNode;
		}
	}
	var entryURL = entryLink.href;
	var doc = entryLink.ownerDocument;
	var body = doc.body;
	entryURL = ljaddChangeLocation(entryURL,
		(entryURL.search(/[\?&]mode=reply\b/i) > -1)? "light" : "light&mode=reply",
	false);
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	entryLink.parentNode.insertBefore(throbber, entryLink.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = "livejournal_addons_EntryHereContainer_" + entryURL.replace(/[^\w]/g, "");
	body.appendChild(container);
	chrome.extension.sendRequest({url: entryURL}, function(response)
	{
		container.innerHTML = response.html;
		var entryDiv = doc.evaluate(
			"./div[not(@id='fb-root')]",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!entryDiv) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			alert(Strings.error);
			return;
		}
		entryDiv.setAttribute("style", "position:static;display:block;visibility:visible;");
		var newEntryContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newEntryContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newEntryContainer.parentNode.removeChild(newEntryContainer);
			entryLink.focus();
		}, false);
		newEntryContainer.appendChild(entryDiv);
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newEntryContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newEntryContainer.parentNode.removeChild(newEntryContainer);
			entryLink.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newEntryContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newEntryContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newEntryContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newEntryContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newEntryContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newEntryContainer);
		}
		else {
			newEntryContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			entryLink.parentNode.replaceChild(newEntryContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newEntryContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddProfileHere(event) {
	var profileLink;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		profileLink = event.target.ownerDocument.triggersLink;
	}
	else {
		profileLink = gContextMenu.target;
		while (profileLink.parentNode && profileLink.tagName != "A") {
			profileLink = profileLink.parentNode;
		}
	}
	var profileURL = profileLink.href;
	var doc = profileLink.ownerDocument;
	var body = doc.body;
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	profileLink.parentNode.insertBefore(throbber, profileLink.nextSibling);
	var profileContainer = doc.createElement('div');
	profileContainer.style.display = 'none';
	body.appendChild(profileContainer);
	var user = ljaddGetUser(profileURL).replace(/_/g, "-");
	if (profileURL.search(/http:\/\/www\.livejournal\.com\/userinfo.bml\?.*\b(?:userid)=\w+/i) > -1) {
		profileURL = "http://www.livejournal.com/userinfo.bml?userid=" + user + "&t=I&mode=full&usescheme=lynx";
	}
	else {
		profileURL = "http://" + user + ".livejournal.com/profile?mode=full&usescheme=lynx";
	}
	chrome.extension.sendRequest({url: profileURL}, function(response)
	{
		profileContainer.innerHTML = response.html;
		var ads = doc.evaluate(
			".//td[div[@class='ljad ljadmedrect']]",
			profileContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (ads) {
			ads.parentNode.removeChild(ads);
		}
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		profileContainer.insertBefore(closeButton1, profileContainer.firstChild);
		closeButton1.addEventListener("click", function() {
			profileContainer.parentNode.removeChild(profileContainer);
		}, false);
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		profileContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			profileContainer.parentNode.removeChild(profileContainer);
		}, false);
		var win = doc.defaultView;
		profileContainer.setAttribute("style",
			"z-index:1000;position:fixed;display:none;visibility:visible;max-width:" +
			(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
			(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
			"px;overflow:scroll;border:1px solid black;padding:10px;"
		);
		if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
			profileContainer.style.backgroundColor = body.style.backgroundColor;
		}
		else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
			profileContainer.style.backgroundColor = body.getAttribute("bgcolor");
		}
		else if (body.bgColor && body.bgColor != "transparent") {
			profileContainer.style.backgroundColor = body.bgColor;
		}
		else {
			profileContainer.style.backgroundColor = "white";
		}
		throbber.parentNode.removeChild(throbber);
		profileContainer.style.display = 'block';
		ljaddProcessChangedBlock(profileContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddAddFriendHere(event) {
	var addFriendLink;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		addFriendLink = event.target.ownerDocument.triggersLink;
	}
	else {
		addFriendLink = gContextMenu.target;
		while (addFriendLink.parentNode && addFriendLink.tagName != "A") {
			addFriendLink = addFriendLink.parentNode;
		}
	}
	var addFriendURL = addFriendLink.href;
	var username = ljaddGetUser(addFriendURL);
	var doc = addFriendLink.ownerDocument;
	var body = doc.body;
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	addFriendLink.parentNode.insertBefore(throbber, addFriendLink.nextSibling);
	var addFriendContainer = doc.createElement('div');
	addFriendContainer.style.display = 'none';
	body.appendChild(addFriendContainer);
	var containerId = "livejournal_addons_addFriendContainer_" + username;
	addFriendContainer.id = containerId;
	chrome.extension.sendRequest({url: "http://www.livejournal.com/friends/add.bml?user=" + username + "&usescheme=lynx"}, function(response)
	{
		addFriendContainer.innerHTML = response.html;
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		addFriendContainer.insertBefore(closeButton1, addFriendContainer.firstChild);
		closeButton1.addEventListener("click", function() {
			addFriendContainer.parentNode.removeChild(addFriendContainer);
		}, false);
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		addFriendContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			addFriendContainer.parentNode.removeChild(addFriendContainer);
		}, false);
		var win = doc.defaultView;
		addFriendContainer.setAttribute("style",
			"z-index:1000;position:fixed;display:none;visibility:visible;max-width:" +
			(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
			(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
			"px;overflow:scroll;border:1px solid black;padding:10px;"
		);
		if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
			addFriendContainer.style.backgroundColor = body.style.backgroundColor;
		}
		else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
			addFriendContainer.style.backgroundColor = body.getAttribute("bgcolor");
		}
		else if (body.bgColor && body.bgColor != "transparent") {
			addFriendContainer.style.backgroundColor = body.bgColor;
		}
		else {
			addFriendContainer.style.backgroundColor = "white";
		}
		var addFriendForm = doc.evaluate(
			".//form[@name='editFriends']",
			addFriendContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!addFriendForm) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(addFriendContainer);
			alert(Strings.error);
			return;
		}
		addFriendForm.setAttribute("accept-charset", "UTF-8");
		addFriendForm.action = "http://www.livejournal.com/friends/add.bml?usescheme=lynx";
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			addFriendForm.target = "_blank";
		}
		else*/ {
			addFriendForm.addEventListener("submit", function() {
				var targetIframe = doc.getElementById(containerId + "_targetIframe");
				if (!targetIframe) {
					targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = addFriendForm.clientWidth;
					targetIframe.height = "200px";
					addFriendForm.parentNode.insertBefore(targetIframe, addFriendForm.nextSibling);
					addFriendForm.target = targetIframe.name;
				}
				targetIframe.scrollIntoView(false);
			}, false);
		}
		throbber.parentNode.removeChild(throbber);
		addFriendContainer.style.display = 'block';
		ljaddProcessChangedBlock(addFriendContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddReportBotHere(event) {
	var reportLink;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		reportLink = event.target.ownerDocument.triggersLink;
	}
	else {
		reportLink = gContextMenu.target;
		while (reportLink.parentNode && reportLink.tagName != "A") {
			reportLink = reportLink.parentNode;
		}
	}
	var reportURL = reportLink.href;
	var username = ljaddGetUser(reportURL);
	reportURL = "http://www.livejournal.com/abuse/bots.bml?user=" + username + "&usescheme=lynx";
	var doc = reportLink.ownerDocument;
	var body = doc.body;
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/throbber.gif"));
	reportLink.parentNode.insertBefore(throbber, reportLink.nextSibling);
	var reportContainer = doc.createElement('div');
	reportContainer.style.display = 'none';
	body.appendChild(reportContainer);
	var containerId = "livejournal_addons_reportBotContainer_" + username;
	reportContainer.id = containerId;
	chrome.extension.sendRequest({url: reportURL}, function(response)
	{
		reportContainer.innerHTML = response.html;
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		reportContainer.insertBefore(closeButton1, reportContainer.firstChild);
		closeButton1.addEventListener("click", function() {
			reportContainer.parentNode.removeChild(reportContainer);
		}, false);
		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		reportContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			reportContainer.parentNode.removeChild(reportContainer);
		}, false);
		var win = doc.defaultView;
		reportContainer.setAttribute("style",
			"z-index:1000;position:fixed;display:none;visibility:visible;max-width:" +
			(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
			(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
			"px;overflow:scroll;border:1px solid black;padding:10px;"
		);
		if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
			reportContainer.style.backgroundColor = body.style.backgroundColor;
		}
		else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
			reportContainer.style.backgroundColor = body.getAttribute("bgcolor");
		}
		else if (body.bgColor && body.bgColor != "transparent") {
			reportContainer.style.backgroundColor = body.bgColor;
		}
		else {
			reportContainer.style.backgroundColor = "white";
		}
		var reportForm = doc.evaluate(
			".//form[@class='susp_names']",
			reportContainer,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!reportForm) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(reportContainer);
			alert(Strings.error);
			return;
		}
		reportForm.setAttribute("accept-charset", "UTF-8");
		reportForm.action = reportURL;
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			reportForm.target = "_blank";
		}
		else*/ {
			reportForm.addEventListener("submit", function() {
				var targetIframe = doc.getElementById(containerId + "_targetIframe");
				if (!targetIframe) {
					targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = reportForm.clientWidth;
					targetIframe.height = "200px";
					reportForm.parentNode.insertBefore(targetIframe, reportForm.nextSibling);
					reportForm.target = targetIframe.name;
				}
				targetIframe.scrollIntoView(false);
			}, false);
		}
		throbber.parentNode.removeChild(throbber);
		reportContainer.style.display = 'block';
		ljaddProcessChangedBlock(reportContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
/*function ljaddOpenFeed(event) {
	var targetLocation;
	if (event.target.id == "ljaddOpenFeedTrigger") {
		targetLocation = event.target.ownerDocument.triggersLink.href;
	}
	else {
		targetLocation = gContextMenu.linkURL;
	}
	var user = ljaddGetUser(targetLocation);
	targetLocation =
		"http://" +
		((user.search(/^_|_$/) > -1)?
			("users.livejournal.com/" + user + "/data/")
			:
			(user.replace(/_/g, "-") + ".livejournal.com/data/")
		) +
		(event.shiftKey? "atom":"rss")
	;
	if (event.ctrlKey || event.metaKey) {
		gBrowser.selectedBrowser.loadURI(targetLocation);
	}
	else {
		gBrowser.getBrowserForTab(gBrowser.addTab()).loadURI(targetLocation);
	}
}*/
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddEditMyEntry(event) {
	var targetLocation;
	if (event.target.id == "ljaddEditMyEntryTrigger") {
		targetLocation = event.target.ownerDocument.triggersLink.href;
	}
	else {
		targetLocation = gContextMenu.linkURL;
	}
	targetLocation =
		"http://www.livejournal.com/editjournal.bml?journal=" + ljaddGetUser(ljaddMainURL) +
		"&itemid=" + targetLocation.replace(/.+?(\d+)\.html\b.*$/i, "$1")
	;
	/*if (
		ljaddPrefMainBranch.getBoolPref("ljaddFormatOpenOpt") &&
		ljaddPrefMainBranch.getIntPref("ljaddFormatOpenStyle") > 0 &&
		ljaddCheckURLtoOpen(targetLocation)
	) {
		targetLocation = ljaddChangeLocation(targetLocation, "light", false);
	}*/
	if (event.ctrlKey || event.metaKey) {
		//gBrowser.selectedBrowser.loadURI(targetLocation);
		window.location = targetLocation;
	}
	else {
		//gBrowser.getBrowserForTab(gBrowser.addTab()).loadURI(targetLocation);
		chrome.extension.sendRequest({type: "tabs", action: "create", url: targetLocation}, function(response){});
	}
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddEditPostTags(event) {
	var target;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		target = event.target.ownerDocument.triggersLink;
	}
	else {
		target = gContextMenu.target;
		while (target.parentNode && target.tagName != "A") {
			target = target.parentNode;
		}
	}
	var journal = ljaddGetUser(target.href);
	var postId = target.href.replace(/.+?(\d+)\.html\b.*$/i, "$1");
	var postURL = "http://www.livejournal.com/edittags.bml?usescheme=lynx&journal=" + journal + "&itemid=" + postId;

	var doc = target.ownerDocument;
	var containerId = "livejournal_addons_EditPostTags_" + postURL.replace(/[^\w-]/g, "");
	var body = doc.body;
	var throbber = doc.createElement('img');
	throbber.setAttribute("style", "border:0px none;vertical-align:text-bottom;margin-left:5px");
	throbber.setAttribute("src", chrome.extension.getURL("images/del.gif"));
	target.parentNode.insertBefore(throbber, target.nextSibling);
	var container = doc.createElement('div');
	container.style.display = 'none';
	container.id = containerId;
	body.appendChild(container);
	chrome.extension.sendRequest({url: postURL}, function(response)
	{
		container.innerHTML = response.html;
		var editPostTagForm = doc.evaluate(
			".//form[@id='edit_tagform']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		var editPostTagFormInput = doc.evaluate(
			".//input[@id='tagfield']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		var editPostTagSelect = doc.evaluate(
			".//select[@class='tagbox_nohist']",
			container,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (!editPostTagForm || !editPostTagFormInput || !editPostTagSelect) {
			throbber.parentNode.removeChild(throbber);
			body.removeChild(container);
			return;
		}
		editPostTagForm.setAttribute("accept-charset", "UTF-8");
		var newEditPostTagContainer = doc.createElement('div');
		var closeButton1 = doc.createElement('img');
		closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newEditPostTagContainer.appendChild(closeButton1);
		closeButton1.addEventListener("click", function() {
			newEditPostTagContainer.parentNode.removeChild(newEditPostTagContainer);
			target.focus();
		}, false);
		editPostTagForm.action = "http://www.livejournal.com/edittags.bml";
		editPostTagSelect.style.width = "300px";
		editPostTagForm.appendChild(editPostTagSelect);
		newEditPostTagContainer.appendChild(editPostTagForm);
		var inputs = container.getElementsByTagName("input");
		while (inputs.length) {
			editPostTagForm.appendChild(inputs[0]);
		}
		var tagScript1 = doc.createElement('script');
		tagScript1.setAttribute("type", "text/javascript");
		tagScript1.setAttribute("language", "JavaScript");
		tagScript1.setAttribute("src", "http://l-stat.livejournal.com/js/tags.js");
		var tagScript2 = doc.createElement('script');
		tagScript2.setAttribute("type", "text/javascript");
		tagScript2.setAttribute("language", "JavaScript");
		tagScript2.textContent = "var cur_taglist = '" + editPostTagFormInput.value + "';";
		var tagScript3 = doc.createElement('script');
		tagScript3.setAttribute("type", "text/javascript");
		tagScript3.setAttribute("language", "JavaScript");
		tagScript3.textContent = "EditTag.init();";
		newEditPostTagContainer.appendChild(tagScript1);
		newEditPostTagContainer.appendChild(tagScript2);
		newEditPostTagContainer.appendChild(tagScript3);
		/*if (ljaddPrefMainBranch.getBoolPref("ljaddInlineInNewTarget")) {
			editPostTagForm.target = "_blank";
		}
		else*/ {
			editPostTagForm.addEventListener("submit", function() {
				if (!doc.getElementById(containerId + "_targetIframe")) {
					var targetIframe = doc.createElement('iframe');
					targetIframe.id = targetIframe.name = containerId + "_targetIframe";
					targetIframe.width = editPostTagForm.clientWidth;
					targetIframe.height = "200px";
					editPostTagForm.parentNode.insertBefore(targetIframe, editPostTagForm.parentNode.lastChild);
					editPostTagForm.target = targetIframe.name;
				}
			}, false);
		}

		var closeButton2 = doc.createElement('img');
		closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;");
		closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
		newEditPostTagContainer.appendChild(closeButton2);
		closeButton2.addEventListener("click", function() {
			newEditPostTagContainer.parentNode.removeChild(newEditPostTagContainer);
			target.focus();
		}, false);
		if (event.ctrlKey || event.metaKey) {
			var win = doc.defaultView;
			newEditPostTagContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:block;visibility:visible;max-width:" +
				(win.innerWidth/2) + "px;max-height:" + (win.innerHeight/2) + "px;left:" +
				(win.innerWidth/4) + "px;top:" + (win.innerHeight/4) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				newEditPostTagContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				newEditPostTagContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				newEditPostTagContainer.style.backgroundColor = body.bgColor;
			}
			else {
				newEditPostTagContainer.style.backgroundColor = "white";
			}
			throbber.parentNode.removeChild(throbber);
			body.appendChild(newEditPostTagContainer);
		}
		else {
			newEditPostTagContainer.setAttribute("style", "position:static;display:block;visibility:visible;white-space:normal;border:1px solid black;padding:10px 10px 30px 10px;margin:5px;text-align:left;text-transform:none;");
			target.parentNode.replaceChild(newEditPostTagContainer, throbber);
		}
		body.removeChild(container);
		ljaddProcessChangedBlock(newEditPostTagContainer);
	});
}
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddLinkSearch(event) {
	var ljaddLinkSearchURLs = decodeURI(ljStorage["livejournal_addons.ljaddLinkSearch"]);
	if (ljaddLinkSearchURLs) {
		ljaddLinkSearchURLs = ljaddLinkSearchURLs.split("\n");
		var link, doc, body;
		if (event && event.target.parentNode.id == "ljaddTriggers") {
			link = event.target.ownerDocument.triggersLink;
			doc = link.ownerDocument;
		}
		/*else if (gContextMenu && gContextMenu.onLink) {
			link = gContextMenu.target;
			doc = link.ownerDocument;
		}*/
		else {
			doc = content.document;
			link = doc.location;
		}
		body = doc.body;
		if (event && (event.ctrlKey || event.metaKey)) {
			var linkSearchContainer = doc.createElement('div');
			linkSearchContainer.style.display = 'none';
			body.appendChild(linkSearchContainer);
			var closeButton1 = doc.createElement('img');
			closeButton1.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
			closeButton1.setAttribute("src", chrome.extension.getURL("images/del.gif"));
			linkSearchContainer.appendChild(closeButton1);
			closeButton1.addEventListener("click", function() {
				linkSearchContainer.parentNode.removeChild(linkSearchContainer);
			}, false);
			for (var i = 0, arrayLength = ljaddLinkSearchURLs.length; i < arrayLength; i++) {
				var iframe = doc.createElement('iframe');
				linkSearchContainer.appendChild(iframe);
				iframe.width = "95%";
				iframe.height = "45%";
				linkSearchContainer.appendChild(doc.createElement('br'));
				linkSearchContainer.appendChild(doc.createElement('br'));
				iframe.src = ljaddLinkSearchURLs[i].replace(/\^/g, link.host + link.pathname.replace(/^\/$/, ""));
			}
			var closeButton2 = doc.createElement('img');
			closeButton2.setAttribute("style", "border:0px none;margin-left:5px;cursor:pointer;float:right;z-index:1000;");
			closeButton2.setAttribute("src", chrome.extension.getURL("images/del.gif"));
			linkSearchContainer.appendChild(closeButton2);
			closeButton2.addEventListener("click", function() {
				linkSearchContainer.parentNode.removeChild(linkSearchContainer);
			}, false);
			var win = doc.defaultView;
			linkSearchContainer.setAttribute("style",
				"z-index:1000;position:fixed;display:none;visibility:visible;width:" +
				(win.innerWidth - (win.innerWidth/10)*2) + "px;height:" + (win.innerHeight - (win.innerHeight/10)*2) + "px;left:" +
				(win.innerWidth/10) + "px;top:" + (win.innerHeight/10) +
				"px;overflow:scroll;border:1px solid black;padding:10px;"
			);
			if (body.style.backgroundColor && body.style.backgroundColor != "transparent") {
				linkSearchContainer.style.backgroundColor = body.style.backgroundColor;
			}
			else if (body.getAttribute("bgcolor") && body.getAttribute("bgcolor") != "transparent") {
				linkSearchContainer.style.backgroundColor = body.getAttribute("bgcolor");
			}
			else if (body.bgColor && body.bgColor != "transparent") {
				linkSearchContainer.style.backgroundColor = body.bgColor;
			}
			else {
				linkSearchContainer.style.backgroundColor = "white";
			}
			linkSearchContainer.style.display = 'block';
		}
		else {
			for (var i = 0, arrayLength = ljaddLinkSearchURLs.length; i < arrayLength; i++) {
				/*gBrowser.addTab(
					ljaddLinkSearchURLs[i].replace(/\^/g, link.host + link.pathname.replace(/^\/$/, ""))
				);*/
				var tabUrl = ljaddLinkSearchURLs[i].replace(/\^/g, link.host + link.pathname.replace(/^\/$/, ""));
				chrome.extension.sendRequest({type: "tabs", action: "create", url: tabUrl}, function(response){});
			}
		}
	}
	else {
		alert(Strings.linkSearchNoURL);
	}

}
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddChangeCommentFormat(event, add) {
	var target;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		var eTarget = event.target;
		if (eTarget.id == "ljaddToFlat1Trigger") {
			add = "light&view=flat&page=1";
		}
		else if (eTarget.id == "ljaddToFlatNTrigger") {
			add = "light&view=flat&page=1000000";
		}
		else if (eTarget.id == "ljaddToTreeTrigger") {
			add = "light&tree";
		}
		target = eTarget.ownerDocument.triggersLink;
	}
/*	else {
		target = gContextMenu.target;
		while (target.parentNode && target.tagName != "A") {
			target = target.parentNode;
		}
	}*/
	target =  ljaddChangeLocation(target.href, add, true);
	if (event.ctrlKey || event.metaKey) {
		//content.window.focus();
		//gBrowser.selectedBrowser.loadURI(target);
		window.location = target;
	}
	else {
		//gBrowser.getBrowserForTab(gBrowser.addTab()).loadURI(target);
		chrome.extension.sendRequest({type: "tabs", action: "create", url: target}, function(response){});
	}
}
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddAddEditUserTip(event) {
	var targetLocation;
	if (event.target.id == "ljaddAddEditUserTipTrigger") {
		targetLocation = event.target.ownerDocument.triggersLink.href;
	}
//	else {
//		targetLocation = gContextMenu.linkURL;
//	}
	var user = ljaddGetUser(targetLocation);
	var ljaddUserTipsArr = {};
	var temp = ljaddUserTips.split('\n');
	for(var i = 0; i < temp.length; i++)
		if(temp[i].indexOf('=') > -1)
			ljaddUserTipsArr[temp[i].substring(0, temp[i].indexOf('='))] = temp[i].substring(temp[i].indexOf('=') + 1, temp[i].length);
	var tip = prompt(user + " =", ljaddUserTipsArr[user] || "");
	if (tip === "") {
		delete ljaddUserTipsArr[user];
		//ljaddPrefMainBranch.setComplexValue("ljaddUserTips", ljaddSupportsString, ljaddGetUStr(JSON.stringify(ljaddUserTips)));
	}
	else if (tip && tip.replace(/^[\s=]+|\s+$/g, "")) {
		ljaddUserTipsArr[user] = tip.replace(/^[\s=]+|\s+$/g, "");
		//ljaddPrefMainBranch.setComplexValue("ljaddUserTips", ljaddSupportsString, ljaddGetUStr(JSON.stringify(ljaddUserTips)));
	}

	temp = "";
	for(var key in ljaddUserTipsArr)
		temp += (temp.length > 0 ? "\n" : "") + key + "=" + ljaddUserTipsArr[key];
	ljaddUserTips = temp;
	ljStorage["livejournal_addons.ljaddUserTips"] = ljaddUserTips;
	chrome.extension.sendRequest({type: "set_storage", key: "livejournal_addons.ljaddUserTips",
														  value: ljaddUserTips}, function(response){});

}
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddBrowseImages(event, fromThis) {
	var doc, toImg;
	if (event && event.target.parentNode.id == "ljaddTriggers") {
		toImg = event.target.ownerDocument.defaultView.top.document.ljaddBrowseImagesFromThis;
		doc = toImg.ownerDocument;
	}
/*	else if (fromThis) {
		toImg = gContextMenu.target;
		doc = toImg.ownerDocument;
	}*/
	else {
		doc = document;
		var images = doc.body.getElementsByTagName("img");
		if (!images.length) {
			alert(Strings.noImages);
			return;
		}
		var minWidth;
		if (ljaddMinImageWidthForBrowseOpt) {
			minWidth = ljaddMinImageWidthForBrowse;
		}
		else {
			minWidth = 2;
		}
		for (var i=0, img; img = images[i]; i++) {
			if (
				img.clientHeight <= 1 ||
				img.clientWidth <= 1 ||
				(img.clientWidth > 1 && img.clientWidth < minWidth) ||
				img.parentNode.id == "ljaddTriggers" ||
				img.parentNode.parentNode.id == "ljaddInsetBlock" ||
				img.parentNode.id == "ljaddBrowseImagesDiv" ||
                img.className == "ljaddUnfolderImg"
			) {
				continue;
			}
			else {
				toImg = img;
				break;
			}
		}
		if (!toImg) {
			alert(Strings.noImages);
			return;
		}
	}
	var topDoc = doc.defaultView.top.document;
	var browseImagesDiv = topDoc.getElementById("ljaddBrowseImagesDiv");
	if (!browseImagesDiv) {
		browseImagesDiv = topDoc.createElement("div");
		browseImagesDiv.id = "ljaddBrowseImagesDiv";
		browseImagesDiv.setAttribute("style", "padding:5px;position:fixed;right:10px;top:10px;background-color:white;border:1px solid black;z-index:1000");
		topDoc.body.appendChild(browseImagesDiv);
		var closeButton = topDoc.createElement('img');
		closeButton.id = "ljaddBrowseImagesCloseButton";
		closeButton.setAttribute("style", "border:0px none;cursor:pointer;margin-bottom:5px;");
		closeButton.setAttribute("title", Strings.browseImagesStop);
		closeButton.setAttribute("src", chrome.extension.getURL("images/delmin.gif"));
		browseImagesDiv.appendChild(closeButton);
		closeButton.addEventListener("click", function() {
			topDoc.ljaddBrowseImagesFromThis.ownerDocument.removeEventListener("click", ljaddBrowseImagesStep, true);
			topDoc.removeEventListener("click", ljaddBrowseImagesStep, true);
			topDoc.ljaddBrowseImagesFromThis.ownerDocument.removeEventListener("dblclick", ljaddBrowseImagesTipMouseDblclick, true);
			topDoc.removeEventListener("dblclick", ljaddBrowseImagesTipMouseDblclick, true);
			browseImagesDiv.parentNode.removeChild(browseImagesDiv);
			topDoc.oncontextmenu = topDoc.oncontextmenuTemp;
		}, false);
		browseImagesDiv.appendChild(topDoc.createElement("br"));
		var help = topDoc.createElement('img');
		help.setAttribute("src", chrome.extension.getURL("images/fedit.png"));
		help.setAttribute("style", "border:0px none;");
		browseImagesDiv.appendChild(help);
		help.addEventListener("mouseover", ljaddBrowseImagesTipMouseOver, false);
		help.addEventListener("mouseout", ljaddBrowseImagesTipMouseOut, false);
		topDoc.addEventListener("click", ljaddBrowseImagesStep, true);
		topDoc.addEventListener("dblclick", ljaddBrowseImagesTipMouseDblclick, true);
	}
	if (!doc.getElementById("ljaddBrowseImagesTip")) {
		var ljaddBrowseImagesTip = doc.createElement("div");
		ljaddBrowseImagesTip.id = "ljaddBrowseImagesTip";
		ljaddBrowseImagesTip.innerHTML =
			Strings.browseImagesTip1 + "<br>" +
			Strings.browseImagesTip2 + "<br>" +
			Strings.browseImagesTip0;
		ljaddBrowseImagesTip.setAttribute("style", "display:none;position:fixed;right:10px;padding:1px 2px;background-color:infobackground;color:infotext;font:-moz-info;line-height:150%;border:1px solid InfoText;z-index:1000");
		topDoc.documentElement.appendChild(ljaddBrowseImagesTip);
	}
	topDoc.ljaddBrowseImagesFromThis = toImg;
	topDoc.ljaddBrowseImagesFromThis.ownerDocument.addEventListener("click", ljaddBrowseImagesStep, true);
	topDoc.ljaddBrowseImagesFromThis.ownerDocument.addEventListener("dblclick", ljaddBrowseImagesTipMouseDblclick, true);
	topDoc.oncontextmenuTemp = topDoc.oncontextmenu;
	topDoc.oncontextmenu = function(event){
		ljaddBrowseImagesStep(event);
		if (
			event &&
			!(
				event.ctrlKey ||
				event.metaKey ||
				event.target.id == "ljaddBrowseImagesCloseButton" ||
				event.target.id == "ljaddTriggers" ||
				(event.target.parentNode && event.target.parentNode.id == "ljaddTriggers")
			)
		)
			return false;
	};
	toImg.scrollIntoView(true);
}
/*************************************************************************************************/
function ljaddBrowseImagesTipMouseDblclick(mouseEvent) {
	mouseEvent.preventDefault();
}
/*************************************************************************************************/
function ljaddBrowseImagesTipMouseOver(mouseEvent) {
	var ljaddBrowseImagesTip = this.ownerDocument.getElementById("ljaddBrowseImagesTip");
	if (ljaddBrowseImagesTip) {
		ljaddBrowseImagesTip.style.top = (12 + this.parentNode.offsetHeight) + "px";
		ljaddBrowseImagesTip.style.display = "block";
	}
}
/*************************************************************************************************/
function ljaddBrowseImagesTipMouseOut(mouseEvent) {
	var ljaddBrowseImagesTip = this.ownerDocument.getElementById("ljaddBrowseImagesTip");
	if (ljaddBrowseImagesTip) {
		ljaddBrowseImagesTip.style.display = "none";
	}
}
/*************************************************************************************************/
function ljaddBrowseImagesStep(event) {
	if (
			event &&
			(
				event.ctrlKey ||
				event.metaKey ||
				event.target.id == "ljaddBrowseImagesCloseButton" ||
				event.target.id == "ljaddTriggers" ||
				(event.target.parentNode && event.target.parentNode.id == "ljaddTriggers")
			)
	) {
		//event.preventDefault();
		return;
	}
	var doc, topDoc, curImg;
	if (event) {
		event.preventDefault();
		topDoc = event.target.ownerDocument.defaultView.top.document;
		curImg = topDoc.ljaddBrowseImagesFromThis;
		doc = curImg.ownerDocument;
	}
	/*else {
		doc = topDoc =  gBrowser.selectedBrowser.contentDocument;
		curImg = topDoc.ljaddBrowseImagesFromThis;
	}*/
	var toImg;
	if (!event || event.button == 0) {
		toImg = doc.evaluate(
			"following::img",
			curImg,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
	}
	else if (event.button == 2) {
		toImg = doc.evaluate(
			"preceding::img[1]",
			curImg,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
	}
	else {
		return;
	}
	if (!toImg) {
		return;
	}
	topDoc.ljaddBrowseImagesFromThis = toImg;
	if (
		toImg.parentNode.id == "ljaddTriggers" ||
		toImg.parentNode.id == "ljaddBrowseImagesDiv" ||
		toImg.parentNode.parentNode.id == "ljaddInsetBlock" ||
		toImg.clientHeight <= 1 ||
		toImg.clientWidth <= 1 ||
		curImg.offsetParent == toImg.offsetParent && curImg.offsetTop == toImg.offsetTop ||
        curImg.className == "ljaddUnfolderImg"

	) {
		ljaddBrowseImagesStep(event);
		return;
	}
	var minWidth;
	if (ljaddMinImageWidthForBrowseOpt) {
		minWidth = ljaddMinImageWidthForBrowse;
	}
	else {
		minWidth = 2;
	}
	if (toImg.clientWidth > 1 && toImg.clientWidth < minWidth) {
		ljaddBrowseImagesStep(event);
	}
	else {
		toImg.scrollIntoView(true);
	}
}
/*************************************************************************************************/
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
function addCommentsButtons(body)
{
	var doc = body.ownerDocument;
	if (doc.location.href.search(/\.html\b/i) > -1) {
		var correctComment = doc.evaluate(
			".//div[@id='Comments']//table[@class='talk-comment']",
			body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
		).singleNodeValue;
		if (correctComment) {
			var foldedComment = doc.evaluate(
				".//div[@id='Comments']//table[not(@class='talk-comment') and descendant::a[contains(@href, 'thread=')]]",
				body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
			).singleNodeValue;
			var pageLinksContainer = doc.evaluate(
				".//div[@id='Comments']//table[not(@class='talk-comment')]//td[a[contains(@href, 'page=')]and span]",
				body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
			).singleNodeValue;
			/*if (ljaddPrefMainBranch.getBoolPref("ljaddAddCommentButtons"))*/ {
				var buttonsDiv = doc.createElement('div');
				buttonsDiv.setAttribute("style", "margin:0px;text-align:center;");
				var commentDiv = doc.getElementById("Comments");
				commentDiv.insertBefore(buttonsDiv, commentDiv.firstChild);
				if (foldedComment) {
					var toFlat1Button = doc.createElement('img');
					toFlat1Button.id = "ljaddToFlat1Button";
					toFlat1Button.setAttribute("style", "border:0px none;margin:5px;cursor:pointer;");
					toFlat1Button.setAttribute("title", Strings.toFlat1);
					toFlat1Button.setAttribute("src", chrome.extension.getURL("images/flat1.gif"));
					buttonsDiv.appendChild(toFlat1Button);
					toFlat1Button.addEventListener("click", function () {ljaddChangeLocation(doc.location, 'light&view=flat&page=1', true)}, false);
					var toFlatNButton = doc.createElement('img');
					toFlatNButton.id = "ljaddToFlatNButton";
					toFlatNButton.setAttribute("style", "border:0px none;margin:5px;cursor:pointer;");
					toFlatNButton.setAttribute("title", Strings.toFlatN);
					toFlatNButton.setAttribute("src", chrome.extension.getURL("images/flatn.gif"));
					buttonsDiv.appendChild(toFlatNButton);
					toFlatNButton.addEventListener("click", function () {ljaddChangeLocation(doc.location, 'light&view=flat&page=1000000', true)}, false);
					if (doc.location.search.search(/\bview=flat\b/i) > -1) {
						var toTreeButton = doc.createElement('img');
						toTreeButton.id = "ljaddToTreeButton";
						toTreeButton.setAttribute("style", "border:0px none;margin:5px;cursor:pointer;");
						toTreeButton.setAttribute("title", Strings.toTree);
						toTreeButton.setAttribute("src", chrome.extension.getURL("images/tree.png"));
						buttonsDiv.appendChild(toTreeButton);
						toTreeButton.addEventListener("click", function () {ljaddChangeLocation(doc.location, 'light&tree', true)}, false);
					}
					var unfoldPageButton = doc.createElement('img');
					unfoldPageButton.id = "ljaddUnfoldPageButton";
					unfoldPageButton.setAttribute("style", "border:0px none;margin:5px;cursor:pointer;");
					unfoldPageButton.setAttribute("title", Strings.unfoldPageComments);
					unfoldPageButton.setAttribute("src", chrome.extension.getURL("images/unfold.png"));
					buttonsDiv.appendChild(unfoldPageButton);
					unfoldPageButton.addEventListener("click", ljaddUnfoldComments, false);
					if (pageLinksContainer) {
						var unfoldAllPagesButton = doc.createElement('img');
						unfoldAllPagesButton.id = "ljaddUnfoldAllPagesButton";
						unfoldAllPagesButton.setAttribute("style", "border:0px none;margin:5px;cursor:pointer;");
						unfoldAllPagesButton.setAttribute("title", Strings.unfoldAllPages);
						unfoldAllPagesButton.setAttribute("src", chrome.extension.getURL("images/unfoldpp.png"));
						buttonsDiv.appendChild(unfoldAllPagesButton);
						unfoldAllPagesButton.addEventListener("click", ljaddUnfoldComments, false);
					}
				}
			}
		}
	}
}
/*************************************************************************************************/
function ljaddProcessTextFields(thisDocument) {
	if (thisDocument) {
		ljaddProcessTextFieldsTraverseFrames(thisDocument);
	}
	/*else {
		for (var i = 0, len = gBrowser.browsers.length; i < len; i++) {
			var curBrowser = gBrowser.getBrowserAtIndex(i);
			var doc = curBrowser.contentDocument;
			if (ljaddCheckSite(doc.location.href)) {
				ljaddProcessTextFieldsTraverseFrames(doc);
			}
		}
	}*/
}
/*************************************************************************************************/
function ljaddProcessTextFieldsTraverseFrames(doc) {
/*	var win = doc.defaultView;
	var frameList = win.frames;
	if (frameList && frameList.length) {
		for (var i = 0, arrayLength = frameList.length; i < arrayLength; i++) {
			ljaddProcessTextFieldsTraverseFrames(frameList[i].document);
		}
	}
	var replaceMethod = ljaddPrefMainBranch.getIntPref("auto.ljaddTextAuto");
	var formList = doc.forms;
	if (formList && formList.length) {
		for(var i = 0, f; f = formList[i]; i++) {
			if (ljaddPrefMainBranch.getBoolPref("ljaddRemoveMailSecurityWarning") && f.action.search(/\btalkpost_do\.bml\b/i) > -1) {
				f.removeAttribute("onsubmit");
			}
			f.addEventListener("submit", ljaddSubmit, true);
		}
	}*/
	var textFields = doc.evaluate(
		".//*[translate(name(),'TEXAR','texar')='textarea' or translate(name(),'INPUT','input')='input' and (@type='text' or @type='textbox' or not(@type))]",
		doc.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);
	if (textFields) {
		for (var i=0, textField; textField = textFields.snapshotItem(i); i++) {
			/*textField.removeEventListener("input", ljaddChangeField, false);
			textField.removeEventListener("dragdrop", ljaddChangeField, false);
			if (replaceMethod == 1) {
				if (!textField.ljaddPreviousBgColor) {
					textField.ljaddPreviousBgColor = win.getComputedStyle(textField, null).backgroundColor;
				}
				if (ljaddPrefMainBranch.getBoolPref("auto.ljaddTextAutoAlertBackgroundOpt")) {
					textField.style.backgroundColor = ljaddPrefMainBranch.getComplexValue("auto.ljaddTextAutoAlertBackgroundColor", ljaddSupportsString).data;
				}
				else if (textField.ljaddPreviousBgColor) {
					textField.style.backgroundColor = textField.ljaddPreviousBgColor;
					textField.ljaddPreviousBgColor = undefined;
				}
			}
			else {
				if (textField.ljaddPreviousBgColor) {
					textField.style.backgroundColor = textField.ljaddPreviousBgColor;
					textField.ljaddPreviousBgColor = undefined;
				}
				if (replaceMethod == 2) {
					textField.addEventListener("input", ljaddChangeField, false);
					textField.addEventListener("dragdrop", ljaddChangeField, false);
				}
			}*/
			if (addInsetBlock /*ljaddPrefMainBranch.getBoolPref("ljaddAddInsetBlock")*/) {
				textField.addEventListener("focus", ljaddBindTextField, false);
				textField.addEventListener("blur", ljaddUnbindTextField, false);
			}
			/*try {FoxyTunesTitle = foxytunesGetCurrentTrackTitle().replace(/^FoxyTunes|Idle$/, "");} catch(err) {}
			if (
				ljaddPrefMainBranch.getBoolPref("ljaddFoxytunesTitle") &&
				FoxyTunesTitle &&
				textField.id == "prop_current_music" &&
				doc.location.href.indexOf("editjournal.bml") == -1
			) {
				textField.value = FoxyTunesTitle;
			}
			if (textField.id == "prop_taglist" && ljaddPrefMainBranch.getBoolPref("ljaddTagFillingListOpt")) {
				ljaddAddTagFillingList(textField);
			}*/
		}
	}
}
/*************************************************************************************************/
/*************************************************************************************************/
function ljaddCatchDOMNodeInserted(event) {
	var node = event.target;
	var parentNode = node.parentNode;
	var parentDoc = node.ownerDocument;
	if (node.className == "ljaddMark" || parentNode.className == "ljaddMark") {
		return;
	}
	if (
		node.nodeName == "FORM" ||
		node.nodeName == "TEXTAREA" ||
		node.nodeName == "INPUT" &&
			(!node.hasAttribute("type") ||
			node.getAttribute("type") == "text" ||
			node.getAttribute("type") == "textbox") ||
		parentDoc.evaluate(
				".//*[translate(name(),'FORM','form')='form' or translate(name(),'TEXAR','texar')='textarea' or translate(name(),'INPUT','input')='input' and (@type='text' or @type='textbox' or not(@type))]",
				node,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
			).singleNodeValue
	) {
		ljaddProcessTextFieldsTraverseFrames(parentDoc);
	}
	if (node.nodeName == "A" && node.hasAttribute("href")) {
		ljaddProcessLinks(parentNode, false);
	}
	else if (parentDoc.evaluate(".//a[@href]",node,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue) {
		ljaddProcessLinks(node, false);
	}
	if (node.nodeName == "IMG") {
		ljaddProcessImages(parentNode);
	}
	else if (parentDoc.evaluate(".//img",node,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue) {
		ljaddProcessImages(node);
	}
	/*if (ljaddMarks.length) {
		ljaddMark(parentNode);
	}*/
}

function refreshDocument()
{
    //Don't know why, but sometimes Chrome doesn't show new block without this line (or only after mouse click):
    var h = document.body.offsetHeight;
}

/*************************************************************************************************/
if(document.readyState == "loading")
	window.addEventListener("load", function()
		{
			start();
		}, false);
else
	start();
