$(function () {
    $('#answerTable').DataTable();
    $('#totalTable').DataTable();

    $('[data-toggle="popover"]').popover();

    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

    $('#type').on('change', function () {
        if($(this).val() === 'Wea')
            $('#firstFormBtn').html('Search');
        else
            $('#firstFormBtn').html('Next');
    });

   $('#first-form').on('submit', function (e) {
      e.preventDefault();

      if($('#type').val() === 'Wea' && $('#firstFormBtn').html() !== 'Searching...')
          webScrap();
      else
          $(this).fadeOut(1000, function () {
              var researchSelect = $('#research').val();

              if(researchSelect === 'N/A') {
                  var $neuroptics = $('#neuroptic_res');
                  $neuroptics.bootstrapToggle('destroy').bootstrapToggle({off: 'Not Applicable'});
                  $neuroptics.attr('disabled', true);

                  var $chassis = $('#chassis_res');
                  $chassis.bootstrapToggle('destroy').bootstrapToggle({off: 'Not Applicable'});
                  $chassis.attr('disabled', true);

                  var $systems = $('#systems_res');
                  $systems.bootstrapToggle('destroy').bootstrapToggle({off: 'Not Applicable'});
                  $systems.attr('disabled', true);

                  var $frame = $('#frame_res');
                  $frame.bootstrapToggle('destroy').bootstrapToggle({off: 'Not Applicable'});
                  $frame.attr('disabled', true);
              }
              else if(researchSelect === 'Y') {
                  var $neuroptics = $('#neuroptic_res');
                  $neuroptics.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $neuroptics.prop('checked', true).change();
                  $neuroptics.attr('disabled', true);

                  var $chassis = $('#chassis_res');
                  $chassis.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $chassis.prop('checked', true).change();
                  $chassis.attr('disabled', true);

                  var $systems = $('#systems_res');
                  $systems.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $systems.prop('checked', true).change();
                  $systems.attr('disabled', true);

                  var $frame = $('#frame_res');
                  $frame.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $frame.prop('checked', true).change();
                  $frame.attr('disabled', true);
              }
              else {
                  var $neuroptics = $('#neuroptic_res');
                  $neuroptics.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $neuroptics.prop('checked', false).change();

                  var $chassis = $('#chassis_res');
                  $chassis.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $chassis.prop('checked', false).change();

                  var $systems = $('#systems_res');
                  $systems.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $systems.prop('checked', false).change();

                  var $frame = $('#frame_res');
                  $frame.bootstrapToggle('destroy').bootstrapToggle({on: 'Research Done', off: 'Research Pending'});
                  $frame.prop('checked', false).change();
              }

              $('.pull-right').prop('checked', false).change();
              $('#second-form').fadeIn(1000);
          });
   });

    $('#second-form').on('submit', function (e) {
        e.preventDefault();

        if($('#secondFormBtn').html() !== 'Searching...')
            webScrap();
    });
});

