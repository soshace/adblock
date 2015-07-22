'use strict';

$(function () {
    var $hideAds = $('.hide-ads');


    function activateEnableTab() {
        $hideAds.addClass('active');
    }

    function deactivateEnableTab() {
        $hideAds.removeClass('active');
    }

    function enable() {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {type: 'enableYouTubePlugin'});
            activateEnableTab();
        });
    }

    function disable() {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {type: 'disableYouTubePlugin'});
            deactivateEnableTab();
        });
    }

    chrome.storage.sync.get('youtubePluginEnable', function (items) {
        if (items.youtubePluginEnable) {
            activateEnableTab();
        } else {
            deactivateEnableTab();
        }
    });

    $hideAds.on('click', function () {
        var $this = $(this);

        if ($this.hasClass('active')) {
            disable();
            return;
        }

        enable();
    });
});