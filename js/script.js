var spells, items, monsters, classes;

$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: 'spells.xml',
    crossDomain: true,
    dataType: 'xml',
    success: parseSpells
  });

  $('.typeahead').bind("typeahead:active", function(ev){
    $('.typeahead').typeahead('val', '');
  });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    var sp = getInfo(suggestion);

    createCard(sp);
  });
});

function createCard(info){
  switch(info.nodeName) {
    case "spell": 
      $(".typeahead").blur();
      $("#name").text($(info).find("name").text());
      $("#level").text($(info).find("level").text());
      $("#school").text($(info).find("school").text());
      $("#range").text($(info).find("range").text());
      $("#components").text($(info).find("components").text());
      $("#duration").text($(info).find("duration").text());
      $("#classes").text($(info).find("classes").text());

      //wrap each text in p tags
      var str = "";
      $.each($(info).find("text"), function(i, k){
        str += "<p>" + k.textContent + "</p>";
      })
      $("#description").html(str);

      //show it too
      $("#results").show();
      break;
    case "monster":
      break;
    case "class":
      break;
    case "item":
      break;
  }
}

function parseSpells(xml)
{
  spells = $(xml).find("spell");
  $.ajax({
    type: 'GET',
    url: 'items.xml',
    dataType: 'xml',
    success: parseItems
  });
}

function parseItems(xml){
  items = $(xml).find("item");
  $.ajax({
    type: 'GET',
    url: 'monsters.xml',
    dataType: 'xml',
    success: parseMonsters
  });
}

function parseMonsters(xml){
  monsters = $(xml).find("monster");
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
    name: 'spells',
    source: spellSubstringMatcher(spells),
    limit: 10,
    templates: {
      header: '<h4 id="queryheader">Spells</h4>'
    }
  },
  // {
  //   name: 'classes',
  //   source: classSubstringMatcher(classes),
  //   limit: 2
  // },
  {
    name: 'items',
    source: itemSubstringMatcher(items),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Items</h4>'
    }
  },
  {
    name: 'monsters',
    source: monsterSubstringMatcher(monsters),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Monsters</h4>'
    }
  });
}

function spellSubstringMatcher(strs) {
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

function classSubstringMatcher(strs){

}

function itemSubstringMatcher(strs){
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
}

function monsterSubstringMatcher(strs){
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test($($(str).find("name")[0]).text())) {
        matches.push($($(str).find("name")[0]).text());
      }
    });

    cb(matches);
  };
}

function getInfo(sug){
  var ret;

  //find sug's type for createCard
  $.each(spells, function(i, spell){
    if($(spell).find("name").text() == sug){
      ret = spell;
      return false;
    }
  });
  return ret;
}