function webScrap() {
    var $firstBtn = $('#firstFormBtn');
    var $secondBtn = $('#secondFormBtn');

    $firstBtn.html('Searching...');
    $secondBtn.html('Searching...');

    $firstBtn.attr('disabled', true);
    $secondBtn.attr('disabled', true);

    appController.getResourcesInfo( $('#first-form').serialize()  + "&" +  $('#second-form').serialize(), function (requestData, textStatus) {
        console.log(requestData);

        var $firstForm = $('#first-form');
        var $secondForm= $('#second-form');

        $secondForm.fadeOut(1000, function () {
            $firstForm.fadeIn(1000);
        });

        $firstForm[0].reset();
        $secondForm[0].reset();

        if(requestData.success === 1)
            loadTables(requestData);
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

function loadTables(requestData) {
    var $answerTable = $('#answerTable');
    var $totalTable =  $('#totalTable');

    $answerTable.DataTable().destroy();
    $totalTable.DataTable().destroy();

    var $tbodyAnswer = $answerTable.find('tbody');
    var $tbodyTotal = $totalTable.find('tbody');

    $tbodyAnswer.empty();
    $tbodyTotal.empty();

    for (var key in requestData.total) {
        var build = 0, research = 0, total = 0;

        if (requestData.total.hasOwnProperty(key))
            total = requestData.total[key];

        if (requestData.build.hasOwnProperty(key))
            build = requestData.build[key];

        if (requestData.research.hasOwnProperty(key))
            research = requestData.research[key];

        if (total === (build + research)) {
            var link, keyArray = key.split(" ");
            if(ignoreParts.includes(keyArray.pop()))
                link = '<a target="_blank" href="https://warframe.fandom.com/wiki/'+ keyArray.join(" ").replace(" ", "_") +'">' + key + '</a>';
            else
                link = '<a target="_blank" href="https://warframe.fandom.com/wiki/'+ key.replace(" ", "_") +'">' + key + '</a>';

            var row =
                '<tr>' +
                '<td>' + link + '</td>' +
                '<td>' + build.format(0, 3) + '</td>' +
                '<td>' + research.format(0, 3) + '</td>' +
                '<td>' + total.format(0, 3) + '</td>' +
                '</tr>';

            $tbodyAnswer.append(row);
            addToPreviousSearches(key, build, research, total);
        }
    }

    for (var keyTotal in resourcesTotal) {
        var buildTotal = 0, researchTotal = 0, totalTotal = 0;

        if (resourcesTotal.hasOwnProperty(keyTotal))
            totalTotal = resourcesTotal[keyTotal];

        if (resourcesBuild.hasOwnProperty(keyTotal))
            buildTotal = resourcesBuild[keyTotal];

        if (resourcesResearch.hasOwnProperty(keyTotal))
            researchTotal = resourcesResearch[keyTotal];

        if (total === (build + research)) {
            var linkTotal, keyTotalArray = keyTotal.split(" ");
            if(ignoreParts.includes(keyTotalArray.pop()))
                linkTotal = '<a target="_blank" href="https://warframe.fandom.com/wiki/'+ keyTotalArray.join(" ").replace(" ", "_") +'">' + keyTotal + '</a>';
            else
                linkTotal = '<a target="_blank" href="https://warframe.fandom.com/wiki/'+ keyTotal.replace(" ", "_") +'">' + keyTotal + '</a>';

            var rowTotal =
                '<tr>' +
                    '<td>' + linkTotal + '</td>' +
                    '<td>' + buildTotal.format(0, 3) + '</td>' +
                    '<td>' + researchTotal.format(0, 3) + '</td>' +
                    '<td>' + totalTotal.format(0, 3) + '</td>' +
                '</tr>';

            $tbodyTotal.append(rowTotal);
        }
    }

    $answerTable.DataTable();
    $totalTable.DataTable();

    if($('#scrollToggle').prop('checked'))
        $("html, body").animate({ scrollTop: $('.tm-section-2').offset().top}, 1000);

    var $firstBtn = $('#firstFormBtn');
    var $secondBtn = $('#secondFormBtn');

    $firstBtn.html('Search');
    $secondBtn.html('Search');

    $firstBtn.removeAttr('disabled');
    $secondBtn.removeAttr('disabled');

    $('#lastSearch').html("(" + requestData.params.url +")");
    previousSearches.push({"type": requestData.params.type === 'Wea' ? 'Weapon/Sentinel' : 'Warframe/Archwing', "url": requestData.params.url});

    var content = '';
    for(var search in previousSearches) {
        content += (previousSearches[search].type + ", " + previousSearches[search].url + "\n");
    }

    $('#previousSearches').attr('data-content', content);
}

var resourcesTotal = [], resourcesBuild = [], resourcesResearch = [];
function addToPreviousSearches(key, build, research, total) {
    if(resourcesBuild.hasOwnProperty(key))
        resourcesBuild[key] += build;
    else
        resourcesBuild[key] = build;

    if(resourcesResearch.hasOwnProperty(key))
        resourcesResearch[key] += research;
    else
        resourcesResearch[key] = research;

    if(resourcesTotal.hasOwnProperty(key))
        resourcesTotal[key] += total;
    else
        resourcesTotal[key] = total;
}

Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

var ignoreParts = ['Chassis', 'Systems', 'Neuroptics', 'Wings', 'Harness', 'Stock', 'Receiver', 'Barrel', 'Upper Limb', 'Lower Limb', 'Grip', 'String', 'Blade', 'Handle', 'Stars', 'Pouch'];
var previousSearches = [];