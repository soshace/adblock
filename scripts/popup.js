'use strict';

$(function () {
    var bg = chrome.extension.getBackgroundPage(),
        $optionsButton = $('#optButton'),
        $toggleCheckbox = $('#toggleCheckbox')
        ;

    restoreState($toggleCheckbox);
    //chrome.tabs.getSelected(null, function (tab) {
    //    chrome.tabs.sendMessage(tab.id, {type: "popupOpen"});
    //});

    function saveState(state) {
        chrome.storage.local.set({'state': state}, function () {});
    }

    function restoreState($elem) {
        var state, isChecked;
        chrome.storage.local.get('state', function(result) {
            chrome.extension.getBackgroundPage().console.log(result);
            state = result['state'];
            chrome.extension.getBackgroundPage().console.log(state);
            isChecked = (state === 'on');
            chrome.tabs.getSelected(null, function (tab) {
                if (isChecked) {
                    chrome.tabs.sendMessage(tab.id, {type: "hideAds"});
                } else {
                    chrome.tabs.sendMessage(tab.id, {type: "showAds"});
                }
            });
            $elem.prop('checked', isChecked);
        });
    }

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

    $toggleCheckbox.on('click', function(event) {
        var elem = this;
        var sel = window.getSelection();
        chrome.tabs.getSelected(null, function (tab) {
            if ($(elem).is(':checked')) {
                chrome.tabs.sendMessage(tab.id, {type: "hideAds"});
                saveState('on');
            } else {
                chrome.tabs.sendMessage(tab.id, {type: "showAds"});
                saveState('off');
            }
        });
        sel.removeAllRanges();
        //alert(restoreState($toggleCheckbox));
    })
});