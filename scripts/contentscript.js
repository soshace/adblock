'use strict';

(function () {
    var hideVideoIndex,
        $ads = $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div');

    function hideVideoAds() {
        if (document.getElementsByClassName('videoAdUi').length > 0) {
            document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        }
    }

    function showVideoAds() {
        window.clearInterval(hideVideoIndex);
    }

    function hideAds() {
        $ads.hide();
        hideVideoAds();
    }

    function showAds() {
        $ads.show();
        showVideoAds();
    }

    function clearAds() {
        chrome.storage.sync.get("youtubePluginEnable", function (items) {
            if (items.youtubePluginEnable) {
                hideAds();
            }
        });
    }

    function startClearingAds() {
        clearAds();
        hideVideoIndex = setInterval(clearAds, 300);
    }

    chrome.extension.onMessage.addListener(function (message) {
        switch (message.type) {
            case "enableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": true});
                startClearingAds();
                break;
            case "disableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": false});
                showAds();
                break;
        }
    });

    startClearingAds();
})();