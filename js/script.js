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
  }else if (type=="monster"){
    $("#results").append(createMonsterCard(info));
  }else {
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
        if (Array.isArray(info[data])){
          for(var k in info[data]){
            var val = info[data][k];
            str += itemSubTable(val);
          }
        }else if (typeof info[data] ==='object'){
          str += itemSubTable(info[data]);
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


function itemSubTable(val){
  var str = "";
  if(val == "") return "";
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
          }else if (val[j][l].name && val[j][l].text){
            str += "<tr><td><b>"+val[j][l].name+"</b></td></tr></tr><td>"+val[j][l].text+"</td></tr>";
          }
        }
      }else{
        // str += "<tr><td>"+val[j].text+"</td></tr>"; //just printing level num? comment out
      }
    }
    str += "</tr></tbody></table>"
  }
  return str;
}

//Custom layout for monster cards
function createMonsterCard(monster){
  var str="";
  str += "<div class=\"card-name\"><span id=\"card-name-value\">"+monster.name+"</span></div>";

  str += "<i>"+monsterSize(monster.size.toUpperCase())+", "+ monster.alignment+"</i><br>";
  if (monster.ac) str += printMonsterStat("Armor Class", monster.ac);
  if (monster.hp) str += printMonsterStat("Hit Points", monster.hp);
  if (monster.speed) str += printMonsterStat("Speed", monster.speed);
  str += "<hr>";

  //statblock
  str +="<div id=\"statblock\">";
    str +="<div><b>STR</b><br>"+monster.str+"("+(monster.str>9?"+":"")+Math.floor(((monster.str)-10)/2)+")</div>";
    str +="<div><b>DEX</b><br>"+monster.dex+"("+(monster.dex>9?"+":"")+Math.floor(((monster.dex)-10)/2)+")</div>";
    str +="<div><b>CON</b><br>"+monster.con+"("+(monster.con>9?"+":"")+Math.floor(((monster.con)-10)/2)+")</div>";
    str +="<div><b>INT</b><br>"+monster.int+"("+(monster.int>9?"+":"")+Math.floor(((monster.int)-10)/2)+")</div>";
    str +="<div><b>WIS</b><br>"+monster.wis+"("+(monster.wis>9?"+":"")+Math.floor(((monster.wis)-10)/2)+")</div>";
    str +="<div><b>CHA</b><br>"+monster.cha+"("+(monster.cha>9?"+":"")+Math.floor(((monster.cha)-10)/2)+")</div>";
  str +="</div>"
  str += "<hr>";

  if (monster.save) str += printMonsterStat("Saving Throws", monster.save);
  if (monster.skill) str += printMonsterStat("Skills", monster.skill);
  if (monster.vulnerable) str += printMonsterStat("Damage Vulnerabilities", monster.vulnerable);
  if (monster.resist) str += printMonsterStat("Damage Resistances", monster.resist);
  if (monster.immune) str += printMonsterStat("Damage Immunities", monster.immune);
  if (monster.conditionImmune) str += printMonsterStat("Condition Immunities", monster.conditionImmune);
  str+= "<b>Senses</b> ";
  if (monster.senses) str +=  monster.senses;
  if (monster.senses && monster.passive) str +=", ";
  if (monster.passive) str += "passive Perception "+monster.passive;
  str+= "<br>\n";
  if (monster.languages) str += printMonsterStat("Languages", monster.languages);
  if (monster.cr) str += `<b>Challenge</b> ${monster.cr}(${xpByCR(monster.cr).toLocaleString()} XP)`;


  //traits
  if(monster.trait){
    str +="<hr>";
    if (Array.isArray(monster.trait)){
      for(i in monster.trait){
        str += printMonsterDetail(monster.trait[i].name, monster.trait[i].text);
      }
    }else{
      str += printMonsterDetail(monster.trait.name, monster.trait.text);
    }
  }

  //Actions
  if(monster.action){
    str += "<div class=\"monster-sub-title\">Actions</div>";
    if (Array.isArray(monster.action)){
      for(i in monster.action){
        str += printMonsterDetail(monster.action[i].name, monster.action[i].text);
      }
    }else{
      str += printMonsterDetail(monster.action.name, monster.action.text);
    }
  }

  //Reactions
  if(monster.reaction){
    str += "<div class=\"monster-sub-title\">Reactions</div>";
    if (Array.isArray(monster.reaction)){
      for(i in monster.reaction){
        str += printMonsterDetail(monster.reaction[i].name, monster.reaction[i].text);
      }
    }else{
      str += printMonsterDetail(monster.reaction.name, monster.reaction.text);
    }
  }
  //Legendary
  if(monster.legendary){
    str += "<div class=\"monster-sub-title\">Legendary Actions</div>";
    if (Array.isArray(monster.legendary)){
      for(i in monster.legendary){
        str += printMonsterDetail(monster.legendary[i].name, monster.legendary[i].text);
      }
    }else{
      str += printMonsterDetail(monster.legendary.name, monster.legendary.text);
    }
  }


  return str;
}

