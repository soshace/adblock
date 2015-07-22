'use strict';

$(function () {
    var $ads = $('.ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div');

    function hideVideoAds() {
        hideVideoAds.timerIndex = setInterval(function () {
            var $videoAd = $('.video-stream .html5-main-video');

            if ($('.videoAdUi').length) {
                if ($videoAd.length) {
                    $videoAd.attr('src', '');
                    window.clearInterval(hideVideoAds.timerIndex);
                }
            }
        }, 150);
    }

    function showVideoAds() {
        window.clearInterval(hideVideoAds.timerIndex);
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

    function onYouTubeIframeAPIReady() {
        clearAds();
    }
});