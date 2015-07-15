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
	var overlayAdContainer, buf1, buf2;
	buf1= [].slice.call(document.getElementsByClassName('ad-container'));
	buf2 = buf1.concat([].slice.call(document.getElementsByClassName('ad-div')));
	buf1 = buf2.concat([].slice.call(document.getElementsByClassName('ad-container-single-media-element-annotations')));
	overlayAdContainer = buf1.concat(document.getElementById('google_companion_ad_div'));
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
		if(enable)
		{
			skipVideoAd();
			hideOverlayAd();
		}
	});
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "enableYouTubePlugin":
			chrome.storage.sync.set({ "youtubePluginEnable": true });
			clearAds();
        break;
		case "disableYouTubePlugin":
			chrome.storage.sync.set({ "youtubePluginEnable": false });
        break;
    }
});

window.setInterval(
	function(){
		clearAds();
	}, 300);
