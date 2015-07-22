'use strict';

$(function () {
    var hideVideoIndex,
        $ads = $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div');

    function hideVideoAds() {
        if ($('.videoAdUi').length) {
            $('.video-stream.html5-main-video').attr('src', '');
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

    chrome.extension.onMessage.addListener(function (message) {
        switch (message.type) {
            case "enableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": true});
                hideAds();
                break;
            case "disableYouTubePlugin":
                chrome.storage.sync.set({"youtubePluginEnable": false});
                showAds();
                break;
        }
    });

    hideVideoIndex = setInterval(function(){
        clearAds();
    }, 300);
    clearAds();
});