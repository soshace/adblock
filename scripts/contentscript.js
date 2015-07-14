'use strict';

var DEBUG = window.adbYtDebug || false;

var adbYtLog = function(msg) {
	if (console && DEBUG) {
		console.warn(msg);
	}
};

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var player = document.querySelector('#player');

function skipVideoAd() {

	if (document.getElementsByClassName('videoAdUi').length > 0) {
		adbYtLog('skiping video ad');
		document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
	}
}

function hideOverlayAd() {

	var overlayAdContainer = document.getElementsByClassName('ad-container');
	for (var i=0; i<overlayAdContainer.length; i++)
	{	
		if (overlayAdContainer[i] && overlayAdContainer[i].style.display !== 'none') {
			adbYtLog('hide overlay ad');
			overlayAdContainer[i].style.display = 'none';
		}
	}
	overlayAdContainer = document.getElementsByClassName('ad-div');
	for (var i=0; i<overlayAdContainer.length; i++)
	{	
		if (overlayAdContainer[i] && overlayAdContainer[i].style.display !== 'none') {
			adbYtLog('hide overlay ad');
			overlayAdContainer[i].style.display = 'none';
		}
	}
	overlayAdContainer = document.getElementsByClassName('ad-container-single-media-element-annotations');
	for (var i=0; i<overlayAdContainer.length; i++)
	{	
		if (overlayAdContainer[i] && overlayAdContainer[i].style.display !== 'none') {
			adbYtLog('hide overlay ad');
			overlayAdContainer[i].style.display = 'none';
		}
	}
	overlayAdContainer = document.getElementsByTagName('iframe');
	for (var i=0; i<overlayAdContainer.length; i++)
	{	
		if (overlayAdContainer[i] && overlayAdContainer[i].style.display !== 'none') {
			adbYtLog('hide overlay ad');
			overlayAdContainer[i].style.display = 'none';
		}
	}
}

function clearAds() {
	chrome.storage.sync.get("youtubePluginEnable", function(items){
		var enable = items.youtubePluginEnable;
		console.log(enable);
		if(enable)
		{
			skipVideoAd();
			hideOverlayAd();
		}
	});
}

function DOMSTlistener(e) {

	adbYtLog('DOM event listener triggered');

	if (e.target.innerHTML.length > 0) {
		clearAds();
	}
}

function init() {

	var videoAdContainer = document.getElementsByClassName('video-ads html5-stop-propagation')[0];

	if (videoAdContainer) {

		adbYtLog('inited');
		player.removeEventListener('DOMSubtreeModified', init);
		videoAdContainer.addEventListener('DOMSubtreeModified', DOMSTlistener);
	}
}


if (/https?:\/\/(\w*.)?youtube.com/i.test(window.location.href.toLowerCase())) {

	/*if (isChrome) {

		player.addEventListener('DOMSubtreeModified', init);
	} else {
		clearAds();
	}*/
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "enableYouTubePlugin":
			console.log("enable");
			chrome.storage.sync.set({ "youtubePluginEnable": true });
			clearAds();
        break;
		case "disableYouTubePlugin":
			console.log("disable");
			chrome.storage.sync.set({ "youtubePluginEnable": false });
        break;
    }
});

window.setInterval(
	function(){
		clearAds();
	}, 300);
