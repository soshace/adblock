'use strict';

(function () {
    var hideVideoIndex;

    function hideVideoAds() {
        if (document.getElementsByClassName('videoAdUi').length > 0) {
            document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        }
    }

    function gerAds(){
        return $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div, .adDisplay, #google_companion_ad_div');
    }

    function hideAds() {
        gerAds().hide();
        hideVideoAds();
    }

    function showAds() {
        gerAds().show();
        window.clearInterval(hideVideoIndex);
    }

    function clearAds() {
        chrome.storage.sync.get("youtubePluginEnable", function (items) {
            if (items.youtubePluginEnable) {
                $(hideAds, 50);
                setTimeout(hideAds, 100);
                setTimeout(hideAds, 150);
                setTimeout(hideAds, 300);
                setTimeout(hideAds, 500);
                hideVideoIndex = setInterval(hideAds, 1000);
            }
        });
    }

    chrome.extension.onMessage.addListener(function (message) {
        switch (message.type) {
            case "enableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": true});
                clearAds();
                break;
            case "disableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": false});
                showAds();
                break;
        }
    });

    clearAds();
})();