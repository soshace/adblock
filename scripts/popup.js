'use strict';

$(function () {
    var bg = chrome.extension.getBackgroundPage(),
        $optionsButton = $('#optButton'),
        $toggleButton = $('#hideAdBtn'),
        $toggleCheckbox = $('#toggleCheckbox')
        ;

    function activateEnableTab(ad) {
        var elem = $('[data="' + ad + '"]').eq(0);
        elem.addClass('active');
    }

    function deactivateEnableTab(ad) {
        var elem = $('[data="' + ad + '"]').eq(0);
        elem.removeClass('active');
    }

    function toggleState(elem) {
        chrome.tabs.getSelected(null, function (tab) {
            var ad = elem.data('adblock'),
                state;
            state = elem.hasClass('active') ? 'disable' : 'enable';
            bg.console.log(state);
            chrome.tabs.sendMessage(tab.id, {type: state + '-' + ad});
            state == 'enable' ? elem.addClass('active') : elem.removeClass('active');
            state == 'enable' ? elem.text(elem.data('showtext')) : elem.text(elem.data('hidetext'));
            //state == 'enable' ? activateEnableTab(ad) :  deactivateEnableTab(ad);
        });
    }

    chrome.storage.sync.get('youtubePluginEnable', function (items) {
        if (items.youtubePluginEnable) {
            activateEnableTab(items.ad);
        } else {
            deactivateEnableTab(items.ad);
        }
    });

    $optionsButton.on('click', function () {
        chrome.tabs.create({ url: "options.html" });
    });

    $toggleButton.on('click', function () {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {type: "toggleState"});
        });
    });
    $toggleCheckbox.on('click', function(event) {
        var elem = this;
        var sel = window.getSelection();
        chrome.tabs.getSelected(null, function (tab) {
            if ($(elem).is(':checked')) {
                chrome.tabs.sendMessage(tab.id, {type: "hideAds"});

            } else {
                chrome.tabs.sendMessage(tab.id, {type: "showAds"});
            }
        });
        sel.removeAllRanges();
    })
});