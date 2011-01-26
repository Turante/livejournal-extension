var selected  = null;
var changed = false;

function selectTab(id)
{
	if(changed)
	{
		var answer = confirm(chrome.i18n.getMessage("ljaddSaveAllChanges"));
		if(answer)
			apply();

		changed = false;
	}
	if(selected != null)
	{
		document.getElementById(selected).style.border = "1px outset";
		var oldDiv  = document.getElementById("div_" + selected);
		oldDiv.style.display = "none";
		oldDiv.style.visibility = "hidden";
	}
	document.getElementById(id).style.border = "1px inset";
	var div  = document.getElementById("div_" + id);

	prepareTab(id);

	div.style.display = "block";
	div.style.visibility = "visible";

	selected = id;
}

function prepareTab(id)
{
	if(id == "reading")
	{
		var ljurl = document.getElementById("reading_ljurl");
		ljurl.value = localStorage.getItem("livejournal_addons.ljaddMainURL");
		ljurl.onchange = function(){changed = true;};

		var fpurl = document.getElementById("reading_fpurl");
		fpurl.value = localStorage.getItem("livejournal_addons.ljaddFrPgURL");
		fpurl.onchange = function(){changed = true;};

		var fullprofile = document.getElementById("reading_fullprofile");
		fullprofile.checked = localStorage.getItem("livejournal_addons.ljaddFullProfile") == "true" ? true : false;
		fullprofile.onchange = function(){changed = true;};
		var cutunfolders = document.getElementById("reading_cutunfolders");
		cutunfolders.checked = localStorage.getItem("livejournal_addons.ljaddAddCutUnfolders") == "true" ? true : false;
		cutunfolders.onchange = function(){changed = true;};
		var linkicons = document.getElementById("reading_linkicons");
		linkicons.checked = localStorage.getItem("livejournal_addons.ljaddAddTriggersOpt") == "true" ? true : false;
		linkicons.onchange = function(){changed = true;};
		var imgicons = document.getElementById("reading_imgicons");
		imgicons.checked = localStorage.getItem("livejournal_addons.ljaddAddTriggersImagesOpt") == "true" ? true : false;
		imgicons.onchange = function(){changed = true;};
		var rshow = document.getElementById("reading_show");
		rshow.value = localStorage.getItem("livejournal_addons.ljaddAddTriggersIntervalShow");
		rshow.onchange = function(){changed = true;};
		var rhide = document.getElementById("reading_hide");
		rhide.value = localStorage.getItem("livejournal_addons.ljaddAddTriggersIntervalHide");
		rhide.onchange = function(){changed = true;};
		var bmaxwidth = document.getElementById("reading_imgmaxwidth");
		bmaxwidth.checked = localStorage.getItem("livejournal_addons.ljaddFriendsPageMaxWidthOpt") == "true" ? true : false;
		bmaxwidth.onchange = function(){
			changed = true;
			document.getElementById("reading_imgmaxwidthpx").disabled = !document.getElementById("reading_imgmaxwidth").checked;
		};
		var maxwidthpx = document.getElementById("reading_imgmaxwidthpx");
		maxwidthpx.value = localStorage.getItem("livejournal_addons.ljaddFriendsPageMaxWidth");
		maxwidthpx.disabled = !bmaxwidth.checked;
		maxwidthpx.onchange = function(){changed = true;};
		var bminwidth = document.getElementById("reading_imgbrowsemin");
		bminwidth.checked = localStorage.getItem("livejournal_addons.ljaddMinImageWidthForBrowseOpt") == "true" ? true : false;
		bminwidth.onchange = function(){
			changed = true;
			document.getElementById("reading_imgbrowseminpx").disabled = !document.getElementById("reading_imgbrowsemin").checked;
		};
		var minwidthpx = document.getElementById("reading_imgbrowseminpx");
		minwidthpx.value = localStorage.getItem("livejournal_addons.ljaddMinImageWidthForBrowse");
		minwidthpx.disabled = !bminwidth.checked;
		minwidthpx.onchange = function(){changed = true;};

		var format = document.getElementById("reading_open");
		format.checked = localStorage.getItem("livejournal_addons.ljaddFormatAppendOpt") == "true" ? true : false;
		format.onchange = function(){
			changed = true;
			document.getElementById("reading_urls").disabled = !document.getElementById("reading_open").checked;
			var radio = document.getElementsByName("reading_opentype");
			for(var i = 0; i < radio.length; i++)
				radio[i].disabled = !document.getElementById("reading_open").checked;
		};
		var radio = document.getElementsByName("reading_opentype");
		radio[Number(localStorage.getItem("livejournal_addons.ljaddFormatAppendStyle"))].checked = true;
		for(var i = 0; i < radio.length; i++)
		{
			radio[i].disabled = !format.checked;
			radio[i].onchange = function(){changed = true;};
		}
		var formatURLs = document.getElementById("reading_urls");
		formatURLs.value = localStorage.getItem("livejournal_addons.ljaddFormatAppendFilterList");
		formatURLs.disabled = !format.checked;
		formatURLs.onchange = function(){changed = true;};

		var tips = document.getElementById("reading_tips");
		tips.value = localStorage.getItem("livejournal_addons.ljaddUserTips");
		tips.onchange = function(){changed = true;};

		var tipsOpt = document.getElementById("reading_tipsopt");
		tipsOpt.checked = localStorage.getItem("livejournal_addons.ljaddUserTipsOpt") == "true" ? true : false;
		tipsOpt.onchange = function(){changed = true;};

		var ljinstantcomment = document.getElementById("reading_ljinstantcomment");
		ljinstantcomment.checked = localStorage.getItem("livejournal_addons.ljInstantComment") == "true" ? true : false;
		ljinstantcomment.onchange = function(){changed = true;};
	}
	else if(id == "checking")
	{
		var fpCheckOpt = document.getElementById("checking_preiodfpopt");
		fpCheckOpt.checked = localStorage.getItem("checks.ljaddFriendsPageCheckOpt") == "true" ? true : false;
		fpCheckOpt.onchange = function(){
			changed = true;
			document.getElementById("checking_periodfp").disabled = !document.getElementById("checking_preiodfpopt").checked;
		};

		var fpCheck = document.getElementById("checking_periodfp");
		fpCheck.value = localStorage.getItem("ljaddFriendsPageCheckInterval");
		fpCheck.disabled = !fpCheckOpt.checked;
		fpCheck.onchange = function(){changed = true;};

		var fpUpdateOpt = document.getElementById("checking_afterfp");
		fpUpdateOpt.checked = localStorage.getItem("ljaddFriendsPageUpdate") == "true" ? true : false;
		fpUpdateOpt.onchange = function(){changed = true;};

		var popupOpt = document.getElementById("checking_showpopup");
		popupOpt.checked = localStorage.getItem("ljaddNotificationOpt") == "true" ? true : false;
		popupOpt.onchange = function(){changed = true;};

		var badgeOpt = document.getElementById("checking_showbadge");
		badgeOpt.checked = localStorage.getItem("ljaddBadgeOpt") == "true" ? true : false;
		badgeOpt.onchange = function(){changed = true;};

		var actions = document.getElementsByName("checking_iconaction");
		actions[Number(localStorage.getItem("ljaddIconClickAction"))].checked = true;
		for(var i = 0; i < actions.length; i++)
		{
			actions[i].onchange = function(){changed = true;};
		}
	}
	else if(id == "insets")
	{
		var list = document.getElementById("insets_list");
		for(var i = list.childNodes.length - 1; i >= 0; i--)
			list.removeChild(list.childNodes[i]);

		var optList = decodeURI(localStorage.getItem("livejournal_addons.ljaddInsets")).split("\x0c");
		for(var i = 0; i < optList.length; i++)
		{
			var params = optList[i].split("\x0b");
			var option = document.createElement("option");
			option.value = params[0];
			option.innerHTML = params[0];
			list.appendChild(option);
		}

		list.onchange = function()
		{
			var optList = decodeURI(localStorage.getItem("livejournal_addons.ljaddInsets")).split("\x0c");
			var params = optList[this.selectedIndex].split("\x0b");
			document.getElementById("insets_name").value = params[0];
			document.getElementById("insets_text").value = params[1];
			if(params.length > 2)
				document.getElementById("insets_url").value = params[2];
			else
				document.getElementById("insets_url").value = "";
		};

		var random = document.getElementById("insets_random");
		random.value = decodeURI(localStorage.getItem("livejournal_addons.ljaddRandomQuotes"));
		random.onchange = function(){changed = true;};
		document.getElementById("insets_name").value = "";
		document.getElementById("insets_text").value = "";
		document.getElementById("insets_url").value = "";
		document.getElementById("insets_check").checked = false;

		var block = document.getElementById("insets_insetblock");
		block.checked = localStorage.getItem("livejournal_addons.ljaddAddInsetBlock") == "true" ? true : false;
		block.onchange = function(){
			changed = true;
			var place = document.getElementsByName("insets_insetblockplace");
			for(var i = 0; i < place.length; i++)
				place[i].disabled = !document.getElementById("insets_insetblock").checked;
		};
		var place = document.getElementsByName("insets_insetblockplace");
		place[Number(localStorage.getItem("livejournal_addons.ljaddAddInsetBlockPlace"))].checked = true;
		for(var i = 0; i < place.length; i++)
		{
			place[i].disabled = !block.checked;
			place[i].onchange = function(){changed = true;};
		}
	}
	else if(id == "communication")
	{
		var userpics = document.getElementById("communication_userpics");
		userpics.checked = localStorage.getItem("livejournal_addons.ljaddRandomizeUserpics") == "true" ? true : false;
		userpics.onchange = function(){changed = true;};

		var combuttons = document.getElementById("communication_commentbuttons");
		combuttons.checked = localStorage.getItem("livejournal_addons.ljaddAddCommentButtons") == "true" ? true : false;
		combuttons.onchange = function(){changed = true;};

		/*var styleMine = document.getElementById("communication_stylemine");
		styleMine.checked = localStorage.getItem("livejournal_addons.ljaddStyleMine") == "true" ? true : false;
		styleMine.onchange = function(){changed = true;};
		*/
		var comUnfolders = document.getElementById("communication_comunfolders");
		comUnfolders.checked = localStorage.getItem("livejournal_addons.ljaddCommentUnfolders") == "true" ? true : false;
		comUnfolders.onchange = function(){changed = true;};

		var unfolderSize = document.getElementById("communication_unfoldersize");
		unfolderSize.value = localStorage.getItem("livejournal_addons.ljaddUnfolderSize");
		unfolderSize.onchange = function(){changed = true;};

		var hideFolders = document.getElementById("communication_hidecomfolders");
		hideFolders.checked = localStorage.getItem("livejournal_addons.ljaddHideCommentFolders") == "true" ? true : false;
		hideFolders.onchange = function(){changed = true;};

		var autoUnfold = document.getElementById("communication_autounfold");
		autoUnfold.checked = localStorage.getItem("livejournal_addons.ljaddAutoUnfold") == "true" ? true : false;
		autoUnfold.onchange = function()
		{
			document.getElementById("communication_allpages").disabled = !autoUnfold.checked
			changed = true;
		};

		var allPages = document.getElementById("communication_allpages");
		if(localStorage.getItem("livejournal_addons.ljaddAutoUnfold") == "true")
			allPages.disabled = false;
		else
			allPages.disabled = true;
		allPages.checked = localStorage.getItem("livejournal_addons.ljaddAutoUnfoldAllPages") == "true" ? true : false;
		allPages.onchange = function(){changed = true;};

		var search = document.getElementById("communication_search");
		search.value = decodeURI(localStorage.getItem("livejournal_addons.ljaddLinkSearch"));
		search.onchange = function(){changed = true;};
	}
	else if(id == "changes")
	{
	}
}