function printMonsterStat(name, value){
    return `<b>${name}</b> ${value}<br>\n`;
}

function printMonsterDetail(name, value){
  if (Array.isArray(value)){
    var str = "<div class=\"monster-detail\"><b><i>"+name+"</i></b>";
    for(line in value){
      if (value[line]=== "") continue;
      str +=" "+ value[line]+"<br>";
    }
    str += "</div>";
    return str;
  }else{
    return `<div class="monster-detail"><b><i>${name}.</i></b> ${value}</div>\n`;
  }
}

function xpByCR(cr){
  switch(cr){
    case "0":
      return 10;
    case "1/8":
      return 25;
    case "1/4":
      return 50;
    case "1/2":
      return 100;
    case "1":
      return 200;
    case "2":
      return 450;
    case "3":
      return 700;
    case "4":
      return 1100;
    case "5":
      return 1800;
    case "6":
      return 2300;
    case "7":
      return 2900;
    case "8":
      return 3900;
    case "9":
      return 5000;
    case "10":
      return 5900;
    case "11":
      return 7200;
    case "12":
      return 8400;
    case "13":
      return 10000;
    case "14":
      return 11500;
    case "15":
      return 13000;
    case "16":
      return 15000;
    case "17":
      return 18000;
    case "18":
      return 20000;
    case "19":
      return 22000;
    case "20":
      return 25000;
    case "21":
      return 33000;
    case "22":
      return 41000;
    case "23":
      return 50000;
    case "24":
      return 62000;
    case "25":
      return 75000;
    case "26":
      return 90000;
    case "27":
      return 105000;
    case "28":
      return 120000;
    case "29":
      return 135000;
    case "30":
      return 155000;
    default:
      return 0;
  }
}

function monsterSize(size){
  switch(size){
    case 'T':
      size = "Tiny";
      break;
    case 'S':
      size = "Small";
      break;
    case 'M':
      size = "Medium";
      break;
    case 'L':
      size = "Large";
      break;
    case 'H':
      size = "Huge";
      break;
    case 'G':
      size = "Gargantuan";
      break;
    default:
      size = "Unknown";
  }
  return size;
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
    content: '<ul id="changelog-list"><li><h6>February 24, 2017</h6>Merged style <a href="https://github.com/Radai/dnd5tools/pull/24" target="_blank">changes</a> from <a href="https://github.com/groke" target="_blank">groke</a> which make monsters look more like they do in the book. Fixed searching for the Shield spell and getting the item, if you want the item it\'s under Shield (item) now, otherwise hey, it\'s +2 to AC, duh.</li><li><h6>July 12, 2016</h6>Added beginning of ruleset, look for abilities/skills. Added this. Search for Conditions to try out something cool. Hope you like!</li></ul>'
  });
}

//------ UTIL methods

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
