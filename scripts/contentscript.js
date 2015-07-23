'use strict';

(function () {
    var hideVideoIndex;

    function getAds() {
        return $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div, .adDisplay');
    }

    function hideVideoAds() {
        if (document.getElementsByClassName('videoAdUi').length > 0) {
            document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        }
    }

    function hideAds() {
        getAds().hide();
        hideVideoAds();
    }

    function showAds() {
        $ads.show();
        window.clearInterval(hideVideoIndex);
    }

    function clearAds() {
        chrome.storage.sync.get("youtubePluginEnable", function (items) {
            if (items.youtubePluginEnable) {
                hideVideoIndex = setInterval(hideAds, 300);
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