'use strict';

$(function () {
    var bg = chrome.extension.getBackgroundPage(),
        buttons = [
            $('.youtube-ads'),
            $('.adsense-ads'),
            $('.adwords-ads'),
            $('.twitter-ads'),
            $('.facebook-ads')
        ]
        ;

    function activateEnableTab(ad) {
        var elem = $('[data="'+ad+'"]').eq(0);
        elem.addClass('active');
    }

    function deactivateEnableTab(ad) {
        var elem = $('[data="'+ad+'"]').eq(0);
        elem.removeClass('active');
    }
    function toggleState (elem) {
        chrome.tabs.getSelected(null, function (tab) {
            var ad = elem.data('adblock'),
                state;
            state = elem.hasClass('active') ? 'disable' : 'enable';
            bg.console.log(state);
            chrome.tabs.sendMessage(tab.id, {type: state+'-'+ad});
            state == 'enable' ? elem.addClass('active') : elem.removeClass('active');
            state == 'enable' ?  elem.text(elem.data('showtext')) :  elem.text(elem.data('hidetext'));
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

    for (var i=0; i<buttons.length; i++) {
        buttons[i].on('click', function () {
            var $this = $(this);
            toggleState($this);
        });
    }

});