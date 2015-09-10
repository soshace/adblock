$(function(){
    var $hideAdForm = $('#hideAdForm'),
        $adCheckboxes = $hideAdForm.find('input[type="checkbox"]'),
        adObject = {};

    function restoreOptions() {
        chrome.storage.local.get('ads', function(result) {
            for (var prop in result['ads']) {
                adObject[prop] = result['ads'][prop];
                $hideAdForm.find('input[name="'+prop+'"]').prop('checked', adObject[prop]);
            }
        });
    }

    function saveOptions() {
        var adName = $(this).attr('name');

        adObject[adName] = $(this).prop('checked');
        chrome.storage.local.set({'ads': adObject}, function () {});
    }


    restoreOptions();

    $adCheckboxes.on('click', saveOptions);
});