function insets_New()
{
	document.getElementById("insets_list").selectedIndex = -1;
	var name = document.getElementById("insets_name");
	name.value = "";
	name.focus();
	document.getElementById("insets_text").value = "";
}

function insets_Save()
{
	var name = document.getElementById("insets_name");
	var text = document.getElementById("insets_text");
	var url = document.getElementById("insets_url");
	var check = document.getElementById("insets_check");
	var index = document.getElementById("insets_list").selectedIndex;
	if(name.value == "" && index != -1)
	{
		insets_Delete();
		return;
	}
	else if(name.value == "")
		return;

	var add = (check.checked && url.value != "" ? url.value : name.value)
				+ "\x0b"
				+ text.value
				+ (url.value != "" ? "\x0b" + url.value : "");

	if(index == -1)
	{
		localStorage.setItem("livejournal_addons.ljaddInsets", encodeURI(decodeURI(localStorage.getItem("livejournal_addons.ljaddInsets")) + "\x0c" + add));
		prepareTab(selected);
		var list = document.getElementById("insets_list");
		list.selectedIndex = list.childNodes.length - 1;
	}
	else
	{
		var optList = decodeURI(localStorage.getItem("livejournal_addons.ljaddInsets")).split("\x0c");
		var result = "";
		for(var i = 0; i < optList.length; i++)
		{
			if(i != index)
				result += optList[i];
			else
				result += add;
			if(i != optList.length - 1)
				result += "\x0c";
		}
		localStorage.setItem("livejournal_addons.ljaddInsets", encodeURI(result));
		prepareTab(selected);
		var list = document.getElementById("insets_list");
		list.selectedIndex = index;
	}
	list.onchange();
}

