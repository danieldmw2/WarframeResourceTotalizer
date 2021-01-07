$(function () {
    $('#first-form').on('submit', function (e) {
        e.preventDefault();

        if( $('#firstFormBtn').html() !== 'Downloading...')
            webScrap();
    });
});

function webScrap() {
    var $firstBtn = $('#firstFormBtn');

    $firstBtn.html('Downloading...');
    $firstBtn.attr('disabled', true);

    appController.getOshiInfo( $('#first-form').serialize(), function (requestData, textStatus) {
        console.log(requestData);

        $firstBtn.html('Download');
        $firstBtn.removeAttr('disabled');

        var $firstForm = $('#first-form');
        $firstForm[0].reset();

        if(requestData.success === 1)
            downloadPNGs(requestData);
        else {
            var errorMsg = requestData.success === 0 ? requestData.msg : 'Server is presenting problems at the moment';

            var $alert = $('.alertMessage');
            $alert.html(errorMsg);

            $alert.fadeIn(500, function () {
                setTimeout(function () {
                    $alert.fadeOut(1500);
                }, 2500);
            });
        }
    });
}

function downloadPNGs(requestData) {
    console.log('Stickers:', requestData.stickers);

    var link = document.createElement("a");
    link.download = requestData.zipname;
    link.href = './php/' + requestData.zipname;
    link.click();
}

Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};
