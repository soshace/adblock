'use strict';

$(function () {
    var $ads = $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div');

    function skipVideoAd() {
        if (document.getElementsByClassName('videoAdUi').length > 0) {
            document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        }
    }

    function hideAds() {
        $ads.hide();
        skipVideoAd();
    }

    function showAds() {
        $ads.show();
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

    function onYouTubeIframeAPIReady() {
        clearAds();
    }
});