function insets_Delete()
{
	var index = document.getElementById("insets_list").selectedIndex;
	if(index == -1)
		return;

	var optList = decodeURI(localStorage.getItem("livejournal_addons.ljaddInsets")).split("\x0c");
	var result = "";
	for(var i = 0; i < optList.length; i++)
	{
		if(i != index)
		{
			result += optList[i];
			if(i == optList.length - 1 || (index == optList.length - 1 && i == index - 1))
				continue;

			result += "\x0c";
		}
	}
	localStorage.setItem("livejournal_addons.ljaddInsets", encodeURI(result));
	document.getElementById("insets_name").value = "";
	document.getElementById("insets_text").value = "";
	prepareTab(selected);
}

function apply()
{
	if(selected == "reading")
	{
		localStorage.setItem("livejournal_addons.ljaddMainURL", document.getElementById("reading_ljurl").value);
		localStorage.setItem("livejournal_addons.ljaddFrPgURL", document.getElementById("reading_fpurl").value);
		localStorage.setItem("livejournal_addons.ljaddFullProfile", document.getElementById("reading_fullprofile").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAddCutUnfolders", document.getElementById("reading_cutunfolders").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAddTriggersOpt", document.getElementById("reading_linkicons").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAddTriggersImagesOpt", document.getElementById("reading_imgicons").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAddTriggersIntervalShow", document.getElementById("reading_show").value);
		localStorage.setItem("livejournal_addons.ljaddAddTriggersIntervalHide", document.getElementById("reading_hide").value);
		localStorage.setItem("livejournal_addons.ljaddFriendsPageMaxWidthOpt", document.getElementById("reading_imgmaxwidth").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddFriendsPageMaxWidth", document.getElementById("reading_imgmaxwidthpx").value);
		localStorage.setItem("livejournal_addons.ljaddMinImageWidthForBrowseOpt", document.getElementById("reading_imgbrowsemin").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddMinImageWidthForBrowse", document.getElementById("reading_imgbrowseminpx").value);
		localStorage.setItem("livejournal_addons.ljaddFormatAppendOpt", document.getElementById("reading_open").checked ? "true" : "false");
		var radio = document.getElementsByName("reading_opentype");
		localStorage.setItem("livejournal_addons.ljaddFormatAppendStyle", radio[0].checked ? 0 : radio[1].checked ? 1 : 2);
		localStorage.setItem("livejournal_addons.ljaddFormatAppendFilterList", document.getElementById("reading_urls").value);
		localStorage.setItem("livejournal_addons.ljaddUserTips", document.getElementById("reading_tips").value);
		localStorage.setItem("livejournal_addons.ljaddUserTipsOpt", document.getElementById("reading_tipsopt").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljInstantComment", document.getElementById("reading_ljinstantcomment").checked ? "true" : "false");
	}
	else if(selected == "checking")
	{
		localStorage.setItem("checks.ljaddFriendsPageCheckOpt", document.getElementById("checking_preiodfpopt").checked ? "true" : "false");
		localStorage.setItem("ljaddFriendsPageCheckInterval", document.getElementById("checking_periodfp").value);
		localStorage.setItem("ljaddFriendsPageUpdate", document.getElementById("checking_afterfp").checked ? "true" : "false");
		localStorage.setItem("ljaddNotificationOpt", document.getElementById("checking_showpopup").checked ? "true" : "false");
		localStorage.setItem("ljaddBadgeOpt", document.getElementById("checking_showbadge").checked ? "true" : "false");
		var showMenu = document.getElementsByName("checking_iconaction")[0].checked;
		localStorage.setItem("ljaddIconClickAction", showMenu ? 0 : 1);
		if(showMenu)
			chrome.browserAction.setPopup({popup: "popup.html"});
		else
			chrome.browserAction.setPopup({popup: ""});
		chrome.extension.getBackgroundPage().ljaddCheckFriendsPage();
	}
	else if(selected == "insets")
	{
		var random = document.getElementById("insets_random");
		localStorage.setItem("livejournal_addons.ljaddRandomQuotes", encodeURI(random.value));
		localStorage.setItem("livejournal_addons.ljaddAddInsetBlock", document.getElementById("insets_insetblock").checked ? "true" : "false");
		var place = document.getElementsByName("insets_insetblockplace");
		localStorage.setItem("livejournal_addons.ljaddAddInsetBlockPlace", place[0].checked ? 0
																		 : place[1].checked ? 1
																		 : place[2].checked ? 2
																		 : place[3].checked ? 3 : 4);
	}
	else if(selected == "communication")
	{
		localStorage.setItem("livejournal_addons.ljaddRandomizeUserpics", document.getElementById("communication_userpics").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAddCommentButtons", document.getElementById("communication_commentbuttons").checked ? "true" : "false");
		//localStorage.setItem("livejournal_addons.ljaddStyleMine", document.getElementById("communication_stylemine").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddCommentUnfolders", document.getElementById("communication_comunfolders").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddUnfolderSize", document.getElementById("communication_unfoldersize").value);
		localStorage.setItem("livejournal_addons.ljaddHideCommentFolders", document.getElementById("communication_hidecomfolders").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAutoUnfold", document.getElementById("communication_autounfold").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddAutoUnfoldAllPages", document.getElementById("communication_allpages").checked ? "true" : "false");
		localStorage.setItem("livejournal_addons.ljaddLinkSearch", encodeURI(document.getElementById("communication_search").value));
	}
	changed = false;
}

function reset()
{
	if(!confirm(chrome.i18n.getMessage("ljaddResetToDefaults")))
		return;

	resetDefaultsByType(selected);

	prepareTab(selected);
}

function ok()
{
	apply();
	window.close();
}

function cancel()
{
	window.close();
}

function init()
{
	var numbers = document.getElementsByClassName("numbers");
	for(var i = 0; i < numbers.length; i++)
	{
		numbers[i].old = "";
		numbers[i].onkeyup = function(event)
		{
			var value = Number(this.value);
			if(isNaN(value) || value < 0 || Math.round(value) != value || this.value.indexOf('.') != -1)
				this.value = this.old;
			else
				this.old = this.value;
		};
		numbers[i].onpaste = function(event)
		{
			alert(1);
		};
	}

	var msgs = document.getElementsByClassName("msg");
	for(var i = 0; i < msgs.length; i++)
	{
		msgs[i].innerHTML = chrome.i18n.getMessage(msgs[i].id);
	}

	var omsgs = document.getElementsByClassName("omsg");
	for(var i = 0; i < omsgs.length; i++)
	{
		omsgs[i].value = chrome.i18n.getMessage(omsgs[i].getAttribute("msg"));
	}

	var tmsgs = document.evaluate(
		".//*[@tmsg]",
		document.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null
	);

	for(var i = 0, curTmsg; curTmsg = tmsgs.snapshotItem(i); i++)
	{
		curTmsg.title = chrome.i18n.getMessage(curTmsg.getAttribute("tmsg"));
	}
}