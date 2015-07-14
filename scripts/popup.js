'use strict';

console.log('Popup: show msg');

function enable(e) {
  console.log("set page color click");
  
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(
      tab.id, 
      {type: "enableYouTubePlugin"}, 
      function(response) {
        console.log(response.farewell);
      }
    );
  });
  var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
  addClass(enableElem, "active");
  removeClass(disableElem, "active");
}

function disable(e) {
  console.log("set page color click");
  
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(
      tab.id, 
      {type: "disableYouTubePlugin"}, 
      function(response) {
        console.log(response.farewell);
      }
    );
  });
  
   var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
  addClass(disableElem, "active");
  removeClass(enableElem, "active");
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
    var port = chrome.extension.connect({ name: "color-divs-port" });
	var enableElem = document.getElementById("enable"),
	disableElem = document.getElementById("disable");
	console.log('Popup: show msg');
	enableElem.addEventListener("click", enable);
	disableElem.addEventListener("click", disable);
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
}