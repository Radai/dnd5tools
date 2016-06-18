var spells, items, monsters;
var races, feats, backgrounds, classes;

$(document).ready(function(){

  $.when(
    $.ajax({
      type: 'GET',
      cache: true,
      url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Compendiums/Full%20Compendium.xml',
      crossDomain: true,
      dataType: 'xml',
    }),
    $.ajax({
      type: 'GET',
      cache: true,
      url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Homebrew/Blood%20Hunter.xml',
      crossDomain: true,
      dataType: 'xml',
    })
  ).then(function(full, bh){
    //build full xml object then parse it
    var bloodhunter = $(bh).find("class");
    $(full[0]).find("compendium")[0].appendChild(bloodhunter[0]);

    parseAll(full[0]);
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
  var nodes = info.childNodes;
  var firstText = true;

  // use reflection to build out info card
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

  //show it too
  $("#results").show();

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
  populateBrowseMenus();
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
    source: substringMatcher(spells),
    limit: 10,
    templates: {
      header: '<h4 id="queryheader">Spells</h4>'
    }
  },
  {
    name: 'classes',
    source: substringMatcher(classes),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Classes</h4>'
    }
  },
  {
    name: 'items',
    source: substringMatcher(items),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Items</h4>'
    }
  },
  {
    name: 'monsters',
    source: substringMatcher(monsters),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Monsters</h4>'
    }
  },
  {
    name: 'feats',
    source: substringMatcher(feats),
    limit: 5,
    templates: {
      header: '<h4 id="queryheader">Feats</h4>'
    }
  },
  {
    name: 'backgrounds',
    source: substringMatcher(backgrounds),
    limit: 2,
    templates: {
      header: '<h4 id="queryheader">Backgrounds</h4>'
    }
  },
  {
    name: 'races',
    source: substringMatcher(races),
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
      if (substrRegex.test($(str).find("name").first().text())) {
        matches.push($(str).find("name").first().text());
      }
    });

    cb(matches);
  };  
}

function getInfo(sug){
  var ret;

  $.each({classes, races, backgrounds, spells, items, monsters, feats}, function(i, d){
    $(d).each(function(i2, d2){
      if($(d2).find("name").first().text() == sug){
        ret = d2;
        return false;
      }
    });
  });

  return ret;
}

function populateBrowseMenus(){
  var names = [];
  $(".navbar-nav").each(function(i,d){
     names.push($(d).find("a").data("name"));
  });
  $.each({classes, races, backgrounds, spells, items, monsters, feats}, function(){
    var str = "";
    var thing = this;
    $(thing).each(function(){
      str += "<li><a href='#'>"+$(this).find("name").first().text()+"</a></li>";
    });
    $("#"+name+"-menu").append(str);

    // switch(name){
    //   case "class":
    //     classes.each(function(){
    //       $("#class-menu").append("<li><a href='#'>"+$(this).find("name").first().text()+"</a></li>")
    //     });
    //     break;
    // }
  });
}

//------ UTIL methods

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}