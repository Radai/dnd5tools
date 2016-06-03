var spells, items, monsters;
var races, feats, backgrounds, classes;

$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: 'full.xml',
    crossDomain: true,
    dataType: 'xml',
    success: parseAll
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
  // switch(info.nodeName) {
  //   case "spell": 
    $("#results").empty();
      $(".typeahead").blur();
      var nodes = info.childNodes;
      var firstText = true;

      for(var i = 1; i < nodes.length; i+=2){
        var node = nodes[i];
        var name = node.nodeName;
        if(name != "text"){
          $("#results").append("<label for="+name+">"+name.toTitleCase()+":&nbsp;</label><span id=" + name + ">"+node.textContent+"</span><br />");
        }else{ //if node is text node...
          if(firstText == false){
            $("#results").append("<p>" + node.textContent + "</p>");
          }else{
            $("#results").append("<label for="+name+">Description:&nbsp;</label><span id='description'>"+node.textContent+"</span>");
            firstText = false;
          }
        }
      }

      // $("#name").text($(info).find("name").text());
      // $("#level").text($(info).find("level").text());
      // $("#school").text($(info).find("school").text());
      // $("#range").text($(info).find("range").text());
      // $("#components").text($(info).find("components").text());
      // $("#duration").text($(info).find("duration").text());
      // $("#classes").text($(info).find("classes").text());

      // //wrap each text in p tags
      // var str = "";
      // $.each($(info).find("text"), function(i, k){
      //   str += "<p>" + k.textContent + "</p>";
      // })
      // $("#description").html(str);

      //show it too
      $("#results").show();
    //   break;
    // case "monster":
    //   break;
    // case "class":
    //   break;
    // case "item":
    //   break;
  // }
}
function parseAll(xml){
  spells = $(xml).find("spell");
  items = $(xml).find("item");
  monsters = $(xml).find("monster");
  classes = $(xml).find("class");
  races = $(xml).find("race");
  feats = $(xml).find("feat");
  backgrounds = $(xml).find("background");
  setupTA();
}

// function parseSpells(xml)
// {
//   spells = $(xml).find("spell");
//   $.ajax({
//     type: 'GET',
//     url: 'items.xml',
//     dataType: 'xml',
//     success: parseItems
//   });
// }

// function parseItems(xml){
//   items = $(xml).find("item");
//   $.ajax({
//     type: 'GET',
//     url: 'monsters.xml',
//     dataType: 'xml',
//     success: parseMonsters
//   });
// }

// function parseMonsters(xml){
//   monsters = $(xml).find("monster");
//   $.ajax({
//     type: 'GET',
//     url: 'ph.xml',
//     dataType: 'xml',
//     success: parseClasses
//   })
// }

// function parseClasses(xml){
//   classes = $(xml).find("class");
//   races = $(xml).find("race");
//   feats = $(xml).find("feat");
//   backgrounds = $(xml).find("background");
//   setupTA();
// }

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
  {
    name: 'classes',
    source: classSubstringMatcher(classes),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Classes</h4>'
    }
  },
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

  $.each(spells, function(i, spell){
    if($(spell).find("name").text() == sug){
      ret = spell;
      return false;
    }
  });
  // if we're here it's not a spell
  $.each(items, function(i, item){
    if($(item).find("name").text() == sug){
      ret = item;
      return false;
    }
  });
  // if we're here it's not a spell or item
  $.each(monsters, function(i, monster){
    if($($(monster).find("name")[0]).text() == sug){
      ret = monster;
      return false;
    }
  });
  // if we're here it's not a spell, item, or monster
  $.each(classes, function(i, cl){
    if($($(cl).find("name")[0]).text() == sug){
      ret = cl;
      return false;
    }
  });
  return ret;
}

//------ UTIL methods

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}