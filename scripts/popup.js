'use strict';

function reloadPage(){
	chrome.tabs.getSelected(null, function(tab) {
		var code = 'window.location.reload();';
		chrome.tabs.executeScript(tab.id, {code: code});
	})
}

function enable(e) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(
      tab.id, 
      {type: "enableYouTubePlugin"}, 
      function(response) {
      }
    );
  });
	var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
	addClass(enableElem, "active");
	removeClass(disableElem, "active");
	reloadPage();
	window.close();
}

function disable(e) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(
      tab.id, 
      {type: "disableYouTubePlugin"}, 
      function(response) {
      }
    );
  });
  
	var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
	addClass(disableElem, "active");
	removeClass(enableElem, "active");
	reloadPage();
	window.close();
}

function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

window.onload = function() {
	var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
	chrome.storage.sync.get("youtubePluginEnable", function(items){
		if(items.youtubePluginEnable)
		{
			addClass(enableElem, "active");
			removeClass(disableElem, "active");
		}
		else{
			addClass(disableElem, "active");
			removeClass(enableElem, "active");
		}
	})
	enableElem.addEventListener("click", enable);
	disableElem.addEventListener("click", disable);
}