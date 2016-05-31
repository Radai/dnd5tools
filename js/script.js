var spells;

$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: 'spells.xml',
    crossDomain: true,
    dataType: 'xml',
    success: parseXml
  });

  $('.typeahead').bind("typeahead:active", function(ev){
    $('.typeahead').typeahead('val', '');
  });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    $(".typeahead").blur();
    var sp = getInfo(suggestion);
    $("#name").text($(sp).find("name").text());
    $("#level").text($(sp).find("level").text());
    $("#school").text($(sp).find("school").text());
    $("#range").text($(sp).find("range").text());
    $("#components").text($(sp).find("components").text());
    $("#duration").text($(sp).find("duration").text());
    $("#classes").text($(sp).find("classes").text());

    //wrap each text in p tags
    var str = "";
    $.each($(sp).find("text"), function(i, k){
      str += "<p>" + k.textContent + "</p>";
    })
    $("#description").html(str);

    //show it too
    $("#results").show();
  });
});

function parseXml(xml)
{
  spells = $( xml ).find( "spell" );
  setupTA();
}

function setupTA(){
  $('#searchbox .typeahead').typeahead({
    minLength: 2,
    highlight: true,
    hint: true,
    templates: {
       empty: [
        '<div class="empty-message">',
        'no results found',
        '</div>'
      ].join('\n'),
        suggestion: function(data){
          return '<p><strong>' + data + '</strong></p>';
        }
    }
  },
  {
    name: 'my-dataset',
    source: substringMatcher(spells),
    limit: 25
  });
}

function substringMatcher(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test($(str).find("name").text())) {
        matches.push($(str).find("name").text());
      }
    });

    cb(matches);
  };
};

function getInfo(sug){
  var ret;
  $.each(spells, function(i, spell){
    if($(spell).find("name").text() == sug){
      ret = spell;
      return false;
    }
  });
  return ret;
}