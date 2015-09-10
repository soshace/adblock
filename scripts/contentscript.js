'use strict';

(function () {
    var AD_SELECTORS = {
        youtube: ".ad-container, .ad-div, .ad-container-single-media-element-annotations, .html5-ad-progress-list, .google_companion_ad_div, .adDisplay, #google_companion_ad_div",
        adsense: ":regex(id,^(google_ads|aswift))",
        adwords: ":regex(id,^bottomads$|^taw$|^rhs$)",
        twitter: ":regex(role,^presentation$)",
        facebook: ":regex(class,.*cardRightCol.*)",
        bing: ":regex(class,^b_ad$)",
        doubleclick: ":regex(class,.*GoogleActiveViewClass.*)"
    },
        checkInterval;

    var hideVideoIndex;

    function hideVideoAds() {
        if (document.getElementsByClassName('videoAdUi').length > 0) {
            document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        }
    }

    function gerAds(selector) {
        return $(AD_SELECTORS[selector]);
    }

    function hideAds(selector) {
        var elems = gerAds(selector);
        for (var i = 0; i < elems.length; i++) {
            var elem = $(elems[i]);
            elem.hide();
            if (elem.width() == elem.parent().width() && elem.height() == elem.parent().height()) {
                elem.parent().hide()
            }
        }
        hideVideoAds();
    }

    function showAds(selector) {
        var elems = gerAds(selector);
        for (var i = 0; i < elems.length; i++) {
            var elem = $(elems[i]);
            elem.show();
            elem.parent().show()
        }
        window.clearInterval(hideVideoIndex);
    }

    function clearAds(selector) {
        console.log(selector);
        chrome.storage.sync.get("youtubePluginEnable", function (items) {
            if (items.youtubePluginEnable) {
                $(hideAds, 50, selector);
                setTimeout(hideAds, 100, selector);
                setTimeout(hideAds, 150, selector);
                setTimeout(hideAds, 300, selector);
                setTimeout(hideAds, 500, selector);
                hideVideoIndex = setInterval(hideAds, 1000);
            }
        });
    }

    function syncSet(type) {
        if (type == 'toggleState') {
            togleAds();
            return
        } else if (type == 'hideAds') {
            toggleAds(true);
            return
        } else if (type == 'showAds') {
            toggleAds(false);
            return
        }
        var state = type.split('-')[0],
            ad = type.split('-')[1],
            enable = (state == 'enable')
            ;
        chrome.storage.sync.set({"youtubePluginEnable": enable, ad: ad});
        if (enable) {
            clearAds(ad);
            return;
        }
        showAds(ad);
    }

    chrome.extension.onMessage.addListener(function (message) {
        syncSet(message.type);
    });

    checkAd();
    $(document).ready(function () {
        //togleAds();
        chrome.storage.local.set({'adsBlocked': true}, function () {});
        setTimeout(function () {
            clearInterval(checkInterval);
        }, 15000)

    });

    function checkAd() {
        var state, isChecked;
        checkInterval = setInterval(function () {
            chrome.storage.local.get('state', function (result) {
                state = result['state'];
                isChecked = (state === 'on');
                if (isChecked) {
                    toggleAds(true);
                } else {
                    toggleAds(false);
                }
            });
        }, 500);
    }
    function togleAds() {
        chrome.storage.local.get('ads', function (result) {
            var action;
            getState(function (blockAd) {
                if (blockAd) {
                    action = hideAds;
                } else {
                    action = showAds;
                }
                chrome.storage.local.set({'adsBlocked': !blockAd}, function () {
                });
                for (var prop in result['ads']) {
                    if (result['ads'][prop]) {
                        action(prop);
                    }
                }
            });
        });

    }

    function toggleAds(hide) {
        chrome.storage.local.get('ads', function (result) {
            var action;
            if (hide) {
                action = hideAds;
            } else {
                action = showAds;
            }
            chrome.storage.local.set({'adsBlocked': !hide}, function () {
            });
            for (var prop in result['ads']) {
                if (result['ads'][prop]) {
                    action(prop);
                }
            }
        });
    }

    function getState(callback) {
        chrome.storage.local.get('adsBlocked', function (result) {
            callback(result['adsBlocked']);
        });
    }

    clearAds();
})();