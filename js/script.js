var compendium = {};
var url = 'http://dl.dropboxusercontent.com/s/skhhsn2qi3ngcmx/data.json?dl=1';

jQuery(document).ready(function($){
  if(sessionStorage.getItem("compendium") == null || sessionStorage.getItem("compendium") == "undefined"){
    $.when(
      // $.ajax({
      //   type: 'GET',
      //   cache: true,
      //   // url: 'https://jsonp.afeld.me/?url=http://dl.dropboxusercontent.com/s/skhhsn2qi3ngcmx/data.json&raw=1',
      //   url: 'data.json',
      //   dataType: 'json',
      // })
      $.get('data.json'),
      $.get('rules.json')
    ).then(function(data, rules){
      //cache JSON for faster load times
      var c;
      c = $.extend(c, data[0], rules[0]);

      try{
        sessionStorage.setItem("compendium", JSON.stringify(c));
      } catch(e) {
        console.log("Couldn't cache the JSON file");
      }
      //assign JSON object
      init(c);
    }).fail(function(){
      console.log("failure loading data")
    });
  }else{ //pull from local cache
    init(JSON.parse(sessionStorage.getItem("compendium")));
  }

  $('.typeahead').bind("typeahead:active", function(ev){
    $('.typeahead').typeahead('val', '');
  });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    var sp = getInfo(suggestion);
    createCard(sp);
  });

  populateChangelog();
});

function init(data){
  compendium = data;

  setupTA();
  populateBrowseMenus();

  //grab query params from URL, if someone linked you to a thing
  var q = decodeURI(location.search.substring(3)); // format: ?q=  - this is stripped out
  if(q != ""){
    $('.typeahead').typeahead('val', q);
    createCard(getInfo(q));
  }
}

function search(query){
  $('.typeahead').typeahead('val', query);
  createCard(getInfo(query));
}

function createCard(info){
  $("#results").empty();
  $(".typeahead").blur();
  var firstText = true;

  var type = info.type;
  delete info.type;

  if(type=="rules"){
    $.each(info, function(k,v){
      if(k == "related") { //create links to related content
        var str = "";
        var len = v.length;
        $.each(v, function(key,val){
          str += "<a href='javascript:search(\""+val+"\")'>"+val+"</a>" + ((key == len - 1) ? "": ", ");
        });
        $("#results").append("<div class='card-"+k+"'><span id='card-"+k+"-key'><b>" + k.toTitleCase() + "</b>:&nbsp;</span><span id='card-"+k+"-value'>" + str + "</span></div>");
      }
      else
      {
        $("#results").append("<div class='card-"+k+"'><span id='card-"+k+"-key'><b>" + k.toTitleCase() + "</b>:&nbsp;</span><span id='card-"+k+"-value'>" + v + "</span></div>");
      }
    })
  }else{
  // use reflection to build out info card
  for(var data in info){
      if(typeof info[data] == "string"){ // simple k, v pair
        $("#results").append("<div class='card-"+data+"'><span id='card-"+data+"-key'><b>" + data.toTitleCase() + "</b>:&nbsp;</span><span id='card-"+data+"-value'>" + info[data] + "</span></div>");
      }else if(data == "text"){
        for(var str in info[data]){
          $("#results").append("<div>"+info[data][str]+"</div>")
        }
      }else if(info[data] != undefined){ // has object or array of objects inside val
        var str = "<table><tbody><tr><th class='trait'>"+data.toTitleCase()+":</th><td><table><tbody><tr>";
        for(var k in info[data]){
          var val = info[data][k];
          if(val == "") continue;
          if(val.name){
            str += "<tr><td><b>" + val.name + "</b></td></tr>";
          }
          if(val.text){
            str += "<tr><td>"+val.text+"</td></tr>";
          }
          if(val.attack){
            str += "<tr><td><i>"+val.attack+"</i></td></tr>";
          }
          if(val._level){ //primarily for autolevel stuffs
            // str += "<table><tbody><tr><th>"+k.toTitleCase()+":</th><tr><table><tbody><tr>"
            str += "<table><tbody><tr><th>Level:"+val._level+"</th><tr><table><tbody><tr>"
            for(var j in val){
              if(typeof val[j] == "object"){
                for(var l in val[j]){ // print name and text, if text is array, loop over that
                  if(typeof val[j][l].text == "object"){
                    for(var t in val[j][l].text){
                      str += "<tr><td>"+val[j][l].text[t]+"</td></tr>";    
                    }
                  }else{
                    str += "<tr><td><b>"+val[j][l].name+"</b></td></tr></tr><td>"+val[j][l].text+"</td></tr>";  
                  }
                }
              }else{
                // str += "<tr><td>"+val[j].text+"</td></tr>"; //just printing level num? comment out
              }
            } 
            str += "</tr></tbody></table>"
          }
        }
        str += "</tbody></table></td></tr></tbody></table>";
        $("#results").append(str);
      }
    }
  }

  $("#results").show();

  //update url in address bar for linking
  var url = "?q=" + document.getElementById("card-name-value").textContent;
  window.history.pushState({}, 'D&D 5e Compendium', url);
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
  },
  {
    name: 'rules',
    source: ruleSubstringMatcher(compendium.rules),
    limit: 3,
    templates: {
      header: '<h4 id="queryheader">Rules</h4>'
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

function ruleSubstringMatcher(strs){
  return function findMatches(q, cb) {
    var matches, substringRegex;

    matches = [];

    substrRegex = new RegExp(q, 'i');

    $.each(strs, function(i, str){
      if(substrRegex.test(str.name)) {
        matches.push(str.name);
      }
    });

    cb(matches);
  }
}

function getInfo(sug){
  var ret;

  for(var type in compendium){
    for(var data in compendium[type]){
      if(compendium[type][data].name == sug){
        compendium[type][data].type = type;
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
      str += "<li><a href='javascript:search(\""+compendium[type][data].name.replace(/'/,'&apos;')+"\")'>" + compendium[type][data].name + "</a></li>";
    }
    $("#" + type + "-menu").append(str);;
  }
}

function populateChangelog(){
  $("#changelog").popover({
    content: '<ul id="changelog-list"><li><h6>July 12, 2016</h6>Added beginning of ruleset, look for abilities/skills. Added this. Search for Conditions to try out something cool. Hope you like!</li></ul>'
  });
}

//------ UTIL methods

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
} 