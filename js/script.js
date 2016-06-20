var spells, items, monsters;
var races, feats, backgrounds, classes;
var compendium;

jQuery(document).ready(function($){
  $.when(
    $.ajax({
      type: 'GET',
      cache: true,
      url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Compendiums/Full%20Compendium.xml',
      crossDomain: true,
      // dataType: 'xml',
    }),
    $.ajax({
      type: 'GET',
      cache: true,
      url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Homebrew/Blood%20Hunter.xml',
      crossDomain: true,
      // dataType: 'xml',
    })
  ).then(function(full, bh){
    //build full xml object then parse it
    compendium = xml2json.parser(full[0]).compendium;
    compendium.class.push(xml2json.parser(bh[0]).compendium.class);
    delete compendium.version;

    setupTA();
    populateBrowseMenus();
  })

  $('.typeahead').bind("typeahead:active", function(ev){
    $('.typeahead').typeahead('val', '');
  });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    var sp = getInfo(suggestion);

    createCard(sp);
  });
});

function createCard(info){
  $("#results").empty();
  $(".typeahead").blur();
  var firstText = true;

  // use reflection to build out info card
  for(var data in info){;
    if(data != "text"){
      $("#results").append("<label for="+data+">"+data.toTitleCase()+":&nbsp;</label><span id=" + data + ">"+info[data]+"</span><br />");
    }else{ //if node is text node...
      if(firstText == false){
        $("#results").append("<p>" + info[data] + "</p>");
      }else{
        $("#results").append("<label for="+data+">Description:&nbsp;</label><span id='description'>"+info[data]+"</span>");
        firstText = false;
      }
    }
  }

  //show it too
  $("#results").show();

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
    source: substringMatcher(compendium.spell),
    limit: 10,
    templates: {
      header: '<h4 id="queryheader">Spells</h4>'
    }
  },
  {
    name: 'classes',
    source: substringMatcher(compendium.class),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Classes</h4>'
    }
  },
  {
    name: 'items',
    source: substringMatcher(compendium.item),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Items</h4>'
    }
  },
  {
    name: 'monsters',
    source: substringMatcher(compendium.monster),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Monsters</h4>'
    }
  },
  {
    name: 'feats',
    source: substringMatcher(compendium.feat),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Feats</h4>'
    }
  },
  {
    name: 'backgrounds',
    source: substringMatcher(compendium.background),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Backgrounds</h4>'
    }
  },
  {
    name: 'races',
    source: substringMatcher(compendium.race),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Races</h4>'
    }
  });
}

function substringMatcher(strs){
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str.name)) {
        matches.push(str.name);
      }
    });

    cb(matches);
  };  
}

function getInfo(sug){
  var ret;

  for(var type in compendium){
    for(var data in compendium[type]){
      if(compendium[type][data].name == sug){
        return compendium[type][data];
      }
    };
  };

  // return ret;
}

function populateBrowseMenus(){
  var str = "";
  for(var type in compendium){
    str = "";
    for(var data in compendium[type]){
      str += "<li><a href='#'>" + compendium[type][data].name + "</a></li>";
    }
    $("#" + type + "-menu").append(str);;
  }
}

//------ UTIL methods

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}